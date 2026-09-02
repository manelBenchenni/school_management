<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Facture;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FactureController extends Controller
{
    public function index(Request $request)
    {
        $studentIds = $request->user()->parent->students()->pluck('students.id');

        $factures = Facture::with([
            'enrollment.student', 'enrollment.groupe.teacher',
            'enrollment.groupe.matiere', 'enrollment.groupe.niveau',
        ])
            ->whereHas('enrollment', fn ($q) => $q->whereIn('student_id', $studentIds))
            ->latest('month')
            ->paginate(20);

        return Inertia::render('parent/factures/Index', ['factures' => $factures]);
    }

    public function show(Request $request, Facture $facture)
    {
        $studentIds = $request->user()->parent->students()->pluck('students.id');
        abort_unless($studentIds->contains($facture->enrollment->student_id), 403);

        $facture->load([
            'enrollment.student.user', 'enrollment.groupe.teacher',
            'enrollment.groupe.matiere', 'enrollment.groupe.niveau',
        ]);

        return Inertia::render('parent/factures/Show', ['facture' => $facture]);
    }
}