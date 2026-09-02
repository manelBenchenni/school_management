<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Matiere;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class TeacherController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Admin/Users/Teachers/Create', [
            'matieres' => Matiere::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'matiere_ids' => 'required|array|min:1',
            'matiere_ids.*' => 'exists:matieres,id',
            // Admin sets this and can change it later - not fixed.
            'percentage' => 'required|numeric|min:0|max:100',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => "{$data['first_name']} {$data['last_name']}",
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'role' => 'teacher',
            'password' => Hash::make($data['password']),
        ]);

        $teacher = Teacher::create([
            'user_id' => $user->id,
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'percentage' => $data['percentage'],
        ]);

        $teacher->matieres()->sync($data['matiere_ids']);

        return redirect()->route('admin.users.index')->with('success', 'Teacher added.');
    }

    public function edit(Teacher $teacher): Response
    {
        $teacher->load('user', 'matieres');

        return Inertia::render('Admin/Users/Teachers/Edit', [
            'teacher' => $teacher,
            'matieres' => Matiere::orderBy('name')->get(),
            'assignedMatiereIds' => $teacher->matieres->pluck('id'),
        ]);
    }

    public function update(Request $request, Teacher $teacher): RedirectResponse
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$teacher->user_id,
            'phone' => 'nullable|string|max:20',
            'matiere_ids' => 'required|array|min:1',
            'matiere_ids.*' => 'exists:matieres,id',
            'percentage' => 'required|numeric|min:0|max:100',
        ]);

        $teacher->user->update([
            'name' => "{$data['first_name']} {$data['last_name']}",
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
        ]);

        $teacher->update([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'percentage' => $data['percentage'],
        ]);

        $teacher->matieres()->sync($data['matiere_ids']);

        return redirect()->route('admin.users.index')->with('success', 'Teacher updated.');
    }
}
