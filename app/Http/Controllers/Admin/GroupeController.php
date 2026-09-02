<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Groupe;
use App\Models\Matiere;
use App\Models\Niveau;
use App\Models\Teacher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class GroupeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Groupes/Index', [
            'groupes' => Groupe::with(['teacher', 'matiere', 'niveau', 'schedules'])
                ->withCount('enrollments')
                ->latest()
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Groupes/Create', $this->formOptions());
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        DB::transaction(function () use ($data) {
            $groupe = Groupe::create([
                'name' => $data['name'],
                'teacher_id' => $data['teacher_id'],
                'matiere_id' => $data['matiere_id'],
                'niveau_id' => $data['niveau_id'],
                'active' => true,
            ]);

            $this->syncSchedules($groupe, $data['schedules']);
        });

        return redirect()->route('admin.groupes.index')->with('success', 'Groupe created.');
    }

    public function edit(Groupe $groupe): Response
    {
        $groupe->load('schedules');

        return Inertia::render('Admin/Groupes/Edit', [
            'groupe' => $groupe,
            ...$this->formOptions(),
        ]);
    }

    public function update(Request $request, Groupe $groupe): RedirectResponse
    {
        $data = $this->validated($request);

        DB::transaction(function () use ($groupe, $data) {
            $groupe->update([
                'name' => $data['name'],
                'teacher_id' => $data['teacher_id'],
                'matiere_id' => $data['matiere_id'],
                'niveau_id' => $data['niveau_id'],
            ]);

            // Note: replaces schedule slots outright rather than preserving
            // history via effective_to - fine while no session_instances
            // exist yet; revisit once the generator job is built.
            $groupe->schedules()->delete();
            $this->syncSchedules($groupe, $data['schedules']);
        });

        return redirect()->route('admin.groupes.index')->with('success', 'Groupe updated.');
    }

    public function destroy(Groupe $groupe): RedirectResponse
    {
        if ($groupe->enrollments()->exists()) {
            return back()->with('error', 'Cannot delete a groupe with enrolled students. Deactivate it instead.');
        }

        $groupe->delete();

        return back()->with('success', 'Groupe removed.');
    }

    public function toggleActive(Groupe $groupe): RedirectResponse
    {
        $groupe->update(['active' => ! $groupe->active]);

        return back()->with('success', $groupe->active ? 'Groupe activated.' : 'Groupe deactivated.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'teacher_id' => 'required|exists:teachers,id',
            'matiere_id' => 'required|exists:matieres,id',
            'niveau_id' => 'required|exists:niveaux,id',
            'schedules' => 'required|array|min:1',
            'schedules.*.day_of_week' => 'required|integer|min:0|max:6',
            'schedules.*.start_time' => 'required|date_format:H:i',
            'schedules.*.end_time' => 'required|date_format:H:i|after:schedules.*.start_time',
        ]);
    }

    private function syncSchedules(Groupe $groupe, array $schedules): void
    {
        foreach ($schedules as $slot) {
            $groupe->schedules()->create([
                'day_of_week' => $slot['day_of_week'],
                'start_time' => $slot['start_time'],
                'end_time' => $slot['end_time'],
                'effective_from' => now()->toDateString(),
                'effective_to' => null,
            ]);
        }
    }

    private function formOptions(): array
    {
        return [
            // Each teacher's own matieres list is passed through so the
            // Create/Edit page can restrict the matiere dropdown to what
            // that teacher actually teaches once one is selected.
            'teachers' => Teacher::with('matieres')->get()->map(fn ($t) => [
                'id' => $t->id,
                'name' => $t->fullName(),
                'matiere_ids' => $t->matieres->pluck('id'),
            ]),
            'matieres' => Matiere::orderBy('name')->get(),
            'niveaux' => Niveau::orderBy('cycle')->orderBy('year')->get(),
        ];
    }
}
