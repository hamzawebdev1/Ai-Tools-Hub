<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;

class WordCounterProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'word-counter';
    }

    public function getValidationRules(): array
    {
        return [
            'text' => 'required|string|max:1000000',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $text = $input['text'];

            $charCountWithSpaces = mb_strlen($text, 'UTF-8');
            $charCountNoSpaces = mb_strlen(preg_replace('/\s+/u', '', $text), 'UTF-8');
            
            $wordsArray = preg_split('/\s+/u', trim($text), -1, PREG_SPLIT_NO_EMPTY);
            $wordCount = count($wordsArray);

            $sentences = preg_split('/[.!?]+(?:\s+|$)/u', trim($text), -1, PREG_SPLIT_NO_EMPTY);
            $sentenceCount = count($sentences);

            $paragraphs = preg_split('/\n\s*\n/u', trim($text), -1, PREG_SPLIT_NO_EMPTY);
            $paragraphCount = count($paragraphs);

            $lines = explode("\n", $text);
            $lineCount = count($lines);

            $readingTimeMin = (int) ceil($wordCount / 200);
            $speakingTimeMin = (int) ceil($wordCount / 130);
            $avgWordLength = $wordCount > 0 ? round($charCountNoSpaces / $wordCount, 1) : 0;

            return [
                'output' => [
                    'words' => $wordCount,
                    'characters' => $charCountWithSpaces,
                    'characters_no_spaces' => $charCountNoSpaces,
                    'sentences' => $sentenceCount,
                    'paragraphs' => $paragraphCount,
                    'lines' => $lineCount,
                    'reading_time_minutes' => $readingTimeMin,
                    'speaking_time_minutes' => $speakingTimeMin,
                    'avg_word_length' => $avgWordLength,
                ],
                'metadata' => [
                    'word_count' => $wordCount,
                    'char_count' => $charCountWithSpaces,
                ],
            ];
        });
    }
}
