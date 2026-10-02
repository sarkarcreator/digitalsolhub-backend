<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Payment extends Model { protected $fillable=['order_id','client_id','provider','external_transaction_id','amount','currency','status','metadata','paid_at']; protected $casts=['amount'=>'decimal:2','metadata'=>'array','paid_at'=>'datetime']; }