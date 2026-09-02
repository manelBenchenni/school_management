<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Groupe;
use Inertia\Inertia;
use Inertia\Response;

class GroupeSessionsController extends Controller
{
    public function index(Groupe $groupe): Response
    {
        $sessions = $groupe->sessionInstances()
            ->withCount('presences')
            ->orderBy('date')
            ->orderBy('start_time')
            ->get();

        return Inertia::render('Admin/Groupes/Sessions', [
            'groupe' => $groupe,
            'sessions' => $sessions,
        ]);
    }
}
