<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'groupe_id',
        'joined_at',
        'left_at',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'joined_at' => 'date',
            'left_at' => 'date',
        ];
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function groupe()
    {
        return $this->belongsTo(Groupe::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function factures()
    {
        return $this->hasMany(Facture::class);
    }

    public function isActive(): bool
    {
        return is_null($this->left_at);
    }
}