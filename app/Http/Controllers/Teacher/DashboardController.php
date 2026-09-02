<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Facture;
use App\Models\Groupe;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $teacher = $request->user()->teacher;
        $today = now()->toDateString();

        $groupes = Groupe::where('teacher_id', $teacher->id)
            ->with(['matiere', 'niveau'])
            ->get()
            ->map(function ($groupe) use ($today) {
                $enrollments = Enrollment::where('groupe_id', $groupe->id)
                    ->whereNull('left_at')
                    ->with('student')
                    ->get();

                $students = $enrollments->map(function ($enrollment) use ($today) {
                    $facture = Facture::where('enrollment_id', $enrollment->id)
                        ->where('period_start', '<=', $today)
                        ->where('period_end', '>=', $today)
                        ->first()
                        ?? Facture::where('enrollment_id', $enrollment->id)->latest('period_start')->first();

                    return [
                        'id' => $enrollment->student->id,
                        'name' => "{$enrollment->student->first_name} {$enrollment->student->last_name}",
                        'payment_status' => $facture->payment_status ?? 'not_paid',
                        'amount_due' => $facture->amount_due ?? 0,
                    ];
                });

                $groupeTotal = $students
                    ->filter(fn ($s) => in_array($s['payment_status'], ['paid', 'remise']))
                    ->sum('amount_due');

                return [
                    'id' => $groupe->id,
                    'name' => $groupe->name,
                    'matiere' => $groupe->matiere->name,
                    'niveau' => $groupe->niveau->label,
                    'students' => $students,
                    'groupe_total' => $groupeTotal,
                ];
            });

        $grandTotal = $groupes->sum('groupe_total');
        $teacherShare = round($grandTotal * $teacher->percentage / 100, 2);

        return Inertia::render('Teacher/Dashboard', [
            'groupes' => $groupes,
            'percentage' => $teacher->percentage,
            'grand_total' => $grandTotal,
            'teacher_share' => $teacherShare,
        ]);
    }
}