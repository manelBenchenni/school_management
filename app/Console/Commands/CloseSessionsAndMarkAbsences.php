<?php

namespace App\Console\Commands;

use App\Models\Enrollment;
use App\Models\Presence;
use App\Models\SessionInstance;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class CloseSessionsAndMarkAbsences extends Command
{
    protected $signature = 'sessions:close-and-sweep';
    protected $description = 'Close past session_instances and auto-mark unrecorded students as absent.';

    public function handle(): void
    {
        $now = Carbon::now();

        $sessions = SessionInstance::whereIn('status', ['scheduled', 'in_progress'])
            ->where(function ($q) use ($now) {
                $q->whereDate('date', '<', $now->toDateString())
                    ->orWhere(function ($q2) use ($now) {
                        $q2->whereDate('date', $now->toDateString())
                            ->whereTime('end_time', '<=', $now->toTimeString());
                    });
            })
            ->get();

        foreach ($sessions as $session) {
            $studentIds = Enrollment::where('groupe_id', $session->groupe_id)
                ->whereNull('left_at')
                ->where('joined_at', '<=', $session->date)
                ->pluck('student_id');

            $alreadyMarked = Presence::where('session_instance_id', $session->id)->pluck('student_id');
            $missing = $studentIds->diff($alreadyMarked);

            foreach ($missing as $studentId) {
                Presence::create([
                    'session_instance_id' => $session->id,
                    'student_id' => $studentId,
                    'status' => 'absent',
                    'method' => 'auto_sweep',
                    'marked_by' => null,
                    'marked_at' => $now,
                ]);
            }

            $session->update(['status' => 'closed']);
        }

        $this->info("Closed {$sessions->count()} session(s).");
    }
}