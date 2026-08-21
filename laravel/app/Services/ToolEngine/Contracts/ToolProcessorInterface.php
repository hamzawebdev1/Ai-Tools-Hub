<?php

namespace App\Services\ToolEngine\Contracts;

use App\Models\Tool;
use Illuminate\Http\Request;

interface ToolProcessorInterface
{
    /**
     * Get tool unique slug.
     */
    public function getSlug(): string;

    /**
     * Get validation rules for incoming payload/files.
     */
    public function getValidationRules(): array;

    /**
     * Execute tool processing.
     *
     * @param array $input Cleaned input parameters or file paths
     * @param Tool $tool Tool database model
     * @return array Standard result payload ['success' => bool, 'output' => mixed, 'download_token' => ?string, 'metadata' => array]
     */
    public function process(array $input, Tool $tool): array;
}
