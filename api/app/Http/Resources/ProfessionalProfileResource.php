<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfessionalProfileResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->user->name,
            'professional_type' => $this->professional_type,
            'company_name' => $this->company_name,
            'bio' => $this->bio,
            'city' => $this->city,
            'state' => $this->state,
            'service_radius_km' => $this->service_radius_km,
            'years_experience' => $this->years_experience,
            'budget_min' => $this->budget_min,
            'budget_max' => $this->budget_max,
            'portfolio_url' => $this->portfolio_url,
            'status' => $this->status,
            'styles' => StyleResource::collection($this->whenLoaded('styles')),
        ];
    }
}
