<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class PartnerApplication extends Model {
 protected $fillable=['user_id','application_number','full_name','email','phone','country','city','bio','experience_years','availability','status','admin_notes','submitted_at'];
 protected $casts=['submitted_at'=>'datetime'];
 public function skills(){return $this->hasMany(PartnerApplicationSkill::class,'application_id');}
 public function interviews(){return $this->hasMany(Interview::class,'application_id');}
 public function user(){return $this->belongsTo(User::class);}
}