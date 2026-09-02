<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('factures', function (Blueprint $table) {
            $table->date('period_start')->nullable()->after('enrollment_id');
            $table->date('period_end')->nullable()->after('period_start');
        });

        DB::table('factures')->orderBy('id')->get()->each(function ($facture) {
            $start = \Illuminate\Support\Carbon::parse($facture->month);
            DB::table('factures')->where('id', $facture->id)->update([
                'period_start' => $start,
                'period_end' => $start->copy()->addMonth(),
            ]);
        });

        Schema::table('factures', function (Blueprint $table) {
            // Give the enrollment_id FK a plain index to fall back on
            // before we drop the composite unique it's currently using.
            $table->index('enrollment_id');
        });

        Schema::table('factures', function (Blueprint $table) {
            $table->dropUnique(['enrollment_id', 'month']);
            $table->dropColumn('month');
            $table->unique(['enrollment_id', 'period_start']);
        });
    }

    public function down(): void
    {
        Schema::table('factures', function (Blueprint $table) {
            $table->date('month')->nullable()->after('enrollment_id');
        });

        DB::table('factures')->orderBy('id')->get()->each(function ($facture) {
            DB::table('factures')->where('id', $facture->id)->update([
                'month' => $facture->period_start,
            ]);
        });

        Schema::table('factures', function (Blueprint $table) {
            $table->dropUnique(['enrollment_id', 'period_start']);
            $table->dropColumn(['period_start', 'period_end']);
            $table->index('enrollment_id')->name('factures_enrollment_id_index_temp');
        });

        Schema::table('factures', function (Blueprint $table) {
            $table->dropIndex('factures_enrollment_id_index_temp');
            $table->unique(['enrollment_id', 'month']);
        });
    }
};