<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Niveau extends Model
{
    use HasFactory;

    protected $fillable = [
        'cycle', // primaire | moyen | lycee
        'year',
        'label',
    ];

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function groupes()
    {
        return $this->hasMany(Groupe::class);
    }
}