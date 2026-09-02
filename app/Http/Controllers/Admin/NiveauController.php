<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Niveau;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NiveauController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Niveaux/Index', [
            'niveaux' => Niveau::withCount('students')->orderBy('cycle')->orderBy('year')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Niveaux/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'cycle' => 'required|in:primaire,moyen,lycee',
            'year' => 'required|integer|min:1|max:5',
            'label' => 'required|string|max:255',
        ]);

        Niveau::create($data);

        return redirect()->route('admin.niveaux.index')->with('success', 'Niveau added.');
    }

    public function edit(Niveau $niveau): Response
    {
        return Inertia::render('Admin/Niveaux/Edit', ['niveau' => $niveau]);
    }

    public function update(Request $request, Niveau $niveau): RedirectResponse
    {
        $data = $request->validate([
            'cycle' => 'required|in:primaire,moyen,lycee',
            'year' => 'required|integer|min:1|max:5',
            'label' => 'required|string|max:255',
        ]);

        $niveau->update($data);

        return redirect()->route('admin.niveaux.index')->with('success', 'Niveau updated.');
    }

    public function destroy(Niveau $niveau): RedirectResponse
    {
        if ($niveau->students()->exists()) {
            return back()->with('error', 'Cannot delete a niveau that has students assigned.');
        }

        $niveau->delete();

        return back()->with('success', 'Niveau removed.');
    }
}
