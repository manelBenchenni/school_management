<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Matiere;
use App\Models\Niveau;
use App\Models\Tarif;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TarifController extends Controller
{
    public function index()
   
    {
        return Inertia::render('Admin/tarifs/Index', [
            'tarifs' => Tarif::with(['teacher', 'matiere', 'niveau'])->latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/tarifs/Create', [
            'teachers' => Teacher::with('matieres')->get(), // adjust to your teacher_matiere relation name
            'matieres' => Matiere::all(),
            'niveaux' => Niveau::all(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'teacher_id' => ['required', 'exists:teachers,id'],
            'matiere_id' => ['required', 'exists:matieres,id'],
            'niveau_id' => ['required', 'exists:niveaux,id'],
            'monthly_price' => ['required', 'numeric', 'min:0'],
        ]);

        Tarif::create($data);

        return redirect()->route('admin.tarifs.index')->with('success', 'Tarif created.');
    }

    public function edit(Tarif $tarif)
    {
        return Inertia::render('Admin/tarifs/Edit', [
            'tarif' => $tarif,
            'teachers' => Teacher::with('matieres')->get(),
            'matieres' => Matiere::all(),
            'niveaux' => Niveau::all(),
        ]);
    }

    public function update(Request $request, Tarif $tarif)
    {
        $data = $request->validate([
            'teacher_id' => ['required', 'exists:teachers,id'],
            'matiere_id' => ['required', 'exists:matieres,id'],
            'niveau_id' => ['required', 'exists:niveaux,id'],
            'monthly_price' => ['required', 'numeric', 'min:0'],
        ]);

        $tarif->update($data);

        return redirect()->route('admin.tarifs.index')->with('success', 'Tarif updated.');
    }

    public function destroy(Tarif $tarif)
    {
        $tarif->delete();

        return redirect()->route('admin.tarifs.index')->with('success', 'Tarif deleted.');
    }
}