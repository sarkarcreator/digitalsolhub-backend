<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Skill extends Model { protected $fillable=['name','slug','category','description','is_active']; protected $casts=['is_active'=>'boolean']; }