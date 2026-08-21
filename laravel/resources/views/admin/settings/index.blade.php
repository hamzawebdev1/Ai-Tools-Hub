@extends('layouts.admin')

@section('header_title', 'System Settings & Controls')

@section('content')
<div class="max-w-4xl mx-auto">
    <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8">
        <form action="{{ route('admin.settings.update') }}" method="POST">
            @csrf

            <div class="space-y-8">
                @foreach($settings as $group => $items)
                    <div>
                        <h3 class="font-bold text-sm text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
                            {{ ucfirst($group) }} Configuration
                        </h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            @foreach($items as $setting)
                                <div>
                                    <label class="block text-xs font-semibold text-slate-300 mb-1">
                                        {{ ucwords(str_replace('_', ' ', $setting->key)) }}
                                    </label>
                                    @if($setting->type === 'boolean')
                                        <select name="settings[{{ $setting->key }}]" class="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-xs text-white">
                                            <option value="true" {{ $setting->value == 'true' ? 'selected' : '' }}>Enabled / True</option>
                                            <option value="false" {{ $setting->value == 'false' ? 'selected' : '' }}>Disabled / False</option>
                                        </select>
                                    @else
                                        <input type="text" name="settings[{{ $setting->key }}]" value="{{ $setting->value }}" class="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-xs text-white">
                                    @endif
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endforeach

                <div class="flex justify-end pt-4 border-t border-slate-800">
                    <button type="submit" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition">
                        Save System Settings
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>
@endsection
