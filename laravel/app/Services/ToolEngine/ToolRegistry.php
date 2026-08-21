<?php

namespace App\Services\ToolEngine;

use App\Models\Tool;
use App\Services\ToolEngine\Contracts\ToolProcessorInterface;
use App\Services\ToolEngine\Processors\TextCaseProcessor;
use App\Services\ToolEngine\Processors\WordCounterProcessor;
use App\Services\ToolEngine\Processors\JsonFormatterProcessor;
use App\Services\ToolEngine\Processors\HashGeneratorProcessor;
use App\Services\ToolEngine\Processors\DiffCheckerProcessor;
use App\Services\ToolEngine\Processors\QrCodeProcessor;
use App\Services\ToolEngine\Processors\SqlFormatterProcessor;
use App\Services\ToolEngine\Processors\PdfMergeProcessor;
use App\Services\ToolEngine\Processors\PdfSplitProcessor;
use App\Services\ToolEngine\Processors\PdfRotateProcessor;
use App\Services\ToolEngine\Processors\PdfWatermarkProcessor;
use App\Services\ToolEngine\Processors\PdfPageNumberProcessor;
use App\Services\ToolEngine\Processors\ImageToPdfProcessor;
use App\Services\ToolEngine\Processors\ImageConvertProcessor;
use App\Services\ToolEngine\Processors\ImageCompressProcessor;
use App\Services\ToolEngine\Processors\ImageResizeProcessor;
use App\Services\ToolEngine\Processors\ImageCropProcessor;
use App\Services\ToolEngine\Processors\ImageRotateProcessor;
use App\Services\ToolEngine\Processors\ImageWatermarkProcessor;
use App\Services\ToolEngine\Processors\ImageGrayscaleProcessor;
use App\Services\ToolEngine\Processors\Base64ImageProcessor;
use App\Services\ToolEngine\Processors\FaviconGeneratorProcessor;
use App\Services\ToolEngine\Processors\LoremIpsumProcessor;
use App\Services\ToolEngine\Processors\TextSlugifyProcessor;
use App\Services\ToolEngine\Processors\TextDuplicateRemoverProcessor;
use App\Services\ToolEngine\Processors\TextBinaryConverterProcessor;
use App\Services\ToolEngine\Processors\XmlFormatterProcessor;
use App\Services\ToolEngine\Processors\HtmlMinifierProcessor;
use App\Services\ToolEngine\Processors\CssMinifierProcessor;
use App\Services\ToolEngine\Processors\UrlEncoderProcessor;
use App\Services\ToolEngine\Processors\Base64Processor;
use App\Services\ToolEngine\Processors\JwtDecoderProcessor;
use App\Services\ToolEngine\Processors\UuidGeneratorProcessor;
use App\Services\ToolEngine\Processors\PasswordGeneratorProcessor;
use App\Services\ToolEngine\Processors\BcryptGeneratorProcessor;
use App\Services\ToolEngine\Processors\AesEncryptProcessor;
use App\Services\ToolEngine\Processors\SslCertCheckerProcessor;
use App\Services\ToolEngine\Processors\SeoAuditProcessor;
use App\Services\ToolEngine\Processors\RobotsTxtGeneratorProcessor;
use App\Services\ToolEngine\Processors\MetaTagGeneratorProcessor;
use App\Services\ToolEngine\Processors\DnsLookupProcessor;
use App\Services\ToolEngine\Processors\HttpHeaderCheckerProcessor;
use App\Services\ToolEngine\Processors\ZipCreateProcessor;
use App\Services\ToolEngine\Processors\BarcodeGeneratorProcessor;
use App\Services\ToolEngine\Processors\UnitConverterProcessor;
use App\Services\ToolEngine\Processors\TimestampConverterProcessor;
use App\Services\ToolEngine\Processors\PercentageCalculatorProcessor;
use Illuminate\Support\Facades\App;
use InvalidArgumentException;

class ToolRegistry
{
    protected array $processors = [];

    public function __construct()
    {
        $this->registerDefaultProcessors();
    }

    /**
     * Register core processors into the registry.
     */
    protected function registerDefaultProcessors(): void
    {
        // Text & String Tools
        $this->register(TextCaseProcessor::class);
        $this->register(WordCounterProcessor::class);
        $this->register(DiffCheckerProcessor::class);
        $this->register(LoremIpsumProcessor::class);
        $this->register(TextSlugifyProcessor::class);
        $this->register(TextDuplicateRemoverProcessor::class);
        $this->register(TextBinaryConverterProcessor::class);

        // Developer & Code Tools
        $this->register(JsonFormatterProcessor::class);
        $this->register(SqlFormatterProcessor::class);
        $this->register(XmlFormatterProcessor::class);
        $this->register(HtmlMinifierProcessor::class);
        $this->register(CssMinifierProcessor::class);
        $this->register(UrlEncoderProcessor::class);
        $this->register(Base64Processor::class);
        $this->register(JwtDecoderProcessor::class);
        $this->register(UuidGeneratorProcessor::class);

        // Security & Cryptography Tools
        $this->register(HashGeneratorProcessor::class);
        $this->register(PasswordGeneratorProcessor::class);
        $this->register(BcryptGeneratorProcessor::class);
        $this->register(AesEncryptProcessor::class);
        $this->register(SslCertCheckerProcessor::class);

        // PDF Processing Tools
        $this->register(PdfMergeProcessor::class);
        $this->register(PdfSplitProcessor::class);
        $this->register(PdfRotateProcessor::class);
        $this->register(PdfWatermarkProcessor::class);
        $this->register(PdfPageNumberProcessor::class);
        $this->register(ImageToPdfProcessor::class);

        // Image Processing Tools
        $this->register(ImageConvertProcessor::class);
        $this->register(ImageCompressProcessor::class);
        $this->register(ImageResizeProcessor::class);
        $this->register(ImageCropProcessor::class);
        $this->register(ImageRotateProcessor::class);
        $this->register(ImageWatermarkProcessor::class);
        $this->register(ImageGrayscaleProcessor::class);
        $this->register(Base64ImageProcessor::class);
        $this->register(FaviconGeneratorProcessor::class);

        // SEO & Web Inspection Tools
        $this->register(SeoAuditProcessor::class);
        $this->register(RobotsTxtGeneratorProcessor::class);
        $this->register(MetaTagGeneratorProcessor::class);
        $this->register(DnsLookupProcessor::class);
        $this->register(HttpHeaderCheckerProcessor::class);

        // Archive & Media Tools
        $this->register(ZipCreateProcessor::class);
        $this->register(QrCodeProcessor::class);
        $this->register(BarcodeGeneratorProcessor::class);

        // Converters & Calculators
        $this->register(UnitConverterProcessor::class);
        $this->register(TimestampConverterProcessor::class);
        $this->register(PercentageCalculatorProcessor::class);
    }

    /**
     * Register a tool processor.
     */
    public function register(string $processorClass): void
    {
        $instance = App::make($processorClass);
        if (!$instance instanceof ToolProcessorInterface) {
            throw new InvalidArgumentException("Class {$processorClass} must implement ToolProcessorInterface");
        }

        $this->processors[$instance->getSlug()] = $processorClass;
    }

    /**
     * Check if a processor exists for a slug.
     */
    public function has(string $slug): bool
    {
        return isset($this->processors[$slug]);
    }

    /**
     * Resolve processor instance for a given tool.
     */
    public function getProcessor(Tool $tool): ToolProcessorInterface
    {
        $slug = $tool->slug;

        // 1. Direct slug match
        if (isset($this->processors[$slug])) {
            return App::make($this->processors[$slug]);
        }

        // 2. Database configured processor_class
        if (!empty($tool->processor_class) && class_exists($tool->processor_class)) {
            return App::make($tool->processor_class);
        }

        // 3. Fallback generic text processor
        return App::make(TextCaseProcessor::class);
    }

    /**
     * Get all registered processor slugs.
     */
    public function getRegisteredSlugs(): array
    {
        return array_keys($this->processors);
    }
}
