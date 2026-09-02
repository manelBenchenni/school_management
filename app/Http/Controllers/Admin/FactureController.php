<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Facture;
use App\Models\Presence;
use App\Models\SessionInstance;
use App\Models\Student;
use App\Models\Tarif;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class FactureController extends Controller
{
    public function index()
    {
        $factures = Facture::with([
            'enrollment.student', 'enrollment.groupe.teacher',
            'enrollment.groupe.matiere', 'enrollment.groupe.niveau',
        ])->latest('period_start')->paginate(20);

        return Inertia::render('Admin/Factures/Index', ['factures' => $factures]);
    }

    public function create()
    {
        $students = Student::with([
            'enrollments' => fn ($q) => $q->whereNull('left_at'),
            'enrollments.groupe.teacher',
            'enrollments.groupe.matiere',
            'enrollments.groupe.niveau',
        ])->get();

        return Inertia::render('Admin/Factures/Create', ['students' => $students]);
    }

   

    public function store(Request $request)
    {
        $data = $request->validate([
            'enrollment_id' => ['required', 'exists:enrollments,id'],
            'period_start' => ['required', 'date'],
            'payment_status' => ['required', 'in:paid,not_paid,remise,free'],
            'remise_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ]);

        $enrollment = Enrollment::with('groupe.schedules')->findOrFail($data['enrollment_id']);
        $start = Carbon::parse($data['period_start']);
        $end = $start->copy()->addMonth();

        $sessionsPaid = $this->sessionsInRange($enrollment->groupe, $start, $end);
        $baseAmount = optional(Tarif::forGroupe($enrollment->groupe))->monthly_price ?? 0;

        $amountDue = match ($data['payment_status']) {
            'free' => 0,
            'remise' => $baseAmount - ($baseAmount * ($data['remise_percent'] ?? 0) / 100),
            default => $baseAmount,
        };

        $facture = Facture::create([
            'enrollment_id' => $enrollment->id,
            'period_start' => $start,
            'period_end' => $end,
            'payment_status' => $data['payment_status'],
            'sessions_paid' => $sessionsPaid,
            'base_amount' => $baseAmount,
            'remise_percent' => $data['payment_status'] === 'remise' ? $data['remise_percent'] : null,
            'amount_due' => max($amountDue, 0),
            'paid_at' => $data['payment_status'] !== 'not_paid' ? now() : null,
            'created_by' => $request->user()->id,
        ]);

        return redirect()->route('admin.factures.show', $facture)->with('success', 'Facture created.');
    }

   

    public function pdf(Facture $facture)
    {
        $facture->load([
            'enrollment.student.user', 'enrollment.groupe.teacher',
            'enrollment.groupe.matiere', 'enrollment.groupe.niveau',
        ]);

        return \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.facture', ['facture' => $facture])
            ->download("facture-{$facture->id}.pdf");
    }

    private function sessionsInRange($groupe, Carbon $start, Carbon $end): int
    {
        $generated = SessionInstance::where('groupe_id', $groupe->id)
            ->whereBetween('date', [$start, $end])
            ->where('status', '!=', 'cancelled')
            ->count();

        if ($generated > 0) {
            return $generated;
        }

        $count = 0;
        foreach ($groupe->schedules as $schedule) {
            $from = $schedule->effective_from->greaterThan($start) ? $schedule->effective_from : $start;
            $to = $schedule->effective_to && $schedule->effective_to->lessThan($end) ? $schedule->effective_to : $end;

            if ($from->greaterThan($to)) {
                continue;
            }

            for ($date = $from->copy(); $date->lessThanOrEqualTo($to); $date->addDay()) {
                if ((int) $date->dayOfWeek === (int) $schedule->day_of_week) {
                    $count++;
                }
            }
        }

        return $count;
    }
    public function show(Facture $facture)
{
    $facture->load([
        'enrollment.student.user', 'enrollment.groupe.teacher',
        'enrollment.groupe.matiere', 'enrollment.groupe.niveau',
    ]);

    return Inertia::render('Admin/Factures/Show', [
        'facture' => $facture,
        'sessions_used' => $facture->sessionsUsed(),
        'sessions_remaining' => $facture->sessionsRemaining(),
        'session_price' => $facture->sessionPrice(),
    ]);
}

public function preview(Request $request)
{
    $data = $request->validate([
        'enrollment_id' => ['required', 'exists:enrollments,id'],
        'period_start' => ['required', 'date'],
    ]);

    $enrollment = Enrollment::with('groupe.schedules')->findOrFail($data['enrollment_id']);
    $start = Carbon::parse($data['period_start']);
    $end = $start->copy()->addMonth();

    $sessions = $this->sessionsInRange($enrollment->groupe, $start, $end);
    $baseAmount = optional(Tarif::forGroupe($enrollment->groupe))->monthly_price ?? 0;

    return response()->json([
        'period_end' => $end->toDateString(),
        'sessions_paid' => $sessions,
        'base_amount' => $baseAmount,
        'session_price' => $sessions > 0 ? round($baseAmount / $sessions, 2) : 0,
    ]);
}
}