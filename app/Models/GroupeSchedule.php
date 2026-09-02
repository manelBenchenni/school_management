<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupeSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'groupe_id',
        'day_of_week',
        'start_time',
        'end_time',
        'effective_from',
        'effective_to',
    ];

    protected function casts(): array
    {
        return [
            'effective_from' => 'date',
            'effective_to' => 'date',
        ];
    }

    public function groupe()
    {
        return $this->belongsTo(Groupe::class);
    }

    public function sessionInstances()
    {
        return $this->hasMany(SessionInstance::class);
    }
}