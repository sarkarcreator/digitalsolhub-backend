<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class PartnerPortfolio extends Model { protected $fillable=['partner_id','headline','about','experience','education','location','website','is_public']; protected $casts=['is_public'=>'boolean']; }