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
use Illuminate\Support\Str;

class AdminPartnerController extends Controller
{
    protected function admin(Request $request): void
    {
        abort_unless(in_array($request->user()?->role,['admin','super_admin'],true),403);
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
            return response()->json(['application'=>$application->fresh(),'partner'=>$partner,'user'=>$user]);
        });
    }

    public function partners(Request $request)
    {
        $this->admin($request);
        return response()->json(Partner::with(['user','wallet'])->latest()->paginate(25));
    }

    public function setCommission(Request $request, Order $order)
    {
        $this->admin($request);
        abort_unless($order->partner_id,422,'Order has no partner assigned.');
        abort_if(!in_array($order->payment_status,['paid','completed'],true),422,'Client payment must be received before commission approval.');
        abort_if($order->commission()->whereIn('status',['approved','payable','paid'])->exists(),422,'Commission is already locked.');
        $data=$request->validate([
            'commission_type'=>['required','in:percentage,fixed'],
            'commission_value'=>['required','numeric','min:0'],
            'notes'=>['nullable','string','max:2000'],
        ]);
        $gross=(float)$order->total;
        $partnerAmount=$data['commission_type']==='percentage'
            ? round($gross*((float)$data['commission_value']/100),2)
            : round((float)$data['commission_value'],2);
        abort_if($partnerAmount<0 || $partnerAmount>$gross,422,'Partner commission cannot exceed the client payment.');
        $dsh=round($gross-$partnerAmount,2);
        $commission=Commission::updateOrCreate(['order_id'=>$order->id],[
            'partner_id'=>$order->partner_id,'gross_amount'=>$gross,'commission_type'=>$data['commission_type'],'commission_value'=>$data['commission_value'],
            'partner_amount'=>$partnerAmount,'dsh_amount'=>$dsh,'currency'=>$order->currency,'status'=>'approved','approved_by'=>$request->user()->id,'approved_at'=>now(),'notes'=>$data['notes']??null
        ]);
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
