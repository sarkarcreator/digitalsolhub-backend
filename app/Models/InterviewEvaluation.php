<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class InterviewEvaluation extends Model { protected $fillable=['interview_id','criteria','rating','comments']; public function interview(){return $this->belongsTo(Interview::class);} }