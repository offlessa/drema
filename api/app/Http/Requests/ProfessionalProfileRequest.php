<?php

namespace App\Http\Requests;

use App\Enums\ProfessionalType;
use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfessionalProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === UserRole::Professional;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'professional_type' => ['required', Rule::in(array_column(ProfessionalType::cases(), 'value'))],
            'company_name' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['required', 'string', 'size:2'],
            'service_radius_km' => ['nullable', 'integer', 'min:1', 'max:500'],
            'years_experience' => ['nullable', 'integer', 'min:0', 'max:80'],
            'budget_min' => ['nullable', 'numeric', 'min:0'],
            'budget_max' => ['nullable', 'numeric', 'gte:budget_min'],
            'portfolio_url' => ['nullable', 'url', 'max:255'],
            'style_ids' => ['nullable', 'array'],
            'style_ids.*' => ['integer', Rule::exists('styles', 'id')],
        ];
    }
}
