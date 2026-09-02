<?php

namespace App\Services;

use App\Models\Groupe;
use App\Models\SessionInstance;
use Carbon\CarbonImmutable;

// Expands a groupe's weekly schedule slots into concrete dated
// session_instances, so students have something real to scan into.
// Safe to run repeatedly - firstOrCreate on (groupe_id, date, start_time)
// means re-running for an overlapping range never creates duplicates.
class SessionGenerator
{
    public function generateForGroupe(Groupe $groupe, ?CarbonImmutable $from = null, int $days = 30): int
    {
        $groupe->loadMissing('schedules');

        // Continue from the day after the latest existing session for
        // this groupe, so re-running the button/command never leaves a
        // gap and never duplicates what's already generated - unless a
        // specific $from was requested (e.g. a backfill).
        $start = $from ?? $this->defaultStartDate($groupe);
        $end = $start->addDays($days);

        $created = 0;

        for ($date = $start; $date->lte($end); $date = $date->addDay()) {
            foreach ($groupe->schedules as $schedule) {
                if (! $this->scheduleAppliesOn($schedule, $date)) {
                    continue;
                }

                $instance = SessionInstance::firstOrCreate([
                    'groupe_id' => $groupe->id,
                    'date' => $date->toDateString(),
                    'start_time' => $schedule->start_time,
                ], [
                    'groupe_schedule_id' => $schedule->id,
                    'end_time' => $schedule->end_time,
                    'status' => 'scheduled',
                ]);

                if ($instance->wasRecentlyCreated) {
                    $created++;
                }
            }
        }

        return $created;
    }

    public function generateForAllActiveGroupes(int $days = 30): int
    {
        $total = 0;

        Groupe::where('active', true)->with('schedules')->each(function (Groupe $groupe) use ($days, &$total) {
            $total += $this->generateForGroupe($groupe, null, $days);
        });

        return $total;
    }

    private function defaultStartDate(Groupe $groupe): CarbonImmutable
    {
        $latest = $groupe->sessionInstances()->max('date');

        $today = CarbonImmutable::today();

        return $latest ? CarbonImmutable::parse($latest)->addDay()->max($today) : $today;
    }

    private function scheduleAppliesOn($schedule, CarbonImmutable $date): bool
    {
        if ($schedule->day_of_week !== $date->dayOfWeek) {
            return false;
        }

        if ($date->lt(CarbonImmutable::parse($schedule->effective_from))) {
            return false;
        }

        if ($schedule->effective_to && $date->gt(CarbonImmutable::parse($schedule->effective_to))) {
            return false;
        }

        return true;
    }
}
