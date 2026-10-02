<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayoutAccount extends Model
{
    protected $fillable = ['partner_id','method','account_name','account_details','is_default','is_verified'];

    protected $casts = [
        'is_default' => 'boolean',
        'is_verified' => 'boolean',
    ];
}
