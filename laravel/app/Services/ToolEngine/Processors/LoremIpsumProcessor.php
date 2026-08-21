<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;

class LoremIpsumProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'lorem-ipsum-generator';
    }

    public function getValidationRules(): array
    {
        return [
            'type' => 'required|string|in:paragraphs,sentences,words',
            'count' => 'required|integer|min:1|max:50',
            'start_with_lorem' => 'nullable|boolean',
            'as_html' => 'nullable|boolean',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $type = $input['type'];
            $count = (int) $input['count'];
            $startWithLorem = $input['start_with_lorem'] ?? true;
            $asHtml = $input['as_html'] ?? false;

            $vocab = [
                'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'curabitur',
                'vel', 'hendrerit', 'libero', 'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut',
                'orci', 'gravida', 'imperdiet', 'nullam', 'purus', 'lacinia', 'a', 'pretium', 'quis',
                'congue', 'praesent', 'sagittis', 'laoreet', 'auctor', 'mauris', 'non', 'velit', 'eros',
                'dictum', 'proin', 'accumsan', 'sapien', 'nec', 'massa', 'volutpat', 'venenatis', 'sed',
                'eu', 'molestie', 'lacus', 'quisque', 'porttitor', 'ligula', 'dui', 'mollis', 'tempus',
                'at', 'magna', 'vestibulum', 'turpis', 'ac', 'diam', 'tincidunt', 'id', 'condimentum'
            ];

            $generateSentence = function (bool $first = false) use ($vocab, $startWithLorem) {
                $wordsCount = rand(8, 16);
                $words = [];
                if ($first && $startWithLorem) {
                    $words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet'];
                    $wordsCount = max(0, $wordsCount - 5);
                }
                for ($i = 0; $i < $wordsCount; $i++) {
                    $words[] = $vocab[array_rand($vocab)];
                }
                $str = implode(' ', $words);
                return ucfirst($str) . '.';
            };

            $generateParagraph = function (bool $first = false) use ($generateSentence) {
                $sentencesCount = rand(4, 7);
                $sentences = [];
                for ($i = 0; $i < $sentencesCount; $i++) {
                    $sentences[] = $generateSentence($first && $i === 0);
                }
                return implode(' ', $sentences);
            };

            $result = [];
            if ($type === 'words') {
                $words = [];
                if ($startWithLorem && $count >= 5) {
                    $words = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'];
                    $count -= 5;
                }
                for ($i = 0; $i < $count; $i++) {
                    $words[] = $vocab[array_rand($vocab)];
                }
                $textOutput = implode(' ', $words);
            } elseif ($type === 'sentences') {
                for ($i = 0; $i < $count; $i++) {
                    $result[] = $generateSentence($i === 0);
                }
                $textOutput = implode(' ', $result);
            } else {
                for ($i = 0; $i < $count; $i++) {
                    $p = $generateParagraph($i === 0);
                    $result[] = $asHtml ? "<p>{$p}</p>" : $p;
                }
                $textOutput = implode("\n\n", $result);
            }

            return [
                'output' => [
                    'text' => $textOutput,
                    'type' => $type,
                    'count' => (int) $input['count'],
                    'word_count' => str_word_count(strip_tags($textOutput)),
                    'character_count' => strlen(strip_tags($textOutput)),
                ],
                'download_token' => null,
            ];
        });
    }
}
