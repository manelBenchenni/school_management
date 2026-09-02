<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// One monthly price per (teacher, matiere, niveau) combo. Groupes with
// the same combo share the same price automatically. Admin manages
// these directly; factures pull base_amount from here at creation time
// (and can still override per-facture via remise_percent).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tarifs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->foreignId('matiere_id')->constrained('matieres')->cascadeOnDelete();
            $table->foreignId('niveau_id')->constrained('niveaux')->cascadeOnDelete();
            $table->decimal('monthly_price', 10, 2);
            $table->timestamps();

            $table->unique(['teacher_id', 'matiere_id', 'niveau_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tarifs');
    }
};