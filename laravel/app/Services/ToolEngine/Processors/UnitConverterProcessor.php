<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;

class UnitConverterProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'unit-converter';
    }

    public function getValidationRules(): array
    {
        return [
            'category' => 'required|string|in:length,weight,temperature,digital_storage,speed,area,volume',
            'value' => 'required|numeric',
            'from_unit' => 'required|string',
            'to_unit' => 'required|string',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $cat = $input['category'];
            $val = (float) $input['value'];
            $from = strtolower(trim($input['from_unit']));
            $to = strtolower(trim($input['to_unit']));

            $conversions = [
                'length' => [
                    'meters' => 1.0,
                    'kilometers' => 1000.0,
                    'centimeters' => 0.01,
                    'millimeters' => 0.001,
                    'miles' => 1609.344,
                    'yards' => 0.9144,
                    'feet' => 0.3048,
                    'inches' => 0.0254,
                ],
                'weight' => [
                    'kilograms' => 1.0,
                    'grams' => 0.001,
                    'milligrams' => 0.000001,
                    'pounds' => 0.45359237,
                    'ounces' => 0.028349523125,
                    'metric_tons' => 1000.0,
                ],
                'digital_storage' => [
                    'bytes' => 1.0,
                    'kilobytes' => 1024.0,
                    'megabytes' => 1048576.0,
                    'gigabytes' => 1073741824.0,
                    'terabytes' => 1099511627776.0,
                ],
                'speed' => [
                    'm_s' => 1.0,
                    'km_h' => 0.27777777777778,
                    'mph' => 0.44704,
                    'knots' => 0.51444444444444,
                ],
            ];

            if ($cat === 'temperature') {
                // Special conversion formulas for temperature
                $celsius = match ($from) {
                    'celsius', 'c' => $val,
                    'fahrenheit', 'f' => ($val - 32) * (5 / 9),
                    'kelvin', 'k' => $val - 273.15,
                    default => throw new Exception("Unknown temperature unit {$from}"),
                };

                $converted = match ($to) {
                    'celsius', 'c' => $celsius,
                    'fahrenheit', 'f' => ($celsius * 9 / 5) + 32,
                    'kelvin', 'k' => $celsius + 273.15,
                    default => throw new Exception("Unknown temperature unit {$to}"),
                };
            } elseif (isset($conversions[$cat])) {
                $rates = $conversions[$cat];
                if (!isset($rates[$from]) || !isset($rates[$to])) {
                    throw new Exception("Unsupported conversion from '{$from}' to '{$to}' in {$cat}.");
                }
                $baseVal = $val * $rates[$from];
                $converted = $baseVal / $rates[$to];
            } else {
                throw new Exception("Conversion category {$cat} not supported.");
            }

            return [
                'output' => [
                    'input_value' => $val,
                    'from_unit' => $from,
                    'to_unit' => $to,
                    'converted_value' => round($converted, 6),
                    'category' => $cat,
                ],
                'download_token' => null,
            ];
        });
    }
}
