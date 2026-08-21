<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;

class SqlFormatterProcessor extends BaseToolProcessor
{
    public function getSlug(): string
    {
        return 'sql-formatter';
    }

    public function getValidationRules(): array
    {
        return [
            'sql' => 'required|string|max:500000',
            'dialect' => 'nullable|string|in:sql,mysql,mariadb,postgresql,sqlite',
            'action' => 'nullable|string|in:format,minify',
            'uppercase_keywords' => 'nullable|boolean',
        ];
    }

    public function process(array $input, Tool $tool): array
    {
        return $this->executeSafely(function () use ($input) {
            $sql = trim($input['sql']);
            $action = $input['action'] ?? 'format';
            $upper = isset($input['uppercase_keywords']) ? (bool) $input['uppercase_keywords'] : true;

            $keywords = [
                'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'INSERT', 'INTO', 'VALUES',
                'UPDATE', 'SET', 'DELETE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
                'OUTER JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
                'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'PRIMARY KEY', 'FOREIGN KEY',
                'REFERENCES', 'UNION', 'UNION ALL', 'AS', 'ON', 'IN', 'IS NULL', 'IS NOT NULL',
                'BETWEEN', 'LIKE', 'EXISTS', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN'
            ];

            if ($action === 'minify') {
                $minified = preg_replace('/\s+/', ' ', $sql);
                $minified = preg_replace('/\s*([,();=><])\s*/', '$1', $minified);
                return [
                    'output' => trim($minified),
                    'metadata' => ['original_bytes' => strlen($sql), 'result_bytes' => strlen($minified)],
                ];
            }

            // Clean, formatted SQL indentation
            $formatted = $sql;
            foreach ($keywords as $kw) {
                $replacement = $upper ? strtoupper($kw) : strtolower($kw);
                $formatted = preg_replace('/\b' . preg_quote($kw, '/') . '\b/i', $replacement, $formatted);
            }

            $formatted = preg_replace('/(SELECT|FROM|WHERE|LEFT JOIN|RIGHT JOIN|INNER JOIN|JOIN|GROUP BY|ORDER BY|HAVING|LIMIT|SET|VALUES)/i', "\n$1", $formatted);
            $formatted = preg_replace('/,\s*/', ",\n  ", $formatted);
            $formatted = trim($formatted);

            return [
                'output' => $formatted,
                'metadata' => [
                    'original_bytes' => strlen($sql),
                    'result_bytes' => strlen($formatted),
                    'keywords_standardized' => count($keywords),
                ],
            ];
        });
    }
}
