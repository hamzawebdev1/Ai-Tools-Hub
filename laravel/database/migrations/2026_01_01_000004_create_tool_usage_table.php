<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tool_usage', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tool_id')->nullable()->constrained('tools')->nullOnDelete();
            $table->string('tool_slug', 150)->index();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('session_id', 100)->nullable()->index();
            $table->string('ip_hash', 64)->index(); // anonymized SHA-256 IP hash for GDPR/Privacy
            $table->string('country', 100)->nullable();
            $table->string('country_code', 5)->nullable()->index();
            $table->string('device', 30)->nullable(); // desktop, mobile, tablet
            $table->string('browser', 50)->nullable(); // Chrome, Safari, Firefox, Edge
            $table->string('operating_system', 50)->nullable(); // Windows, macOS, Linux, iOS, Android
            $table->string('status', 20)->default('success'); // success, failed
            $table->unsignedInteger('processing_duration_ms')->default(0);
            $table->unsignedBigInteger('file_size_bytes')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('created_at')->useCurrent()->index();

            $table->index(['created_at', 'status']);
            $table->index(['tool_slug', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tool_usage');
    }
};
