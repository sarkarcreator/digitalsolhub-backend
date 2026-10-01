<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class PayoutRequest extends Model { protected $fillable=['partner_id','payout_account_id','amount','currency','status','approved_by','approved_at','paid_at','transaction_reference','notes']; protected $casts=['amount'=>'decimal:2','approved_at'=>'datetime','paid_at'=>'datetime']; }