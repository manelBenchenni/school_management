<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionInstance extends Model
{
    use HasFactory;

    protected $fillable = [
        'groupe_id',
        'groupe_schedule_id',
        'date',
        'start_time',
        'end_time',
        'status', // scheduled | in_progress | closed | cancelled
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    public function groupe()
    {
        return $this->belongsTo(Groupe::class);
    }

    public function schedule()
    {
        return $this->belongsTo(GroupeSchedule::class, 'groupe_schedule_id');
    }

    public function presences()
    {
        return $this->hasMany(Presence::class);
    }

}