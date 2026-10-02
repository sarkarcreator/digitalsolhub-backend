<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BusinessEmailAccount;
use App\Models\Lead;
use App\Models\PayoutAccount;
use App\Models\PayoutRequest;
use App\Models\Partner;
use App\Models\SocialAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;

class PartnerWorkspaceController extends Controller
{
    protected function partner(Request $request): Partner
    {
        abort_unless($request->user()?->role === 'partner', 403);
        return Partner::where('user_id', $request->user()->id)->firstOrFail();
    }

    public function resources()
    {
        return response()->json([
            ['id'=>'brand-kit','title'=>'DSH Brand Kit','description'=>'Approved DSH logos, brand guidance and profile assets.','type'=>'Branding','action'=>'Contact DSH Admin'],
            ['id'=>'sales-kit','title'=>'Partner Sales Kit','description'=>'Service presentation, proposal structure and client communication guidance.','type'=>'Sales','action'=>'View with DSH'],
            ['id'=>'delivery-checklist','title'=>'Project Delivery Checklist','description'=>'A practical checklist for discovery, delivery, revisions and handover.','type'=>'Operations','action'=>'Use checklist'],
            ['id'=>'ai-tools','title'=>'AI & Productivity Resources','description'=>'Recommended AI workflows and productivity resources for DSH partners.','type'=>'Training','action'=>'Open resources'],
            ['id'=>'support','title'=>'Partner Support','description'=>'Need help with a client, project, payment or technical issue? Contact DSH support.','type'=>'Support','action'=>'Contact support'],
        ]);
    }

    public function socialAccounts(Request $request)
    {
        $partner = $this->partner($request);
        return response()->json(SocialAccount::where('partner_id',$partner->id)->latest()->get());
    }

    public function storeSocialAccount(Request $request)
    {
        $partner = $this->partner($request);
        $data = $request->validate([
            'platform'=>['required','string','max:50'],
            'username'=>['nullable','string','max:150'],
            'display_name'=>['nullable','string','max:180'],
            'profile_url'=>['required','url','max:1000'],
        ]);
        $account = SocialAccount::updateOrCreate(
            ['partner_id'=>$partner->id,'platform'=>Str::lower($data['platform'])],
            array_merge($data,['status'=>'connected','connected_at'=>now()])
        );
        return response()->json($account,201);
    }

    public function deleteSocialAccount(Request $request, SocialAccount $socialAccount)
    {
        $partner = $this->partner($request);
        abort_unless($socialAccount->partner_id === $partner->id,403);
        $socialAccount->delete();
        return response()->json(['message'=>'Social account removed.']);
    }

    public function businessEmail(Request $request)
    {
        $partner = $this->partner($request);
        return response()->json(
            BusinessEmailAccount::where('partner_id',$partner->id)->first()
            ?: ['status'=>'not_provisioned','email_address'=>null,'mailbox_provider'=>null,'quota'=>null]
        );
    }

    public function leads(Request $request)
    {
        $partner = $this->partner($request);
        if (!\Schema::hasTable('leads')) return response()->json([]);
        return response()->json(
            Lead::where('partner_id',$partner->id)->latest()->paginate(25)
        );
    }

    public function payoutAccounts(Request $request)
    {
        $partner = $this->partner($request);
        return response()->json(PayoutAccount::where('partner_id',$partner->id)->latest()->get());
    }

    public function storePayoutAccount(Request $request)
    {
        $partner = $this->partner($request);
        $data = $request->validate([
            'method'=>['required','string','max:50'],
            'account_name'=>['required','string','max:180'],
            'account_details'=>['required','string','max:5000'],
            'is_default'=>['nullable','boolean'],
        ]);
        if ($request->boolean('is_default')) {
            PayoutAccount::where('partner_id',$partner->id)->update(['is_default'=>false]);
        }
        $account = PayoutAccount::create(array_merge($data,[
            'partner_id'=>$partner->id,
            'is_verified'=>false,
        ]));
        return response()->json($account,201);
    }

    public function requestPayout(Request $request)
    {
        $partner = $this->partner($request);
        $wallet = $partner->wallet;
        $data = $request->validate([
            'payout_account_id'=>['required','integer','exists:payout_accounts,id'],
            'amount'=>['required','numeric','min:1'],
        ]);
        abort_unless(
            PayoutAccount::where('id',$data['payout_account_id'])->where('partner_id',$partner->id)->exists(),
            403
        );
        $amount = round((float)$data['amount'],2);
        abort_if($amount > (float)($wallet?->available_balance ?? 0),422,'Requested payout exceeds your available balance.');
        $requestRecord = PayoutRequest::create([
            'partner_id'=>$partner->id,
            'payout_account_id'=>$data['payout_account_id'],
            'amount'=>$amount,
            'currency'=>$wallet?->currency ?? 'USD',
            'status'=>'pending',
        ]);
        return response()->json($requestRecord,201);
    }
}
