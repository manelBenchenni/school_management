<?php

namespace App\Console\Commands;

use App\Models\Groupe;
use App\Services\SessionGenerator;
use Illuminate\Console\Command;

// Usage:
//   php artisan sessions:generate                  → next 30 days, all active groupes
//   php artisan sessions:generate --days=60         → next 60 days, all active groupes
//   php artisan sessions:generate --groupe=5         → next 30 days, just groupe #5
//
// To automate later, add one line to routes/console.php:
//   Schedule::command('sessions:generate --days=30')->monthlyOn(25, '02:00');
// (runs on the 25th of each month so next month's sessions exist ahead of time)
class GenerateSessions extends Command
{
    protected $signature = 'sessions:generate {--days=30} {--groupe=}';

    protected $description = "Generate session_instances from each groupe's weekly schedule";

    public function handle(SessionGenerator $generator): int
    {
        $days = (int) $this->option('days');

        if ($groupeId = $this->option('groupe')) {
            $groupe = Groupe::findOrFail($groupeId);
            $count = $generator->generateForGroupe($groupe, null, $days);
            $this->info("Generated {$count} session(s) for \"{$groupe->name}\".");

            return self::SUCCESS;
        }

        $count = $generator->generateForAllActiveGroupes($days);
        $this->info("Generated {$count} session(s) across all active groupes.");

        return self::SUCCESS;
    }
}
