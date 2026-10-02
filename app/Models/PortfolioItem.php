<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class PortfolioItem extends Model { protected $fillable=['partner_id','title','slug','description','project_url','client_name','thumbnail','media','category','completed_at','is_featured','is_public','sort_order']; protected $casts=['media'=>'array','completed_at'=>'date','is_featured'=>'boolean','is_public'=>'boolean']; }