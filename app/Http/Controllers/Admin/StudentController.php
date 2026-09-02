<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Niveau;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Admin/Users/Students/Create', [
            'niveaux' => Niveau::orderBy('cycle')->orderBy('year')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'niveau_id' => 'required|exists:niveaux,id',
            'password' => 'required|string|min:8',
            'photo' => 'nullable|image|max:2048',
        ]);

        $user = User::create([
            'name' => "{$data['first_name']} {$data['last_name']}",
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'role' => 'student',
            'password' => Hash::make($data['password']),
        ]);

        $photoPath = $request->hasFile('photo')
            ? $request->file('photo')->store('students', 'public')
            : null;

        Student::create([
            'user_id' => $user->id,
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'niveau_id' => $data['niveau_id'],
            // Printed on the student's card; scanned to check into sessions.
            'barcode' => 'STU-'.strtoupper(Str::random(8)),
            'photo_path' => $photoPath,
        ]);

        return redirect()->route('admin.users.index')->with('success', 'Student added.');
    }

    public function edit(Student $student): Response
    {
        $student->load('user', 'niveau');

        return Inertia::render('Admin/Users/Students/Edit', [
            'student' => $student,
            'niveaux' => Niveau::orderBy('cycle')->orderBy('year')->get(),
        ]);
    }

    public function update(Request $request, Student $student): RedirectResponse
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$student->user_id,
            'phone' => 'nullable|string|max:20',
            'niveau_id' => 'required|exists:niveaux,id',
            'photo' => 'nullable|image|max:2048',
        ]);

        $student->user->update([
            'name' => "{$data['first_name']} {$data['last_name']}",
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
        ]);

        $updates = [
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'niveau_id' => $data['niveau_id'],
        ];

        if ($request->hasFile('photo')) {
            if ($student->photo_path) {
                Storage::disk('public')->delete($student->photo_path);
            }
            $updates['photo_path'] = $request->file('photo')->store('students', 'public');
        }

        $student->update($updates);

        return redirect()->route('admin.users.index')->with('success', 'Student updated.');
    }
}
