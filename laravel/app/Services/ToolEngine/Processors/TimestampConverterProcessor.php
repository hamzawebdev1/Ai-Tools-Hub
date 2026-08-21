<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use DateTime;
use DateTimeZone;
use Exception;

class TimestampConverterProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'unix-timestamp-converter';
    }

    public function getValidationRules(): array
    {
        return [
            'mode' => 'required|string|in:timestamp_to_date,date_to_timestamp,current',
            'timestamp' => 'nullable|numeric',
            'date_string' => 'nullable|string|max:100',
            'timezone' => 'nullable|string|max:50',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $mode = $input['mode'];
            $tzName = $input['timezone'] ?? 'UTC';

            try {
                $tz = new DateTimeZone($tzName);
            } catch (Exception) {
                $tz = new DateTimeZone('UTC');
            }

            if ($mode === 'current') {
                $time = time();
                $dt = new DateTime("@{$time}");
                $dt->setTimezone($tz);

                return [
                    'output' => [
                        'unix_timestamp' => $time,
                        'utc_date' => gmdate('Y-m-d H:i:s T', $time),
                        'iso_8601' => gmdate('c', $time),
                        'local_date' => $dt->format('Y-m-d H:i:s T'),
                    ],
                    'download_token' => null,
                ];
            } elseif ($mode === 'timestamp_to_date') {
                $ts = (int) ($input['timestamp'] ?? time());
                // Handle millisecond timestamps (13 digits)
                if ($ts > 100000000000) {
                    $ts = (int) round($ts / 1000);
                }

                $dt = new DateTime("@{$ts}");
                $dt->setTimezone($tz);

                return [
                    'output' => [
                        'unix_timestamp' => $ts,
                        'utc_date' => gmdate('Y-m-d H:i:s T', $ts),
                        'iso_8601' => gmdate('c', $ts),
                        'local_date' => $dt->format('Y-m-d H:i:s T'),
                        'relative' => $this->timeElapsedString($ts),
                    ],
                    'download_token' => null,
                ];
            } else {
                $dateStr = trim($input['date_string'] ?? 'now');
                $dt = new DateTime($dateStr, $tz);
                $ts = $dt->getTimestamp();

                return [
                    'output' => [
                        'unix_timestamp' => $ts,
                        'utc_date' => gmdate('Y-m-d H:i:s T', $ts),
                        'iso_8601' => gmdate('c', $ts),
                        'parsed_date' => $dt->format('Y-m-d H:i:s T'),
                    ],
                    'download_token' => null,
                ];
            }
        });
    }

    private function timeElapsedString(int $time): string
    {
        $diff = time() - $time;
        if ($diff === 0) return 'just now';
        $isPast = $diff > 0;
        $diff = abs($diff);

        $tokens = [
            31536000 => 'year',
            2592000 => 'month',
            604800 => 'week',
            86400 => 'day',
            3600 => 'hour',
            60 => 'minute',
            1 => 'second'
        ];

        foreach ($tokens as $unit => $text) {
            if ($diff < $unit) continue;
            $numberOfUnits = floor($diff / $unit);
            return $isPast
                ? "{$numberOfUnits} {$text}" . ($numberOfUnits > 1 ? 's' : '') . " ago"
                : "in {$numberOfUnits} {$text}" . ($numberOfUnits > 1 ? 's' : '');
        }

        return 'just now';
    }
}
