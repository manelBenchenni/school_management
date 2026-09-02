<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tarif extends Model
{
    protected $fillable = ['teacher_id', 'matiere_id', 'niveau_id', 'monthly_price'];

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

    // Helper used by FactureController to resolve a groupe's price.
    public static function forGroupe(Groupe $groupe): ?self
    {
        return static::where('teacher_id', $groupe->teacher_id)
            ->where('matiere_id', $groupe->matiere_id)
            ->where('niveau_id', $groupe->niveau_id)
            ->first();
    }
}