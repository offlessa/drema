<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectBriefResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'goal' => $this->goal,
            'city' => $this->city,
            'state' => $this->state,
            'area_m2' => $this->area_m2,
            'rooms_count' => $this->rooms_count,
            'style' => new StyleResource($this->whenLoaded('style')),
            'budget_min' => $this->budget_min,
            'budget_max' => $this->budget_max,
            'timeline' => $this->timeline,
            'description' => $this->description,
            'reference_urls' => $this->reference_urls,
            'created_at' => $this->created_at,
        ];
    }
}
