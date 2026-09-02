<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Facture;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $student = $request->user()->student;

        $enrollments = Enrollment::where('student_id', $student->id)
            ->whereNull('left_at')
            ->with(['groupe.teacher', 'groupe.matiere', 'groupe.niveau', 'groupe.schedules'])
            ->get();

        $recentFactures = Facture::whereHas('enrollment', fn ($q) => $q->where('student_id', $student->id))
            ->with(['enrollment.groupe.matiere', 'enrollment.groupe.niveau'])
            ->latest('period_start')
            ->take(5)
            ->get();

        return Inertia::render('Student/Dashboard', [
            'enrollments' => $enrollments,
            'recent_factures' => $recentFactures,
        ]);
    }
}