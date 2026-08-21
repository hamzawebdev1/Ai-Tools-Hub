@extends('layouts.admin')

@section('header_title', 'Edit Tool: ' . $tool->name)

@section('content')
<div class="max-w-4xl mx-auto">
    <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8">
        <form action="{{ route('admin.tools.update', $tool->id) }}" method="POST">
            @csrf
            @method('PUT')

            <div class="space-y-6">
                <!-- Basic Info -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-xs font-semibold text-slate-300 mb-1">Tool Display Name</label>
                        <input type="text" name="name" value="{{ old('name', $tool->name) }}" class="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-sm text-white" required>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                        <input type="text" name="category" value="{{ old('category', $tool->category) }}" class="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-sm text-white" required>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                    <textarea name="description" rows="3" class="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-sm text-white" required>{{ old('description', $tool->description) }}</textarea>
                </div>

                <!-- Limits & Toggles -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                        <label class="block text-xs font-semibold text-slate-300 mb-1">Max Upload Limit (MB)</label>
                        <input type="number" name="max_file_size_mb" value="{{ old('max_file_size_mb', $tool->max_file_size_mb) }}" class="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-sm text-white" required>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-300 mb-1">Operational Status</label>
                        <select name="status" class="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-sm text-white">
                            <option value="active" {{ $tool->status === 'active' ? 'selected' : '' }}>Active</option>
                            <option value="maintenance" {{ $tool->status === 'maintenance' ? 'selected' : '' }}>Maintenance</option>
                            <option value="deprecated" {{ $tool->status === 'deprecated' ? 'selected' : '' }}>Deprecated</option>
                        </select>
                    </div>
                    <div class="flex items-center space-x-6 pt-5">
                        <label class="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                            <input type="checkbox" name="is_active" value="1" {{ $tool->is_active ? 'checked' : '' }} class="rounded bg-slate-950 border-slate-800 text-indigo-600">
                            <span>Is Active</span>
                        </label>
                        <label class="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                            <input type="checkbox" name="is_popular" value="1" {{ $tool->is_popular ? 'checked' : '' }} class="rounded bg-slate-950 border-slate-800 text-indigo-600">
                            <span>Popular</span>
                        </label>
                    </div>
                </div>

                <!-- SEO Section -->
                <div class="pt-6 border-t border-slate-800 space-y-4">
                    <h4 class="font-bold text-sm text-white">SEO & Metadata</h4>
                    <div>
                        <label class="block text-xs font-semibold text-slate-300 mb-1">Custom SEO Title</label>
                        <input type="text" name="seo_title" value="{{ old('seo_title', $tool->seo_title) }}" class="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-sm text-white">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-300 mb-1">Custom Meta Description</label>
                        <textarea name="seo_description" rows="2" class="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-sm text-white">{{ old('seo_description', $tool->seo_description) }}</textarea>
                    </div>
                </div>

                <div class="flex justify-end space-x-3 pt-6 border-t border-slate-800">
                    <a href="{{ route('admin.tools.index') }}" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold">Cancel</a>
                    <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition">Save Changes</button>
                </div>
            </div>
        </form>
    </div>
</div>
@endsection
