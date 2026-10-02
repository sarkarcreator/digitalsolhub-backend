<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BusinessEmailAccount;
use App\Models\Commission;
use App\Models\Order;
use App\Models\Partner;
use App\Models\PartnerApplication;
use App\Models\PartnerPortfolio;
use App\Models\PartnerService;
use App\Models\PortfolioItem;
use App\Models\Service;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PartnerController extends Controller
{
    protected function partner(Request $request): Partner
    {
        abort_unless($request->user()?->role === 'partner', 403);
        return Partner::where('user_id', $request->user()->id)->firstOrFail();
    }

    public function dashboard(Request $request)
    {
        $partner=$this->partner($request);
        $wallet=$partner->wallet;
        return response()->json([
            'partner'=>$partner->load(['portfolio','services.service','portfolioItems']),
            'stats'=>[
                'activeServices'=>$partner->services()->where('is_active',true)->count(),
                'activeOrders'=>$partner->orders()->whereIn('status',['accepted','in_progress','submitted','revision'])->count(),
                'completedOrders'=>$partner->orders()->where('status','completed')->count(),
                'totalEarned'=>(float) $partner->commissions()->whereIn('status',['payable','paid'])->sum('partner_amount'),
                'pendingCommission'=>(float) $partner->commissions()->where('status','approved')->sum('partner_amount'),
                'availableBalance'=>(float) ($wallet?->available_balance ?? 0),
            ],
            'recentOrders'=>$partner->orders()->with(['commission','payments'])->latest()->limit(10)->get(),
        ]);
    }

    public function profile(Request $request)
    {
        $partner=$this->partner($request);
        return response()->json($partner->load('portfolio'));
    }

    public function updateProfile(Request $request)
    {
        $partner=$this->partner($request);
        $data=$request->validate([
            'display_name'=>['required','string','max:120'],'professional_title'=>['nullable','string','max:180'],
            'bio'=>['nullable','string','max:5000'],'country'=>['nullable','string','max:100'],'city'=>['nullable','string','max:100'],
            'timezone'=>['nullable','string','max:80'],'profile_photo'=>['nullable','string','max:1000'],'cover_photo'=>['nullable','string','max:1000'],
        ]);
        $partner->update($data);
        $portfolio=$partner->portfolio()->updateOrCreate(['partner_id'=>$partner->id],[
            'headline'=>$request->input('headline'),'about'=>$request->input('about'),'experience'=>$request->input('experience'),
            'education'=>$request->input('education'),'location'=>$request->input('location'),'website'=>$request->input('website'),
            'is_public'=>$request->boolean('is_public',true),
        ]);
        return response()->json($partner->fresh()->load('portfolio'));
    }

    public function services(Request $request)
    {
        return response()->json($this->partner($request)->services()->with(['service','packages'])->latest()->get());
    }

    public function storeService(Request $request)
    {
        $partner=$this->partner($request);
        $data=$request->validate([
            'service_id'=>['required','exists:services,id'],'title'=>['required','string','max:180'],'description'=>['nullable','string','max:5000'],
            'pricing_type'=>['required','in:quote,fixed,starting_at'],'starting_price'=>['nullable','numeric','min:0'],'currency'=>['nullable','string','max:10'],
            'delivery_days'=>['nullable','integer','min:1'],'is_active'=>['nullable','boolean'],'is_featured'=>['nullable','boolean'],
        ]);
        return response()->json($partner->services()->create($data)->load('service'),201);
    }

    public function updateService(Request $request, PartnerService $service)
    {
        $partner=$this->partner($request);
        abort_unless($service->partner_id===$partner->id,403);
        $data=$request->validate(['title'=>['required','string','max:180'],'description'=>['nullable','string'],'pricing_type'=>['required','in:quote,fixed,starting_at'],'starting_price'=>['nullable','numeric','min:0'],'currency'=>['nullable','string','max:10'],'delivery_days'=>['nullable','integer','min:1'],'is_active'=>['nullable','boolean'],'is_featured'=>['nullable','boolean']]);
        $service->update($data);
        return response()->json($service->fresh()->load('service'));
    }

    public function portfolio(Request $request)
    {
        return response()->json($this->partner($request)->portfolioItems()->latest()->get());
    }

    public function storePortfolio(Request $request)
    {
        $partner=$this->partner($request);
        $data=$request->validate(['title'=>['required','string','max:180'],'description'=>['nullable','string'],'project_url'=>['nullable','url','max:1000'],'client_name'=>['nullable','string','max:180'],'thumbnail'=>['nullable','string','max:1000'],'media'=>['nullable','array'],'category'=>['nullable','string','max:120'],'completed_at'=>['nullable','date'],'is_featured'=>['nullable','boolean'],'is_public'=>['nullable','boolean']]);
        $data['slug']=Str::slug($data['title']).'-'.Str::lower(Str::random(6));
        return response()->json($partner->portfolioItems()->create($data),201);
    }

    public function updatePortfolio(Request $request, PortfolioItem $item)
    {
        $partner=$this->partner($request); abort_unless($item->partner_id===$partner->id,403);
        $data=$request->validate(['title'=>['required','string','max:180'],'description'=>['nullable','string'],'project_url'=>['nullable','url','max:1000'],'client_name'=>['nullable','string','max:180'],'thumbnail'=>['nullable','string','max:1000'],'media'=>['nullable','array'],'category'=>['nullable','string','max:120'],'completed_at'=>['nullable','date'],'is_featured'=>['nullable','boolean'],'is_public'=>['nullable','boolean'],'sort_order'=>['nullable','integer','min:0']]);
        $item->update($data); return response()->json($item->fresh());
    }

    public function commissions(Request $request)
    {
        return response()->json($this->partner($request)->commissions()->with('order')->latest()->paginate(25));
    }

    public function wallet(Request $request)
    {
        $partner=$this->partner($request); $wallet=$partner->wallet()->firstOrCreate(['partner_id'=>$partner->id],['currency'=>'USD']);
        return response()->json(['wallet'=>$wallet,'transactions'=>WalletTransaction::where('partner_id',$partner->id)->latest()->paginate(25)]);
    }

    public function orders(Request $request)
    {
        return response()->json($this->partner($request)->orders()->with(['commission','payments'])->latest()->paginate(25));
    }

    public function publicProfile(string $slug)
    {
        $partner=Partner::where('slug',$slug)->where('status','active')->firstOrFail();
        return response()->json($partner->load(['portfolio','portfolioItems'=>fn($q)=>$q->where('is_public',true),'services'=>fn($q)=>$q->where('is_active',true)->with('service'),'socialAccounts']));
    }
}
