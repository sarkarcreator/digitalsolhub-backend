<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class PartnerApplicationSkill extends Model { protected $fillable=['application_id','skill_id','experience_years','skill_level']; public function skill(){return $this->belongsTo(Skill::class);} }