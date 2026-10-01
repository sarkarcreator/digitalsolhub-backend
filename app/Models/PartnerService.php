<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class PartnerService extends Model { protected $fillable=['partner_id','service_id','title','description','pricing_type','starting_price','currency','delivery_days','is_active','is_featured']; protected $casts=['starting_price'=>'decimal:2','is_active'=>'boolean','is_featured'=>'boolean']; public function service(){return $this->belongsTo(Service::class);} public function packages(){return $this->hasMany(ServicePackage::class);} }