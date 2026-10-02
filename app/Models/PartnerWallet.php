<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class PartnerWallet extends Model { protected $fillable=['partner_id','currency','pending_balance','available_balance','paid_balance']; protected $casts=['pending_balance'=>'decimal:2','available_balance'=>'decimal:2','paid_balance'=>'decimal:2']; }