<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('project_briefs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('users')->cascadeOnDelete();
            $table->enum('goal', ['build_house', 'renovate', 'interior_design', 'commercial_project', 'landscaping']);
            $table->string('city');
            $table->string('state', 2);
            $table->unsignedInteger('area_m2')->nullable();
            $table->unsignedTinyInteger('rooms_count')->nullable();
            $table->foreignId('style_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('budget_min', 12, 2)->nullable();
            $table->decimal('budget_max', 12, 2)->nullable();
            $table->string('timeline')->nullable();
            $table->text('description')->nullable();
            $table->json('reference_urls')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_briefs');
    }
};
