<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Groupe;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

// Attaching a student to a groupe - reception normally does this when
// the student pays (see reception flow later), but admin can too.
class EnrollmentController extends Controller
{
    public function create(Student $student): Response
    {
        $student->load('enrollments.groupe');

        $activeGroupeIds = $student->enrollments()->whereNull('left_at')->pluck('groupe_id');

        return Inertia::render('Admin/Users/Students/Enroll', [
            'student' => $student,
            'groupes' => Groupe::with('teacher', 'matiere', 'niveau')
                ->where('active', true)
                ->whereNotIn('id', $activeGroupeIds)
                ->get(),
            'currentEnrollments' => $student->enrollments()
                ->whereNull('left_at')
                ->with('groupe.teacher', 'groupe.matiere')
                ->get(),
        ]);
    }

    public function store(Request $request, Student $student): RedirectResponse
    {
        $data = $request->validate([
            'groupe_id' => 'required|exists:groupes,id',
        ]);

        // A student is free to join several independent groupes, but not
        // the same groupe twice while already active in it.
        $alreadyIn = $student->enrollments()
            ->where('groupe_id', $data['groupe_id'])
            ->whereNull('left_at')
            ->exists();

        if ($alreadyIn) {
            return back()->with('error', 'Student is already enrolled in this groupe.');
        }

        Enrollment::create([
            'student_id' => $student->id,
            'groupe_id' => $data['groupe_id'],
            'joined_at' => now()->toDateString(),
            'created_by' => auth()->id(),
        ]);

        return back()->with('success', 'Student enrolled in groupe.');
    }

    // Student leaves a groupe - groupes aren't fixed, so this just
    // closes the enrollment rather than deleting history.
    public function destroy(Student $student, Enrollment $enrollment): RedirectResponse
    {
        $enrollment->update(['left_at' => now()->toDateString()]);

        return back()->with('success', 'Student removed from groupe.');
    }
}
