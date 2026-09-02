<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// A student's membership in a groupe. Not monthly by itself - the
// monthly payment cycle is handled by `factures` below, so a student
// can stay enrolled in a groupe across many months without this row
// changing. Reception creates this when the student first joins the
// groupe (typically at the moment he pays).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('groupe_id')->constrained('groupes')->cascadeOnDelete();
            $table->date('joined_at');
            $table->date('left_at')->nullable(); // student is free to leave/switch groupes
            $table->foreignId('created_by')->constrained('users'); // reception or admin
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};