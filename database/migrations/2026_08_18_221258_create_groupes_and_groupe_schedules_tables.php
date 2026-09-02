<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// A groupe = one teacher + one matiere + one niveau + a roster of students.
// Groupes are independent of each other; a student can belong to several.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('groupes', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. "Maths 3AS - Groupe A"
            $table->foreignId('teacher_id')->constrained('teachers');
            $table->foreignId('matiere_id')->constrained('matieres');
            $table->foreignId('niveau_id')->constrained('niveaux');
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        // A groupe can meet more than once a week (e.g. Mon & Wed 5pm).
        // session_instances are generated ahead of time from these slots.
        Schema::create('groupe_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('groupe_id')->constrained('groupes')->cascadeOnDelete();
            $table->tinyInteger('day_of_week'); // 0 = Sunday .. 6 = Saturday
            $table->time('start_time');
            $table->time('end_time');
            // Schedules can change over time; keep history instead of
            // overwriting so past session_instances stay traceable.
            $table->date('effective_from');
            $table->date('effective_to')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('groupe_schedules');
        Schema::dropIfExists('groupes');
    }
};