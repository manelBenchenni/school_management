<?php

namespace App\Support;

// Single source of truth for "which dashboard does this role land on".
// Used by AuthenticatedSessionController, RedirectIfAuthenticated, and
// EmailVerificationPromptController so the mapping only lives in one
// place - add a new role here once and every redirect picks it up.
class DashboardRedirect
{
    public static function pathFor(?string $role): string
    {
        return match ($role) {
            'admin' => '/admin/dashboard',
            'reception' => '/reception/dashboard',
            'teacher' => '/teacher/dashboard',
            'parent' => '/parent/dashboard',
            'student' => '/student/dashboard',
            default => '/',
        };
    }
}