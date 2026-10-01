<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Interview extends Model { protected $fillable=['application_id','interviewer_id','scheduled_at','duration_minutes','meeting_type','meeting_url','status','score','notes','recommendation']; protected $casts=['scheduled_at'=>'datetime']; public function application(){return $this->belongsTo(PartnerApplication::class,'application_id');} public function evaluations(){return $this->hasMany(InterviewEvaluation::class);} }