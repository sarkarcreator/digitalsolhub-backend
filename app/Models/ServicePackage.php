<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ServicePackage extends Model { protected $fillable=['partner_service_id','name','description','price','currency','delivery_days','revisions','features','is_active']; protected $casts=['price'=>'decimal:2','features'=>'array','is_active'=>'boolean']; }