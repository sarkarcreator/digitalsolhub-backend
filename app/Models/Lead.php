<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = [
        'client_id','partner_id','service_id','source','name','email','phone',
        'message','budget','currency','status','assigned_at'
    ];

    protected $casts = [
        'budget' => 'decimal:2',
        'assigned_at' => 'datetime',
    ];
}
