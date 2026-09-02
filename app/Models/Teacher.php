<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'percentage', // set/modified by admin only - not fixed
    ];

    protected function casts(): array
    {
        return [
            'percentage' => 'decimal:2',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // A teacher can teach several matieres.
    public function matieres()
    {
        return $this->belongsToMany(Matiere::class, 'teacher_matiere');
    }

    public function groupes()
    {
        return $this->hasMany(Groupe::class);
    }

    public function fullName(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
