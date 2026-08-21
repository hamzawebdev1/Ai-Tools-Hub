<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use Exception;
use Illuminate\Support\Facades\Http;

class SeoAuditProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'meta-tag-analyzer';
    }

    public function getValidationRules(): array
    {
        return [
            'url' => 'nullable|url|max:500',
            'html' => 'nullable|string|max:500000',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $html = $input['html'] ?? '';

            if (!empty($input['url'])) {
                $targetUrl = $input['url'];
                // Validate against private IP / SSRF ranges
                $parsed = parse_url($targetUrl);
                $host = $parsed['host'] ?? '';
                $ip = gethostbyname($host);
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
                    throw new Exception("Private/Internal IP addresses are not permitted for security.");
                }

                $response = Http::timeout(6)->withUserAgent('ToolsHub-SeoBot/2.0')->get($targetUrl);
                if (!$response->successful()) {
                    throw new Exception("Failed to fetch target URL. Status code: " . $response->status());
                }
                $html = $response->body();
            }

            if (empty($html)) {
                throw new Exception("Either a valid target URL or HTML markup must be provided.");
            }

            // Parse Meta Tags
            $title = '';
            if (preg_match('/<title[^>]*>(.*?)<\/title>/is', $html, $matches)) {
                $title = trim($matches[1]);
            }

            $metaDescription = '';
            if (preg_match('/<meta[^>]*name=["\']description["\'][^>]*content=["\'](.*?)["\']/is', $html, $matches)) {
                $metaDescription = trim($matches[1]);
            }

            $ogTitle = '';
            if (preg_match('/<meta[^>]*property=["\']og:title["\'][^>]*content=["\'](.*?)["\']/is', $html, $matches)) {
                $ogTitle = trim($matches[1]);
            }

            $ogImage = '';
            if (preg_match('/<meta[^>]*property=["\']og:image["\'][^>]*content=["\'](.*?)["\']/is', $html, $matches)) {
                $ogImage = trim($matches[1]);
            }

            $canonical = '';
            if (preg_match('/<link[^>]*rel=["\']canonical["\'][^>]*href=["\'](.*?)["\']/is', $html, $matches)) {
                $canonical = trim($matches[1]);
            }

            // Headings counts
            preg_match_all('/<h1[^>]*>/i', $html, $h1Matches);
            preg_match_all('/<h2[^>]*>/i', $html, $h2Matches);
            preg_match_all('/<h3[^>]*>/i', $html, $h3Matches);

            // Images with missing alt
            preg_match_all('/<img[^>]*>/i', $html, $imgMatches);
            $totalImages = count($imgMatches[0] ?? []);
            $missingAltCount = 0;
            foreach ($imgMatches[0] ?? [] as $imgTag) {
                if (!preg_match('/alt=["\'][^"\']+["\']/i', $imgTag)) {
                    $missingAltCount++;
                }
            }

            $titleLength = mb_strlen($title);
            $descLength = mb_strlen($metaDescription);

            $score = 100;
            if ($titleLength === 0) $score -= 25;
            elseif ($titleLength < 30 || $titleLength > 65) $score -= 10;

            if ($descLength === 0) $score -= 25;
            elseif ($descLength < 70 || $descLength > 160) $score -= 10;

            if (count($h1Matches[0]) !== 1) $score -= 15;
            if ($missingAltCount > 0) $score -= min(15, $missingAltCount * 3);

            return [
                'output' => [
                    'overall_seo_score' => max(10, $score),
                    'title' => $title,
                    'title_length' => $titleLength,
                    'title_status' => ($titleLength >= 30 && $titleLength <= 65) ? 'optimal' : 'needs_improvement',
                    'meta_description' => $metaDescription,
                    'description_length' => $descLength,
                    'description_status' => ($descLength >= 70 && $descLength <= 160) ? 'optimal' : 'needs_improvement',
                    'og_title' => $ogTitle,
                    'og_image' => $ogImage,
                    'canonical_url' => $canonical,
                    'h1_count' => count($h1Matches[0]),
                    'h2_count' => count($h2Matches[0]),
                    'h3_count' => count($h3Matches[0]),
                    'total_images' => $totalImages,
                    'images_missing_alt' => $missingAltCount,
                ],
                'metadata' => [
                    'seo_score' => max(10, $score),
                    'has_meta_desc' => !empty($metaDescription),
                ],
            ];
        });
    }
}
