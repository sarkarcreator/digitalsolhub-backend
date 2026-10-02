<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Partner extends Model {
 protected $fillable=['user_id','partner_code','slug','display_name','professional_title','bio','profile_photo','cover_photo','country','city','timezone','status','verification_status','joined_at','approved_at','suspended_at'];
 protected $casts=['joined_at'=>'datetime','approved_at'=>'datetime','suspended_at'=>'datetime'];
 public function user(){return $this->belongsTo(User::class);}
 public function portfolio(){return $this->hasOne(PartnerPortfolio::class);}
 public function portfolioItems(){return $this->hasMany(PortfolioItem::class);}
 public function services(){return $this->hasMany(PartnerService::class);}
 public function wallet(){return $this->hasOne(PartnerWallet::class);}
 public function commissions(){return $this->hasMany(Commission::class);}
 public function orders(){return $this->hasMany(Order::class);}
 public function socialAccounts(){return $this->hasMany(SocialAccount::class);}
}