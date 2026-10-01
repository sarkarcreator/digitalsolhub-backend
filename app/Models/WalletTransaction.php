<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class WalletTransaction extends Model { protected $fillable=['partner_id','commission_id','type','amount','currency','balance_after','description']; protected $casts=['amount'=>'decimal:2','balance_after'=>'decimal:2']; }