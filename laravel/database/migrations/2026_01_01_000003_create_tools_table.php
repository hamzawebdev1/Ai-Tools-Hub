<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tools', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('slug', 150)->unique();
            $table->string('category', 50)->index(); // pdf, image, text, developer, seo, converters, calculators, qr, security, media, file
            $table->string('subcategory', 50)->nullable();
            $table->text('description');
            $table->string('icon', 50)->default('Tool');
            $table->string('status', 20)->default('active'); // active, maintenance, deprecated, beta
            $table->string('processor_class', 255); // Full PHP namespace or registered key in ToolRegistry
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_new')->default(false);
            $table->json('validation_rules')->nullable(); // JSON schema / validation params
            $table->json('allowed_file_types')->nullable(); // e.g. ["pdf"], ["jpg", "png", "webp"]
            $table->unsignedInteger('max_file_size_mb')->default(25);
            $table->string('processing_mode', 20)->default('sync'); // sync, queue, client_wasm
            $table->string('seo_title', 255)->nullable();
            $table->text('seo_description')->nullable();
            $table->json('seo_keywords')->nullable();
            $table->decimal('rating', 3, 2)->default(4.90);
            $table->unsignedInteger('rating_count')->default(120);
            $table->unsignedBigInteger('total_runs')->default(0);
            $table->timestamps();

            $table->index(['category', 'status', 'is_active']);
            $table->index(['is_featured', 'is_popular']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tools');
    }
};
