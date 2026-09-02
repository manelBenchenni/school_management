<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Matiere;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MatiereController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Matieres/Index', [
            'matieres' => Matiere::withCount('teachers', 'groupes')->orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Matieres/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:matieres,name',
        ]);

        Matiere::create($data);

        return redirect()->route('admin.matieres.index')->with('success', 'Matiere added.');
    }

    public function edit(Matiere $matiere): Response
    {
        return Inertia::render('Admin/Matieres/Edit', ['matiere' => $matiere]);
    }

    public function update(Request $request, Matiere $matiere): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:matieres,name,'.$matiere->id,
        ]);

        $matiere->update($data);

        return redirect()->route('admin.matieres.index')->with('success', 'Matiere updated.');
    }

    public function destroy(Matiere $matiere): RedirectResponse
    {
        if ($matiere->teachers()->exists() || $matiere->groupes()->exists()) {
            return back()->with('error', 'Cannot delete a matiere in use by teachers or groupes.');
        }

        $matiere->delete();

        return back()->with('success', 'Matiere removed.');
    }
}
