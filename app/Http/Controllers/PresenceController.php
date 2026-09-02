<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Facture;
use App\Models\Groupe;
use App\Models\Presence;
use App\Models\SessionInstance;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
class PresenceController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->query('date', now()->toDateString());
        $user = $request->user();

        $query = SessionInstance::with(['groupe.teacher', 'groupe.matiere', 'groupe.niveau'])
            ->whereDate('date', $date)
            ->orderBy('start_time');

        if ($user->role === 'teacher') {
            $query->whereHas('groupe', fn ($q) => $q->where('teacher_id', $user->teacher->id));
        }

        return Inertia::render($this->folder($user->role).'/Sessions/Index', [
            'sessions' => $query->get(),
            'date' => $date,
            'rolePrefix' => $user->role === 'teacher' ? 'teacher' : ($user->role === 'reception' ? 'reception' : 'admin'),
        ]);
    }

    public function show(Request $request, SessionInstance $sessionInstance)
    {
        $this->authorizeSession($request, $sessionInstance);
        $sessionInstance->load(['groupe.teacher', 'groupe.matiere', 'groupe.niveau']);

        $existing = Presence::where('session_instance_id', $sessionInstance->id)->get()->keyBy('student_id');

        $roster = Student::whereHas('enrollments', fn ($q) => $q
                ->where('groupe_id', $sessionInstance->groupe_id)
                ->whereNull('left_at'))
            ->get(['id', 'first_name', 'last_name'])
            ->map(fn ($s) => [
                'id' => $s->id,
                'name' => "{$s->first_name} {$s->last_name}",
                'status' => optional($existing->get($s->id))->status,
            ]);

        $user = $request->user();

        return Inertia::render($this->folder($user->role).'/Presence/Show', [
            'session' => $sessionInstance,
            'roster' => $roster,
            'rolePrefix' => $user->role === 'teacher' ? 'teacher' : ($user->role === 'reception' ? 'reception' : 'admin'),
        ]);
    }

    public function storeManual(Request $request, SessionInstance $sessionInstance)
{
    $this->authorizeSession($request, $sessionInstance);

    $data = $request->validate([
        'statuses' => ['required', 'array'],
        'statuses.*.student_id' => ['required', 'exists:students,id'],
        'statuses.*.status' => ['required', 'in:present,absent'],
    ]);

    $user = $request->user();
    $method = $user->role === 'teacher' ? 'manual_teacher' : 'manual_reception';
    $skipped = [];

    foreach ($data['statuses'] as $row) {
        $enrollment = Enrollment::where('student_id', $row['student_id'])
            ->where('groupe_id', $sessionInstance->groupe_id)
            ->whereNull('left_at')
            ->first();

        $facture = $enrollment ? $this->eligibleFacture($enrollment, $sessionInstance->date) : null;

        if (! $facture) {
            $student = Student::find($row['student_id']);
            $skipped[] = $student ? "{$student->first_name} {$student->last_name}" : "#{$row['student_id']}";
            continue;
        }

        Presence::updateOrCreate(
            ['session_instance_id' => $sessionInstance->id, 'student_id' => $row['student_id']],
            ['status' => $row['status'], 'method' => $method, 'marked_by' => $user->id, 'marked_at' => now()]
        );
    }

    if (! empty($skipped)) {
        return back()->with('error', 'No valid payment, skipped: '.implode(', ', $skipped));
    }

    return back()->with('success', 'Presence updated.');
}
public function history(Request $request, Groupe $groupe)
{
    $user = $request->user();

    if ($user->role === 'teacher') {
        abort_unless($groupe->teacher_id === $user->teacher->id, 403);
    }

    $groupe->load(['teacher', 'matiere', 'niveau']);

    $sessions = SessionInstance::where('groupe_id', $groupe->id)
        ->withCount([
            'presences as present_count' => fn ($q) => $q->where('status', 'present'),
            'presences as absent_count' => fn ($q) => $q->where('status', 'absent'),
        ])
        ->orderByDesc('date')
        ->orderByDesc('start_time')
        ->get();

    return Inertia::render($this->folder($user->role).'/Presence/History', [
        'groupe' => $groupe,
        'sessions' => $sessions,
        'rolePrefix' => $user->role === 'teacher' ? 'teacher' : ($user->role === 'reception' ? 'reception' : 'admin'),
    ]);
}
    public function scanPage(Request $request, SessionInstance $sessionInstance)
    {
        $this->authorizeSession($request, $sessionInstance);
        $sessionInstance->load(['groupe.teacher', 'groupe.matiere', 'groupe.niveau']);

        $user = $request->user();

        return Inertia::render($this->folder($user->role).'/Presence/Scan', [
            'session' => $sessionInstance,
            'rolePrefix' => $user->role === 'teacher' ? 'teacher' : ($user->role === 'reception' ? 'reception' : 'admin'),
        ]);
    }

   public function scanStore(Request $request, SessionInstance $sessionInstance)
{
    $this->authorizeSession($request, $sessionInstance);

    $data = $request->validate(['barcode' => ['required', 'string']]);

    $student = Student::where('barcode', $data['barcode'])->first();

    if (! $student) {
        return response()->json(['error' => 'No student found for this barcode.'], 404);
    }

    $enrollment = Enrollment::where('student_id', $student->id)
        ->where('groupe_id', $sessionInstance->groupe_id)
        ->whereNull('left_at')
        ->first();

    if (! $enrollment) {
        return response()->json([
            'error' => "{$student->first_name} {$student->last_name} is not enrolled in this groupe.",
        ], 422);
    }

    $existing = Presence::where('session_instance_id', $sessionInstance->id)
        ->where('student_id', $student->id)
        ->first();

    if ($existing) {
        return response()->json([
            'duplicate' => true,
            'student' => "{$student->first_name} {$student->last_name}",
            'message' => 'Already marked for this session.',
        ]);
    }

    $facture = $this->eligibleFacture($enrollment, $sessionInstance->date);

    if (! $facture) {
        return response()->json([
            'error' => "{$student->first_name} {$student->last_name} has no valid payment covering this period.",
        ], 422);
    }

    if ($facture->sessionsRemaining() <= 0) {
        return response()->json([
            'error' => "{$student->first_name} {$student->last_name} has no sessions remaining on their facture.",
        ], 422);
    }

    Presence::create([
        'session_instance_id' => $sessionInstance->id,
        'student_id' => $student->id,
        'status' => 'present',
        'method' => 'barcode',
        'marked_by' => $request->user()->id,
        'marked_at' => now(),
    ]);

    return response()->json([
        'duplicate' => false,
        'student' => "{$student->first_name} {$student->last_name}",
        'sessions_remaining' => $facture->sessionsRemaining() - 1,
    ]);
}

    private function authorizeSession(Request $request, SessionInstance $sessionInstance): void
    {
        $user = $request->user();

        if ($user->role === 'teacher') {
            abort_unless($sessionInstance->groupe->teacher_id === $user->teacher->id, 403);
        }
    }

    private function folder(string $role): string
    {
        return match ($role) {
            'teacher' => 'Teacher',
            'reception' => 'Reception',
            default => 'Admin',
        };
    }
    private function eligibleFacture(Enrollment $enrollment, \Illuminate\Support\Carbon $date): ?Facture
{
    return Facture::where('enrollment_id', $enrollment->id)
        ->whereIn('payment_status', ['paid', 'remise', 'free'])
        ->whereDate('period_start', '<=', $date)
        ->whereDate('period_end', '>=', $date)
        ->first();
}
}