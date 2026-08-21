<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;

class MetaTagGeneratorProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'meta-tag-generator';
    }

    public function getValidationRules(): array
    {
        return [
            'title' => 'required|string|max:100',
            'description' => 'required|string|max:300',
            'keywords' => 'nullable|string|max:300',
            'author' => 'nullable|string|max:100',
            'canonical_url' => 'nullable|url|max:255',
            'og_image' => 'nullable|url|max:255',
            'twitter_handle' => 'nullable|string|max:100',
            'site_name' => 'nullable|string|max:100',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $title = htmlspecialchars($input['title'], ENT_QUOTES, 'UTF-8');
            $desc = htmlspecialchars($input['description'], ENT_QUOTES, 'UTF-8');
            $kw = htmlspecialchars($input['keywords'] ?? '', ENT_QUOTES, 'UTF-8');
            $author = htmlspecialchars($input['author'] ?? '', ENT_QUOTES, 'UTF-8');
            $url = htmlspecialchars($input['canonical_url'] ?? '', ENT_QUOTES, 'UTF-8');
            $img = htmlspecialchars($input['og_image'] ?? '', ENT_QUOTES, 'UTF-8');
            $twitter = htmlspecialchars($input['twitter_handle'] ?? '', ENT_QUOTES, 'UTF-8');
            $site = htmlspecialchars($input['site_name'] ?? '', ENT_QUOTES, 'UTF-8');

            $tags = [];
            $tags[] = "<!-- Primary Meta Tags -->";
            $tags[] = "<title>{$title}</title>";
            $tags[] = "<meta name=\"title\" content=\"{$title}\">";
            $tags[] = "<meta name=\"description\" content=\"{$desc}\">";
            if ($kw) $tags[] = "<meta name=\"keywords\" content=\"{$kw}\">";
            if ($author) $tags[] = "<meta name=\"author\" content=\"{$author}\">";
            if ($url) $tags[] = "<link rel=\"canonical\" href=\"{$url}\">";

            $tags[] = "";
            $tags[] = "<!-- Open Graph / Facebook -->";
            $tags[] = "<meta property=\"og:type\" content=\"website\">";
            if ($url) $tags[] = "<meta property=\"og:url\" content=\"{$url}\">";
            $tags[] = "<meta property=\"og:title\" content=\"{$title}\">";
            $tags[] = "<meta property=\"og:description\" content=\"{$desc}\">";
            if ($img) $tags[] = "<meta property=\"og:image\" content=\"{$img}\">";
            if ($site) $tags[] = "<meta property=\"og:site_name\" content=\"{$site}\">";

            $tags[] = "";
            $tags[] = "<!-- Twitter -->";
            $tags[] = "<meta property=\"twitter:card\" content=\"summary_large_image\">";
            if ($url) $tags[] = "<meta property=\"twitter:url\" content=\"{$url}\">";
            $tags[] = "<meta property=\"twitter:title\" content=\"{$title}\">";
            $tags[] = "<meta property=\"twitter:description\" content=\"{$desc}\">";
            if ($img) $tags[] = "<meta property=\"twitter:image\" content=\"{$img}\">";
            if ($twitter) $tags[] = "<meta property=\"twitter:site\" content=\"{$twitter}\">";

            $html = implode("\n", $tags);

            return [
                'output' => [
                    'meta_tags_html' => $html,
                    'title_length' => strlen($input['title']),
                    'description_length' => strlen($input['description']),
                ],
                'download_token' => null,
            ];
        });
    }
}
