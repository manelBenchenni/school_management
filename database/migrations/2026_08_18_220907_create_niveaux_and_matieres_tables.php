<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Algerian level system: primaire (5 years), moyen/middle (4 years: 1ere-4eme),
// lycee/high school (3 years). Stored as rows so admin can manage them
// without a code change, rather than hardcoding an enum.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('niveaux', function (Blueprint $table) {
            $table->id();
            $table->enum('cycle', ['primaire', 'moyen', 'lycee']);
            $table->unsignedTinyInteger('year'); // 1..5 primaire, 1..4 moyen, 1..3 lycee
            $table->string('label'); // e.g. "3eme Annee Moyenne"
            $table->timestamps();
        });

        Schema::create('matieres', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. "Mathematiques", "Anglais"
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('matieres');
        Schema::dropIfExists('niveaux');
    }
};