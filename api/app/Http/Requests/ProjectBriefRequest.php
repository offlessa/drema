<?php

namespace App\Http\Requests;

use App\Enums\ProjectGoal;
use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectBriefRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === UserRole::Client;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'goal' => ['required', Rule::in(array_column(ProjectGoal::cases(), 'value'))],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['required', 'string', 'size:2'],
            'area_m2' => ['nullable', 'integer', 'min:1'],
            'rooms_count' => ['nullable', 'integer', 'min:1', 'max:50'],
            'style_id' => ['nullable', 'integer', Rule::exists('styles', 'id')],
            'budget_min' => ['nullable', 'numeric', 'min:0'],
            'budget_max' => ['nullable', 'numeric', 'gte:budget_min'],
            'timeline' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'reference_urls' => ['nullable', 'array', 'max:10'],
            'reference_urls.*' => ['url', 'max:500'],
        ];
    }
}
