<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Service extends Model { protected $fillable=['name','slug','description','icon','image','is_active']; protected $casts=['is_active'=>'boolean']; }