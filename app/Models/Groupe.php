<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Groupe extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'teacher_id',
        'matiere_id',
        'niveau_id',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'active' => 'boolean',
        ];
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function matiere()
    {
        return $this->belongsTo(Matiere::class);
    }

    public function niveau()
    {
        return $this->belongsTo(Niveau::class);
    }

    public function schedules()
    {
        return $this->hasMany(GroupeSchedule::class);
    }

    public function sessionInstances()
    {
        return $this->hasMany(SessionInstance::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'enrollments')
            ->withPivot(['joined_at', 'left_at'])
            ->withTimestamps();
    }

    // Students currently enrolled (not yet left).
    public function activeStudents()
    {
        return $this->students()->wherePivotNull('left_at');
    }
}