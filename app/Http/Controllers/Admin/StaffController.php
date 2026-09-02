<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

// Admin and reception have no profile table of their own (no extra
// fields beyond what's on `users`), so this controller works directly
// on User rather than a separate model.
class StaffController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Admin/Users/Staff/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:admin,reception',
            'password' => 'required|string|min:8',
        ]);

        User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'role' => $data['role'],
            'password' => Hash::make($data['password']),
        ]);

        return redirect()->route('admin.users.index')->with('success', 'Staff account added.');
    }

    public function edit(User $staff): Response
    {
        return Inertia::render('Admin/Users/Staff/Edit', [
            'staff' => $staff,
        ]);
    }

    public function update(Request $request, User $staff): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$staff->id,
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:admin,reception',
        ]);

        $staff->update($data);

        return redirect()->route('admin.users.index')->with('success', 'Staff account updated.');
    }
}
