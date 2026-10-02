<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Models\Order;
use App\Models\Partner;
use App\Models\PartnerApplication;
use App\Models\PartnerWallet;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AdminPartnerController extends Controller
{
    protected const ONBOARDING_ITEMS = ['profile','portfolio','services','social','business_email','payout_account'];

    protected function admin(Request $request): void
    {
        abort_unless(in_array($request->user()?->role,['admin','super_admin'],true),403);
    }

    protected function ensureOnboardingRows(int $partnerId): void
    {
        if (!Schema::hasTable('partner_onboarding_items')) return;
        foreach (self::ONBOARDING_ITEMS as $type) {
            DB::table('partner_onboarding_items')->updateOrInsert(
                ['partner_id'=>$partnerId,'item_type'=>$type],
                ['status'=>'pending','created_at'=>now(),'updated_at'=>now()]
            );
        }
    }

    protected function onboardingFor(Partner $partner): array
    {
        $this->ensureOnboardingRows($partner->id);
        $rows = Schema::hasTable('partner_onboarding_items')
            ? DB::table('partner_onboarding_items')->where('partner_id',$partner->id)->get()->keyBy('item_type')
            : collect();

        $counts = [
            'profile' => ($partner->legal_name && $partner->cnic && $partner->date_of_birth && $partner->father_name && $partner->real_phone && $partner->whatsapp_number && $partner->profile_photo) ? 1 : 0,
            'portfolio' => $partner->portfolioItems()->count(),
            'services' => $partner->services()->count(),
            'social' => $partner->socialAccounts()->count(),
            'business_email' => $partner->businessEmail()->exists(),
            'payout_account' => $partner->payoutAccounts()->count(),
        ];

        return collect(self::ONBOARDING_ITEMS)->mapWithKeys(function($type) use ($rows,$counts) {
            $row=$rows->get($type);
            return [$type=>[
                'status'=>$row->status ?? 'pending',
                'has_data'=>(bool)$counts[$type],
                'admin_notes'=>$row->admin_notes ?? null,
                'reviewed_at'=>$row->reviewed_at ?? null,
            ]];
        })->all();
    }

    public function applications(Request $request)
    {
        $this->admin($request);
        return response()->json(PartnerApplication::with(['skills.skill','interviews'])->latest()->paginate(25));
    }

    public function application(Request $request, PartnerApplication $application)
    {
        $this->admin($request);
        return response()->json($application->load(['skills.skill','interviews']));
    }

    public function updateApplication(Request $request, PartnerApplication $application)
    {
        $this->admin($request);
        $data=$request->validate(['status'=>['required','in:pending,screening,shortlisted,interview_scheduled,interviewed,approved,rejected,withdrawn'],'admin_notes'=>['nullable','string','max:5000']]);
        $application->update($data);
        return response()->json($application->fresh());
    }

    public function approveApplication(Request $request, PartnerApplication $application)
    {
        $this->admin($request);
        abort_if($application->status==='rejected',422,'Rejected applications cannot be approved without reopening.');
        return DB::transaction(function() use($application,$request){
            $user=$application->user;
            if(!$user){
                $user=\App\Models\User::create(['name'=>$application->full_name,'email'=>$application->email,'phone'=>$application->phone,'password'=>Str::random(32),'role'=>'partner','is_active'=>true]);
                $application->user_id=$user->id;
            } else { $user->update(['role'=>'partner','is_active'=>true]); }
            $slug=Str::slug($application->full_name).'-'.Str::lower(Str::random(5));
            $partner=Partner::firstOrCreate(['user_id'=>$user->id],[
                'partner_code'=>'DSH-P-'.str_pad((string)$user->id,6,'0',STR_PAD_LEFT),'slug'=>$slug,'display_name'=>$application->full_name,
                'bio'=>$application->bio,'country'=>$application->country,'city'=>$application->city,'status'=>'active','verification_status'=>'verified','joined_at'=>now(),'approved_at'=>now()
            ]);
            PartnerWallet::firstOrCreate(['partner_id'=>$partner->id],['currency'=>'USD']);
            $application->update(['user_id'=>$user->id,'status'=>'approved','submitted_at'=>$application->submitted_at ?: now()]);
            $this->ensureOnboardingRows($partner->id);

            DB::afterCommit(function () use ($user) {
                $token = Password::broker()->createToken($user);
                $user->notify(new \App\Notifications\DshPasswordResetNotification($token, true));
            });
            return response()->json(['application'=>$application->fresh(),'partner'=>$partner,'user'=>$user]);
        });
    }

    public function partners(Request $request)
    {
        $this->admin($request);
        $paginator=Partner::with(['user','wallet','portfolioItems','services','socialAccounts','payoutAccounts','businessEmail'])->latest()->paginate(25);
        $paginator->getCollection()->transform(function($partner){
            $partner->setAttribute('onboarding',$this->onboardingFor($partner));
            $partner->setAttribute('change_requests',Schema::hasTable('partner_change_requests')
                ? DB::table('partner_change_requests')->where('partner_id',$partner->id)->where('status','pending')->count() : 0);
            return $partner;
        });
        return response()->json($paginator);
    }

    public function updateOnboarding(Request $request, Partner $partner, string $item)
    {
        $this->admin($request);
        abort_unless(in_array($item,self::ONBOARDING_ITEMS,true),404,'Unknown onboarding item.');
        $data=$request->validate([
            'status'=>['required','in:pending,approved,revision_required,rejected'],
            'admin_notes'=>['nullable','string','max:5000'],
        ]);
        $this->ensureOnboardingRows($partner->id);
        DB::table('partner_onboarding_items')->where('partner_id',$partner->id)->where('item_type',$item)->update([
            'status'=>$data['status'],'admin_notes'=>$data['admin_notes']??null,'reviewed_by'=>$request->user()->id,'reviewed_at'=>now(),'updated_at'=>now(),
        ]);
        return response()->json(['item'=>$item,'status'=>$data['status'],'admin_notes'=>$data['admin_notes']??null]);
    }

    public function changeRequests(Request $request)
    {
        $this->admin($request);
        abort_unless(Schema::hasTable('partner_change_requests'),404);
        return response()->json(DB::table('partner_change_requests')->join('partners','partners.id','=','partner_change_requests.partner_id')->join('users','users.id','=','partners.user_id')
            ->select('partner_change_requests.*','partners.display_name','partners.partner_code','users.email')->orderByDesc('partner_change_requests.id')->paginate(25));
    }

    public function reviewChangeRequest(Request $request, int $changeRequest)
    {
        $this->admin($request);
        $data=$request->validate([
            'status'=>['required','in:approved,rejected'],
            'admin_response'=>['nullable','string','max:5000'],
        ]);
        $row=DB::table('partner_change_requests')->where('id',$changeRequest)->first();
        abort_unless($row,404,'Change request not found.');
        DB::transaction(function() use($row,$data,$request){
            DB::table('partner_change_requests')->where('id',$row->id)->update([
                'status'=>$data['status'],'admin_response'=>$data['admin_response']??null,'reviewed_by'=>$request->user()->id,'reviewed_at'=>now(),'updated_at'=>now(),
            ]);
            if ($data['status']==='approved') {
                $this->ensureOnboardingRows($row->partner_id);
                DB::table('partner_onboarding_items')->where('partner_id',$row->partner_id)->where('item_type',$row->item_type)->update([
                    'status'=>'revision_required','admin_notes'=>$data['admin_response']??'Partner requested changes.','updated_at'=>now(),
                ]);
            }
        });
        return response()->json(DB::table('partner_change_requests')->where('id',$changeRequest)->first());
    }

    public function deletionRequests(Request $request)
    {
        $this->admin($request);
        return response()->json(DB::table('partner_deletion_requests')
            ->join('partners','partners.id','=','partner_deletion_requests.partner_id')
            ->join('users','users.id','=','partners.user_id')
            ->select('partner_deletion_requests.*','partners.display_name','partners.partner_code','users.email')
            ->orderByDesc('partner_deletion_requests.id')->paginate(25));
    }

    public function reviewDeletionRequest(Request $request, int $deletionRequest)
    {
        $this->admin($request);
        $data=$request->validate([
            'status'=>['required','in:approved,rejected'],
            'admin_response'=>['nullable','string','max:5000'],
        ]);
        $row=DB::table('partner_deletion_requests')->where('id',$deletionRequest)->first();
        abort_unless($row,404,'Deletion request not found.');
        abort_if($row->status!=='pending',422,'This deletion request has already been reviewed.');

        DB::transaction(function() use($row,$data,$request){
            if ($data['status']==='rejected') {
                DB::table('partner_deletion_requests')->where('id',$row->id)->update([
                    'status'=>'rejected','admin_response'=>$data['admin_response']??null,
                    'reviewed_by'=>$request->user()->id,'reviewed_at'=>now(),'updated_at'=>now(),
                ]);
                return;
            }

            $partner=Partner::findOrFail($row->partner_id);
            if ($row->target_type==='profile') {
                if ($partner->profile_photo) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($partner->profile_photo);
                }
                $partner->update([
                    'legal_name'=>null,'cnic'=>null,'date_of_birth'=>null,'father_name'=>null,
                    'real_phone'=>null,'whatsapp_number'=>null,'profile_photo'=>null,
                ]);
                if (Schema::hasTable('partner_onboarding_items')) {
                    DB::table('partner_onboarding_items')->where('partner_id',$partner->id)->where('item_type','profile')->update([
                        'status'=>'pending','admin_notes'=>$data['admin_response']??'Profile identity data removed by admin approval.','reviewed_by'=>$request->user()->id,'reviewed_at'=>now(),'updated_at'=>now(),
                    ]);
                }
            } elseif ($row->target_type==='business_email') {
                $partner->businessEmail()->delete();
                if (Schema::hasTable('partner_onboarding_items')) {
                    DB::table('partner_onboarding_items')->where('partner_id',$partner->id)->where('item_type','business_email')->update([
                        'status'=>'pending','admin_notes'=>$data['admin_response']??'Business email removed by admin approval.','reviewed_by'=>$request->user()->id,'reviewed_at'=>now(),'updated_at'=>now(),
                    ]);
                }
            } elseif ($row->target_type==='payout_account') {
                $account=$partner->payoutAccounts()->findOrFail($row->target_id);
                abort_if(DB::table('payout_requests')->where('payout_account_id',$account->id)->whereIn('status',['pending','processing'])->exists(),422,'This payout account has an active payout request and cannot be deleted.');
                $account->delete();
                if (Schema::hasTable('partner_onboarding_items') && $partner->payoutAccounts()->count()===0) {
                    DB::table('partner_onboarding_items')->where('partner_id',$partner->id)->where('item_type','payout_account')->update([
                        'status'=>'pending','admin_notes'=>$data['admin_response']??'Payout account removed by admin approval.','reviewed_by'=>$request->user()->id,'reviewed_at'=>now(),'updated_at'=>now(),
                    ]);
                }
            } elseif ($row->target_type==='partner_account') {
                $user=$partner->user;
                $partner->delete();
                if ($user && $user->role==='partner') $user->delete();
            }

            DB::table('partner_deletion_requests')->where('id',$row->id)->update([
                'status'=>'approved','admin_response'=>$data['admin_response']??null,
                'reviewed_by'=>$request->user()->id,'reviewed_at'=>now(),'updated_at'=>now(),
            ]);
        });

        return response()->json(['message'=>'Deletion request reviewed successfully.']);
    }

    public function businessEmail(Request $request, Partner $partner)
    {
        $this->admin($request);
        $data=$request->validate([
            'email_address'=>['required','email','max:255'],
            'mailbox_provider'=>['nullable','string','max:100'],
            'status'=>['required','in:pending,active,suspended'],
            'quota'=>['nullable','integer','min:0'],
        ]);
        $account=$partner->businessEmail()->updateOrCreate(['partner_id'=>$partner->id],$data);
        $this->ensureOnboardingRows($partner->id);
        DB::table('partner_onboarding_items')->where('partner_id',$partner->id)->where('item_type','business_email')->update([
            'status'=>$data['status']==='active'?'approved':'pending','reviewed_by'=>$request->user()->id,'reviewed_at'=>now(),'updated_at'=>now(),
        ]);
        return response()->json($account);
    }

    public function deletePartner(Request $request, Partner $partner)
    {
        $this->admin($request);
        return DB::transaction(function() use($partner){
            $user=$partner->user;
            $partner->delete();
            if ($user && $user->role==='partner') $user->delete();
            return response()->json(['message'=>'Partner deleted successfully.']);
        });
    }

    public function setCommission(Request $request, Order $order)
    {
        $this->admin($request);
        abort_unless($order->partner_id,422,'Order has no partner assigned.');
        abort_if(!in_array($order->payment_status,['paid','completed'],true),422,'Client payment must be received before commission approval.');
        abort_if($order->commission()->whereIn('status',['approved','payable','paid'])->exists(),422,'Commission is already locked.');
        $data=$request->validate(['commission_type'=>['required','in:percentage,fixed'],'commission_value'=>['required','numeric','min:0'],'notes'=>['nullable','string','max:2000']]);
        $gross=(float)$order->total;
        $partnerAmount=$data['commission_type']==='percentage'?round($gross*((float)$data['commission_value']/100),2):round((float)$data['commission_value'],2);
        abort_if($partnerAmount<0 || $partnerAmount>$gross,422,'Partner commission cannot exceed the client payment.');
        $dsh=round($gross-$partnerAmount,2);
        $commission=Commission::updateOrCreate(['order_id'=>$order->id],['partner_id'=>$order->partner_id,'gross_amount'=>$gross,'commission_type'=>$data['commission_type'],'commission_value'=>$data['commission_value'],'partner_amount'=>$partnerAmount,'dsh_amount'=>$dsh,'currency'=>$order->currency,'status'=>'approved','approved_by'=>$request->user()->id,'approved_at'=>now(),'notes'=>$data['notes']??null]);
        return response()->json(['commission'=>$commission,'breakdown'=>['client_paid'=>$gross,'partner_amount'=>$partnerAmount,'dsh_amount'=>$dsh]]);
    }

    public function releaseCommission(Request $request, Commission $commission)
    {
        $this->admin($request);
        abort_unless($commission->status==='approved',422,'Commission is not awaiting release.');
        return DB::transaction(function() use($commission){
            $commission->update(['status'=>'payable','payable_at'=>now()]);
            $wallet=PartnerWallet::where('partner_id',$commission->partner_id)->lockForUpdate()->firstOrFail();
            $wallet->available_balance=(float)$wallet->available_balance+(float)$commission->partner_amount; $wallet->save();
            $tx=WalletTransaction::create(['partner_id'=>$commission->partner_id,'commission_id'=>$commission->id,'type'=>'commission_credit','amount'=>$commission->partner_amount,'currency'=>$commission->currency,'balance_after'=>$wallet->available_balance,'description'=>'Commission released for order #'.$commission->order_id]);
            return response()->json(['commission'=>$commission->fresh(),'wallet'=>$wallet,'transaction'=>$tx]);
        });
    }

    public function commissions(Request $request)
    {
        $this->admin($request);
        return response()->json(Commission::with(['order','partner'])->latest()->paginate(25));
    }
}
