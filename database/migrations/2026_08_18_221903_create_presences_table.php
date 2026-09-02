<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// One row per student per session_instance. Unique constraint on
// (session_instance_id, student_id) is what blocks a double barcode
// scan from consuming two sessions by mistake - the second scan just
// re-reads the existing row and displays the remaining count instead
// of inserting again. Absence still consumes a session (status is
// only ever present/absent, never "not counted").
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('presences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_instance_id')->constrained('session_instances')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->enum('status', ['present', 'absent']);
            // How the row was created - useful for auditing the
            // end-of-day auto-absent sweep vs manual/barcode entries.
            $table->enum('method', ['barcode', 'manual_teacher', 'manual_reception', 'auto_sweep']);
            $table->foreignId('marked_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('marked_at');
            $table->timestamps();

            $table->unique(['session_instance_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('presences');
    }
};