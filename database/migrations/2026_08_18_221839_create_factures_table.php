<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// One facture per enrollment per month. sessions_paid is how many
// sessions that payment covers; sessions_remaining is decremented as
// presence rows (present OR absent - both consume a session) are
// recorded for that student/groupe within the month. remise_percent
// and remise_amount are set ad hoc by admin/reception per facture,
// never a fixed rate.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('factures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enrollment_id')->constrained('enrollments')->cascadeOnDelete();
            $table->date('month'); // stored as the 1st of the billing month

            $table->enum('payment_status', ['paid', 'not_paid', 'remise', 'free']);
            $table->unsignedInteger('sessions_paid')->default(0);
            $table->decimal('base_amount', 10, 2)->default(0);
            $table->decimal('remise_percent', 5, 2)->nullable(); // set by admin/reception, not fixed
            $table->decimal('amount_due', 10, 2)->default(0); // base_amount after remise, 0 if free
            $table->timestamp('paid_at')->nullable();

            $table->foreignId('created_by')->constrained('users'); // admin or reception
            $table->timestamps();

            $table->unique(['enrollment_id', 'month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('factures');
    }
};