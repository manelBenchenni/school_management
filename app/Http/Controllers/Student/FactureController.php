<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Facture;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FactureController extends Controller
{
    public function index(Request $request)
    {
        $student = $request->user()->student;

        $factures = Facture::whereHas('enrollment', fn ($q) => $q->where('student_id', $student->id))
            ->with(['enrollment.groupe.teacher', 'enrollment.groupe.matiere', 'enrollment.groupe.niveau'])
            ->latest('period_start')
            ->paginate(20);

        return Inertia::render('Student/Factures/Index', ['factures' => $factures]);
    }

    public function show(Request $request, Facture $facture)
    {
        abort_unless($facture->enrollment->student_id === $request->user()->student->id, 403);

        $facture->load([
            'enrollment.student.user', 'enrollment.groupe.teacher',
            'enrollment.groupe.matiere', 'enrollment.groupe.niveau',
        ]);

        return Inertia::render('Student/Factures/Show', [
            'facture' => $facture,
            'sessions_used' => $facture->sessionsUsed(),
            'sessions_remaining' => $facture->sessionsRemaining(),
        ]);
    }
}