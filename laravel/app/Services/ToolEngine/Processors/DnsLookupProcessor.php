<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;

class DnsLookupProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'dns-lookup';
    }

    public function getValidationRules(): array
    {
        return [
            'domain' => 'required|string|max:255',
            'record_type' => 'nullable|string|in:ALL,A,AAAA,MX,TXT,NS,CNAME,SOA',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $rawDomain = trim($input['domain']);
            $recordType = $input['record_type'] ?? 'ALL';

            $host = parse_url($rawDomain, PHP_URL_HOST) ?: $rawDomain;
            $host = preg_replace('/^https?:\/\//i', '', $host);
            $host = explode('/', $host)[0];
            $host = explode(':', $host)[0];

            if (!filter_var($host, FILTER_VALIDATE_DOMAIN, FILTER_FLAG_HOSTNAME)) {
                throw new Exception("Invalid domain name.");
            }

            $dnsType = match ($recordType) {
                'A' => DNS_A,
                'AAAA' => DNS_AAAA,
                'MX' => DNS_MX,
                'TXT' => DNS_TXT,
                'NS' => DNS_NS,
                'CNAME' => DNS_CNAME,
                'SOA' => DNS_SOA,
                default => DNS_ALL,
            };

            $records = @dns_get_record($host, $dnsType);
            if ($records === false) {
                $records = [];
            }

            return [
                'output' => [
                    'domain' => $host,
                    'record_type' => $recordType,
                    'records' => $records,
                    'count' => count($records),
                ],
                'download_token' => null,
            ];
        });
    }
}
