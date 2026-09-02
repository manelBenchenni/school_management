<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facture extends Model
{
    use HasFactory;

    protected $fillable = [
        'enrollment_id',
        'period_start',
        'period_end',
        'payment_status', // paid | not_paid | remise | free
        'sessions_paid',
        'base_amount',
        'remise_percent',
        'amount_due',
        'paid_at',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'period_start' => 'date',
            'period_end' => 'date',
            'base_amount' => 'decimal:2',
            'remise_percent' => 'decimal:2',
            'amount_due' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Sessions used = count of presence rows (present + absent both
    // consume a session) for this enrollment's student/groupe, within
    // this facture's billing period. Computed rather than stored to
    // avoid drift.
    public function sessionsUsed(): int
    {
        return Presence::query()
            ->where('student_id', $this->enrollment->student_id)
            ->whereHas('sessionInstance', function ($query) {
                $query->where('groupe_id', $this->enrollment->groupe_id)
                    ->whereBetween('date', [$this->period_start, $this->period_end]);
            })
            ->count();
    }

    public function sessionsRemaining(): int
    {
        return max(0, $this->sessions_paid - $this->sessionsUsed());
    }
    public function sessionPrice(): float
{
    if ($this->sessions_paid <= 0) {
        return 0;
    }

    return round($this->base_amount / $this->sessions_paid, 2);
}
}