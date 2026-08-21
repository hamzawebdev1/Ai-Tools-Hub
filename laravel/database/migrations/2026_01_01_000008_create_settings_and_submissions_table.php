<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key', 100)->unique();
            $table->longText('value')->nullable();
            $table->string('group', 50)->default('general')->index(); // general, seo, storage, security, limits, appearance
            $table->string('type', 20)->default('string'); // string, boolean, integer, json, array
            $table->boolean('is_public')->default(false); // Can be exposed in frontend config
            $table->string('description', 255)->nullable();
            $table->timestamps();
        });

        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->string('reference_id', 50)->unique();
            $table->string('type', 30)->index(); // contact, bug_report, feature_request, tool_suggestion
            $table->string('name', 150)->nullable();
            $table->string('email', 150);
            $table->string('subject', 200)->nullable();
            $table->string('tool_name', 150)->nullable();
            $table->string('category', 50)->nullable();
            $table->string('priority', 20)->default('medium'); // low, medium, high, urgent
            $table->longText('message');
            $table->string('attachment_path')->nullable();
            $table->string('status', 30)->default('new'); // new, in_review, resolved, archived
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('admin_notes')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();

            $table->index(['type', 'status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submissions');
        Schema::dropIfExists('settings');
    }
};
