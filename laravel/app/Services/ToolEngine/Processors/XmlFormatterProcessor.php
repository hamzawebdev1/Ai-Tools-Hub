<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use DOMDocument;
use Exception;

class XmlFormatterProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'xml-formatter';
    }

    public function getValidationRules(): array
    {
        return [
            'xml_data' => 'required|string|max:100000',
            'indent' => 'nullable|integer|min:1|max:8',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $rawXml = trim($input['xml_data']);
            $indent = (int) ($input['indent'] ?? 2);

            libxml_use_internal_errors(true);
            $dom = new DOMDocument('1.0', 'UTF-8');
            $dom->preserveWhiteSpace = false;
            $dom->formatOutput = true;

            $loaded = $dom->loadXML($rawXml, LIBXML_NOBLANKS | LIBXML_NOCDATA);
            $errors = libxml_get_errors();
            libxml_clear_errors();

            if (!$loaded || !empty($errors)) {
                $errorMsg = !empty($errors) ? $errors[0]->message : 'Invalid XML syntax.';
                throw new Exception("XML Syntax Error: " . trim($errorMsg));
            }

            $formatted = $dom->saveXML();

            return [
                'output' => [
                    'formatted_xml' => $formatted,
                    'is_valid' => true,
                    'root_element' => $dom->documentElement?->nodeName,
                    'length' => strlen($formatted),
                ],
                'download_token' => null,
            ];
        });
    }
}
