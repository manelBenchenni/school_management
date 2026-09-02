<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

// A teacher can now teach several matieres, not just one. Replaces the
// single teachers.matiere_id column with a teacher_matiere pivot,
// carrying over any existing single-matiere assignments first so no
// data is lost.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teacher_matiere', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->foreignId('matiere_id')->constrained('matieres')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['teacher_id', 'matiere_id']);
        });

        // Carry over existing single-matiere assignments.
        DB::table('teachers')->whereNotNull('matiere_id')->get()->each(function ($teacher) {
            DB::table('teacher_matiere')->insert([
                'teacher_id' => $teacher->id,
                'matiere_id' => $teacher->matiere_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        Schema::table('teachers', function (Blueprint $table) {
            $table->dropForeign(['matiere_id']);
            $table->dropColumn('matiere_id');
        });
    }

    public function down(): void
    {
        Schema::table('teachers', function (Blueprint $table) {
            $table->foreignId('matiere_id')->nullable()->after('last_name')->constrained('matieres');
        });

        DB::table('teacher_matiere')->orderBy('id')->get()->each(function ($row) {
            DB::table('teachers')->where('id', $row->teacher_id)->update(['matiere_id' => $row->matiere_id]);
        });

        Schema::dropIfExists('teacher_matiere');
    }
};
