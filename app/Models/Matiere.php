<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matiere extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

   public function teachers()
{
    return $this->belongsToMany(Teacher::class, 'teacher_matiere');
}
    public function groupes()
    {
        return $this->hasMany(Groupe::class);
    }
}