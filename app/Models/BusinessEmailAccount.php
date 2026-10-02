<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class BusinessEmailAccount extends Model { protected $fillable=['partner_id','email_address','mailbox_provider','status','quota']; }