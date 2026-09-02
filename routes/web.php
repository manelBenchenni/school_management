<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\EnrollmentController as AdminEnrollmentController;
use App\Http\Controllers\Admin\GroupeController as AdminGroupeController;
use App\Http\Controllers\Admin\MatiereController as AdminMatiereController;
use App\Http\Controllers\Admin\NiveauController as AdminNiveauController;
use App\Http\Controllers\Admin\ParentController as AdminParentController;
use App\Http\Controllers\Admin\SessionGenerationController as AdminSessionGenerationController;
use App\Http\Controllers\Admin\StaffController as AdminStaffController;
use App\Http\Controllers\Admin\StudentCardController as AdminStudentCardController;
use App\Http\Controllers\Admin\StudentController as AdminStudentController;
use App\Http\Controllers\Admin\TeacherController as AdminTeacherController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\TarifController as AdminTarifController;
use App\Http\Controllers\Admin\FactureController as AdminFactureController;
use App\Http\Controllers\Parent\DashboardController as ParentDashboardController;
use App\Http\Controllers\Parent\FactureController as ParentFactureController;
use App\Http\Controllers\Reception\DashboardController as ReceptionDashboardController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Student\FactureController as StudentFactureController;
use App\Http\Controllers\Teacher\DashboardController as TeacherDashboardController;
use App\Http\Controllers\PresenceController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

// --- Admin ---------------------------------------------------------
Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Users (all 5 roles) ------------------------------------------------
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');

        Route::get('/users/students/create', [AdminStudentController::class, 'create'])->name('students.create');
        Route::post('/users/students', [AdminStudentController::class, 'store'])->name('students.store');
        Route::get('/users/students/{student}/edit', [AdminStudentController::class, 'edit'])->name('students.edit');
        Route::put('/users/students/{student}', [AdminStudentController::class, 'update'])->name('students.update');

        Route::get('/users/students/{student}/card', [AdminStudentCardController::class, 'show'])->name('students.card');

        Route::get('/users/students/{student}/enroll', [AdminEnrollmentController::class, 'create'])->name('students.enroll');
        Route::post('/users/students/{student}/enroll', [AdminEnrollmentController::class, 'store'])->name('students.enroll.store');
        Route::delete('/users/students/{student}/enroll/{enrollment}', [AdminEnrollmentController::class, 'destroy'])->name('students.enroll.destroy');

        Route::get('/users/teachers/create', [AdminTeacherController::class, 'create'])->name('teachers.create');
        Route::post('/users/teachers', [AdminTeacherController::class, 'store'])->name('teachers.store');
        Route::get('/users/teachers/{teacher}/edit', [AdminTeacherController::class, 'edit'])->name('teachers.edit');
        Route::put('/users/teachers/{teacher}', [AdminTeacherController::class, 'update'])->name('teachers.update');

        Route::get('/users/parents/create', [AdminParentController::class, 'create'])->name('parents.create');
        Route::post('/users/parents', [AdminParentController::class, 'store'])->name('parents.store');
        Route::get('/users/parents/{parent}/edit', [AdminParentController::class, 'edit'])->name('parents.edit');
        Route::put('/users/parents/{parent}', [AdminParentController::class, 'update'])->name('parents.update');

        Route::get('/users/staff/create', [AdminStaffController::class, 'create'])->name('staff.create');
        Route::post('/users/staff', [AdminStaffController::class, 'store'])->name('staff.store');
        Route::get('/users/staff/{staff}/edit', [AdminStaffController::class, 'edit'])->name('staff.edit');
        Route::put('/users/staff/{staff}', [AdminStaffController::class, 'update'])->name('staff.update');

        // Niveaux --------------------------------------------------------------
        Route::get('/niveaux', [AdminNiveauController::class, 'index'])->name('niveaux.index');
        Route::get('/niveaux/create', [AdminNiveauController::class, 'create'])->name('niveaux.create');
        Route::post('/niveaux', [AdminNiveauController::class, 'store'])->name('niveaux.store');
        Route::get('/niveaux/{niveau}/edit', [AdminNiveauController::class, 'edit'])->name('niveaux.edit');
        Route::put('/niveaux/{niveau}', [AdminNiveauController::class, 'update'])->name('niveaux.update');
        Route::delete('/niveaux/{niveau}', [AdminNiveauController::class, 'destroy'])->name('niveaux.destroy');

        // Matieres --------------------------------------------------------------
        Route::get('/matieres', [AdminMatiereController::class, 'index'])->name('matieres.index');
        Route::get('/matieres/create', [AdminMatiereController::class, 'create'])->name('matieres.create');
        Route::post('/matieres', [AdminMatiereController::class, 'store'])->name('matieres.store');
        Route::get('/matieres/{matiere}/edit', [AdminMatiereController::class, 'edit'])->name('matieres.edit');
        Route::put('/matieres/{matiere}', [AdminMatiereController::class, 'update'])->name('matieres.update');
        Route::delete('/matieres/{matiere}', [AdminMatiereController::class, 'destroy'])->name('matieres.destroy');

        // Groupes --------------------------------------------------------------
        Route::get('/groupes', [AdminGroupeController::class, 'index'])->name('groupes.index');
        Route::get('/groupes/create', [AdminGroupeController::class, 'create'])->name('groupes.create');
        Route::post('/groupes', [AdminGroupeController::class, 'store'])->name('groupes.store');
        Route::get('/groupes/{groupe}/edit', [AdminGroupeController::class, 'edit'])->name('groupes.edit');
        Route::put('/groupes/{groupe}', [AdminGroupeController::class, 'update'])->name('groupes.update');
        Route::delete('/groupes/{groupe}', [AdminGroupeController::class, 'destroy'])->name('groupes.destroy');
        Route::patch('/groupes/{groupe}/toggle-active', [AdminGroupeController::class, 'toggleActive'])->name('groupes.toggle-active');

        // Session generation -----------------------------------------------------
        Route::get('/groupes/{groupe}/sessions', [\App\Http\Controllers\Admin\GroupeSessionsController::class, 'index'])->name('groupes.sessions');
        Route::post('/groupes/{groupe}/generate-sessions', [AdminSessionGenerationController::class, 'forGroupe'])->name('groupes.generate-sessions');
        Route::post('/groupes/generate-sessions-all', [AdminSessionGenerationController::class, 'forAll'])->name('groupes.generate-sessions-all');
        //tarif
        Route::get('/tarifs', [AdminTarifController::class, 'index'])->name('tarifs.index');
Route::get('/tarifs/create', [AdminTarifController::class, 'create'])->name('tarifs.create');
Route::post('/tarifs', [AdminTarifController::class, 'store'])->name('tarifs.store');
Route::get('/tarifs/{tarif}/edit', [AdminTarifController::class, 'edit'])->name('tarifs.edit');
Route::put('/tarifs/{tarif}', [AdminTarifController::class, 'update'])->name('tarifs.update');
Route::delete('/tarifs/{tarif}', [AdminTarifController::class, 'destroy'])->name('tarifs.destroy');
        //facture 
        Route::get('/factures', [AdminFactureController::class, 'index'])->name('factures.index');
Route::get('/factures/create', [AdminFactureController::class, 'create'])->name('factures.create');
Route::post('/factures/preview', [AdminFactureController::class, 'preview'])->name('factures.preview');
Route::post('/factures', [AdminFactureController::class, 'store'])->name('factures.store');
Route::get('/factures/{facture}', [AdminFactureController::class, 'show'])->name('factures.show');
Route::get('/factures/{facture}/pdf', [AdminFactureController::class, 'pdf'])->name('factures.pdf');
Route::get('/sessions', [PresenceController::class, 'index'])->name('sessions.index');
Route::get('/sessions/{sessionInstance}/presence', [PresenceController::class, 'show'])->name('presence.show');
Route::post('/sessions/{sessionInstance}/presence', [PresenceController::class, 'storeManual'])->name('presence.store');
Route::get('/sessions/{sessionInstance}/scan', [PresenceController::class, 'scanPage'])->name('presence.scan');
Route::post('/sessions/{sessionInstance}/scan', [PresenceController::class, 'scanStore'])->name('presence.scan.store');
Route::get('/groupes/{groupe}/history', [PresenceController::class, 'history'])->name('groupes.history');
    });

// --- Reception -------------------------------------------------------
Route::middleware(['auth', 'role:reception,admin'])
    ->prefix('reception')
    ->name('reception.')
    ->group(function () {
        Route::get('/dashboard', [ReceptionDashboardController::class, 'index'])->name('dashboard');
        Route::get('/sessions', [PresenceController::class, 'index'])->name('sessions.index');
Route::get('/sessions/{sessionInstance}/presence', [PresenceController::class, 'show'])->name('presence.show');
Route::post('/sessions/{sessionInstance}/presence', [PresenceController::class, 'storeManual'])->name('presence.store');
Route::get('/sessions/{sessionInstance}/scan', [PresenceController::class, 'scanPage'])->name('presence.scan');
Route::post('/sessions/{sessionInstance}/scan', [PresenceController::class, 'scanStore'])->name('presence.scan.store');
Route::get('/groupes/{groupe}/history', [PresenceController::class, 'history'])->name('groupes.history');
    });

// --- Teacher ---------------------------------------------------------
Route::middleware(['auth', 'role:teacher'])
    ->prefix('teacher')
    ->name('teacher.')
    ->group(function () {
        Route::get('/dashboard', [TeacherDashboardController::class, 'index'])->name('dashboard');
        Route::get('/sessions', [PresenceController::class, 'index'])->name('sessions.index');
Route::get('/sessions/{sessionInstance}/presence', [PresenceController::class, 'show'])->name('presence.show');
Route::post('/sessions/{sessionInstance}/presence', [PresenceController::class, 'storeManual'])->name('presence.store');
Route::get('/sessions/{sessionInstance}/scan', [PresenceController::class, 'scanPage'])->name('presence.scan');
Route::post('/sessions/{sessionInstance}/scan', [PresenceController::class, 'scanStore'])->name('presence.scan.store');
Route::get('/groupes/{groupe}/history', [PresenceController::class, 'history'])->name('groupes.history');
    });

// --- Parent ------------------------------------------------------------
Route::middleware(['auth', 'role:parent'])
    ->prefix('parent')
    ->name('parent.')
    ->group(function () {
        Route::get('/dashboard', [ParentDashboardController::class, 'index'])->name('dashboard');
        Route::get('/factures', [ParentFactureController::class, 'index'])->name('factures.index');
Route::get('/factures/{facture}', [ParentFactureController::class, 'show'])->name('factures.show');
Route::get('/factures', [StudentFactureController::class, 'index'])->name('factures.index');
Route::get('/factures/{facture}', [StudentFactureController::class, 'show'])->name('factures.show');
    });

// --- Student -----------------------------------------------------------
Route::middleware(['auth', 'role:student'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {
        Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');
        Route::get('/factures', [StudentFactureController::class, 'index'])->name('factures.index');
Route::get('/factures/{facture}', [StudentFactureController::class, 'show'])->name('factures.show');
    });

require __DIR__.'/auth.php';
