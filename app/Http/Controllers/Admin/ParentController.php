<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ParentProfile;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class ParentController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Admin/Users/Parents/Create', [
            // Lets admin attach existing student(s) to this parent at creation time.
            'students' => Student::orderBy('first_name')->get(['id', 'first_name', 'last_name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8',
            'student_ids' => 'array',
            'student_ids.*' => 'exists:students,id',
        ]);

        $user = User::create([
            'name' => "{$data['first_name']} {$data['last_name']}",
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'role' => 'parent',
            'password' => Hash::make($data['password']),
        ]);

        $parent = ParentProfile::create([
            'user_id' => $user->id,
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
        ]);

        $parent->students()->sync($data['student_ids'] ?? []);

        return redirect()->route('admin.users.index')->with('success', 'Parent added.');
    }

    public function edit(ParentProfile $parent): Response
    {
        $parent->load('user', 'students');

        return Inertia::render('Admin/Users/Parents/Edit', [
            'parent' => $parent,
            'students' => Student::orderBy('first_name')->get(['id', 'first_name', 'last_name']),
            'attachedStudentIds' => $parent->students->pluck('id'),
        ]);
    }

    public function update(Request $request, ParentProfile $parent): RedirectResponse
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$parent->user_id,
            'phone' => 'nullable|string|max:20',
            'student_ids' => 'array',
            'student_ids.*' => 'exists:students,id',
        ]);

        $parent->user->update([
            'name' => "{$data['first_name']} {$data['last_name']}",
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
        ]);

        $parent->update([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
        ]);

        $parent->students()->sync($data['student_ids'] ?? []);

        return redirect()->route('admin.users.index')->with('success', 'Parent updated.');
    }
}
