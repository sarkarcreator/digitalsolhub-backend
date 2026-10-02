<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class SocialAccount extends Model { protected $fillable=['partner_id','platform','platform_user_id','username','display_name','profile_url','access_token_encrypted','refresh_token_encrypted','token_expires_at','scopes','status','connected_at','last_synced_at']; protected $casts=['scopes'=>'array','token_expires_at'=>'datetime','connected_at'=>'datetime','last_synced_at'=>'datetime']; protected $hidden=['access_token_encrypted','refresh_token_encrypted']; }