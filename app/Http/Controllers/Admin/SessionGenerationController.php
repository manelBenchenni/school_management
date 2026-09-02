<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Groupe;
use App\Services\SessionGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SessionGenerationController extends Controller
{
    public function forGroupe(Request $request, Groupe $groupe, SessionGenerator $generator): RedirectResponse
    {
        $data = $request->validate([
            'days' => 'nullable|integer|min:1|max:180',
        ]);

        if ($groupe->schedules()->count() === 0) {
            return back()->with('error', "\"{$groupe->name}\" has no weekly schedule set — edit the groupe and add a day/time first.");
        }

        $count = $generator->generateForGroupe($groupe, null, $data['days'] ?? 30);

        $message = $count > 0
            ? "Generated {$count} new session(s) for \"{$groupe->name}\"."
            : "No new sessions to generate for \"{$groupe->name}\" — they already exist for this period. Click \"View Sessions\" to see them.";

        return back()->with('success', $message);
    }

    public function forAll(Request $request, SessionGenerator $generator): RedirectResponse
    {
        $data = $request->validate([
            'days' => 'nullable|integer|min:1|max:180',
        ]);

        $count = $generator->generateForAllActiveGroupes($data['days'] ?? 30);

        $message = $count > 0
            ? "Generated {$count} session(s) across all active groupes."
            : 'No new sessions to generate — everything is already up to date for this period.';

        return back()->with('success', $message);
    }
}
