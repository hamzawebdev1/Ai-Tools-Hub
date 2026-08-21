@extends('layouts.app')

@section('title', $tool->seo_title ?: $tool->name . ' - ' . setting('site_name', 'ToolsHub Pro'))
@section('meta_description', $tool->seo_description ?: $tool->description)

@section('content')
<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Breadcrumbs -->
    <nav class="flex items-center space-x-2 text-xs text-slate-400 mb-6">
        <a href="{{ route('tools.index') }}" class="hover:text-white">Tools</a>
        <span>/</span>
        <a href="{{ route('tools.index', ['category' => $tool->category]) }}" class="hover:text-white capitalize">{{ $tool->category }}</a>
        <span>/</span>
        <span class="text-white">{{ $tool->name }}</span>
    </nav>

    <!-- Header Section -->
    <div class="border-b border-slate-800 pb-6 mb-8">
        <div class="flex items-center space-x-3">
            <span class="px-2.5 py-1 rounded text-xs font-semibold uppercase bg-indigo-900/40 text-indigo-400 border border-indigo-700/50">
                {{ $tool->category }}
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white">{{ $tool->name }}</h1>
        </div>
        <p class="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed">{{ $tool->description }}</p>
    </div>

    <!-- Interactive Execution Workbench -->
    <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <form id="toolForm" action="{{ route('tools.execute', $tool->slug) }}" method="POST">
            @csrf

            <!-- If Tool requires File Upload -->
            @if(!empty($tool->allowed_file_types))
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-slate-200 mb-2">Select or Drop Files</label>
                    <div id="dropzone" class="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-8 text-center cursor-pointer bg-slate-950/50 transition">
                        <input type="file" id="fileInput" class="hidden" {{ in_array($tool->slug, ['merge-pdf']) ? 'multiple' : '' }}>
                        <div class="text-slate-400 text-sm">
                            <span class="font-semibold text-indigo-400">Click to upload</span> or drag and drop
                        </div>
                        <div class="text-xs text-slate-500 mt-1">
                            Allowed: {{ implode(', ', $tool->allowed_file_types) }} (Max: {{ $tool->max_file_size_mb }}MB)
                        </div>
                    </div>
                    <div id="fileList" class="mt-3 space-y-2"></div>
                </div>
            @endif

            <!-- If Tool requires text / options payload -->
            @if(in_array($tool->slug, ['case-converter', 'word-counter', 'json-formatter', 'sql-formatter', 'hash-generator', 'diff-checker', 'qr-code-generator', 'meta-tag-analyzer']))
                <div class="space-y-4 mb-6">
                    @if($tool->slug === 'diff-checker')
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-300 mb-1">Original Text</label>
                                <textarea name="original_text" rows="8" class="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-sm font-mono text-white focus:outline-none focus:border-indigo-500" placeholder="Paste original content..."></textarea>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-300 mb-1">Modified Text</label>
                                <textarea name="modified_text" rows="8" class="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-sm font-mono text-white focus:outline-none focus:border-indigo-500" placeholder="Paste updated content..."></textarea>
                            </div>
                        </div>
                    @elseif($tool->slug === 'qr-code-generator')
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1">QR Content (URL, Text, or VCard)</label>
                            <input type="text" name="content" class="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="https://example.com" value="https://example.com">
                        </div>
                    @elseif($tool->slug === 'case-converter')
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1">Input Text</label>
                            <textarea name="text" rows="6" class="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="Type or paste your text here..."></textarea>
                        </div>
                        <div class="flex flex-wrap gap-2 pt-2">
                            <input type="hidden" name="target_case" id="target_case" value="uppercase">
                            @foreach(['uppercase' => 'UPPERCASE', 'lowercase' => 'lowercase', 'titlecase' => 'Title Case', 'camelcase' => 'camelCase', 'snakecase' => 'snake_case', 'kebabcase' => 'kebab-case', 'constantcase' => 'CONSTANT_CASE'] as $caseKey => $caseLabel)
                                <button type="button" onclick="setCase('{{ $caseKey }}')" class="case-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white transition">
                                    {{ $caseLabel }}
                                </button>
                            @endforeach
                        </div>
                    @elseif($tool->slug === 'json-formatter')
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1">JSON Input</label>
                            <textarea name="json" rows="8" class="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-sm font-mono text-white focus:outline-none focus:border-indigo-500" placeholder="{'name': 'test'}"></textarea>
                        </div>
                        <div class="flex space-x-3 pt-2">
                            <select name="action" class="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-3 py-2">
                                <option value="format">Beautify / Format (2 Spaces)</option>
                                <option value="minify">Minify / Compact</option>
                                <option value="validate">Validate Only</option>
                            </select>
                        </div>
                    @else
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1">Input Content</label>
                            <textarea name="text" rows="6" class="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="Enter content to process..."></textarea>
                        </div>
                    @endif
                </div>
            @endif

            <!-- Submit Button & Execution Status -->
            <div class="flex items-center justify-between pt-4 border-t border-slate-800">
                <button type="submit" id="submitBtn" class="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2">
                    <span>Process Now</span>
                </button>
                <div id="loadingStatus" class="hidden text-xs text-indigo-400 animate-pulse">
                    Processing safely on server...
                </div>
            </div>
        </form>

        <!-- Result Container -->
        <div id="resultBox" class="mt-8 pt-6 border-t border-slate-800 hidden">
            <div class="flex items-center justify-between mb-3">
                <h3 class="font-bold text-sm text-slate-200">Execution Result</h3>
                <div class="flex space-x-2">
                    <button type="button" id="copyBtn" class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded font-medium transition">
                        Copy Output
                    </button>
                    <a id="downloadLink" href="#" class="hidden px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-xs text-white rounded font-medium transition">
                        Download File
                    </a>
                </div>
            </div>
            <pre id="outputPre" class="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto whitespace-pre-wrap"></pre>
        </div>
    </div>

    <!-- Related Tools -->
    @if($relatedTools->isNotEmpty())
        <div class="mt-16">
            <h3 class="text-lg font-bold text-white mb-6">Related {{ ucfirst($tool->category) }} Tools</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                @foreach($relatedTools as $related)
                    <a href="{{ route('tools.show', $related->slug) }}" class="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/40 transition">
                        <div class="font-semibold text-sm text-white">{{ $related->name }}</div>
                        <p class="text-xs text-slate-400 mt-1 line-clamp-2">{{ $related->description }}</p>
                    </a>
                @endforeach
            </div>
        </div>
    @endif
</div>
@endsection

@section('scripts')
<script>
    function setCase(caseKey) {
        document.getElementById('target_case').value = caseKey;
        document.querySelectorAll('.case-btn').forEach(b => b.classList.remove('bg-indigo-600', 'text-white'));
        event.target.classList.add('bg-indigo-600', 'text-white');
    }

    const form = document.getElementById('toolForm');
    const resultBox = document.getElementById('resultBox');
    const outputPre = document.getElementById('outputPre');
    const loadingStatus = document.getElementById('loadingStatus');
    const copyBtn = document.getElementById('copyBtn');
    const downloadLink = document.getElementById('downloadLink');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        loadingStatus.classList.remove('hidden');
        resultBox.classList.add('hidden');

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => data[key] = value);

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const json = await res.json();
            loadingStatus.classList.add('hidden');

            if (json.success) {
                resultBox.classList.remove('hidden');
                outputPre.textContent = typeof json.output === 'object' ? JSON.stringify(json.output, null, 2) : json.output;

                if (json.download_url) {
                    downloadLink.href = json.download_url;
                    downloadLink.classList.remove('hidden');
                } else {
                    downloadLink.classList.add('hidden');
                }
            } else {
                alert('Error: ' + (json.error || 'Execution failed'));
            }
        } catch (err) {
            loadingStatus.classList.add('hidden');
            alert('Request error: ' + err.message);
        }
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(outputPre.textContent);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy Output', 2000);
    });
</script>
@endsection
