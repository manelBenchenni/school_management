<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\View\View;

// Returns a plain Blade view (not Inertia) since this is meant to be
// opened as its own printable page - no SPA chrome, just Ctrl+P.
class StudentCardController extends Controller
{
    public function show(Student $student): View
    {
        $student->load('niveau');

        return view('admin.students.card', ['student' => $student]);
    }
}
