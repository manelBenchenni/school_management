<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// One row per real date+time occurrence of a groupe's weekly slot.
// Generated ahead of time (e.g. a monthly job that expands
// groupe_schedules into concrete dates). Presence always references
// a specific instance, never just "the groupe" - this is what lets
// the scanner tell a duplicate scan from a new one, and what the
// end-of-day sweep job walks to auto-mark absences.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('session_instances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('groupe_id')->constrained('groupes')->cascadeOnDelete();
            $table->foreignId('groupe_schedule_id')->nullable()->constrained('groupe_schedules')->nullOnDelete();
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            // closed = end-of-day sweep has run and locked in absences
            $table->enum('status', ['scheduled', 'in_progress', 'closed', 'cancelled'])->default('scheduled');
            $table->timestamps();

            $table->unique(['groupe_id', 'date', 'start_time']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('session_instances');
    }
};