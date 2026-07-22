<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectMatchResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project_brief_id' => $this->project_brief_id,
            'compatibility_score' => $this->compatibility_score,
            'status' => $this->status,
            'professional' => new ProfessionalProfileResource($this->whenLoaded('professionalProfile')),
            'project_brief' => new ProjectBriefResource($this->whenLoaded('projectBrief')),
            'conversation_id' => $this->whenLoaded('conversation', fn () => $this->conversation?->id),
        ];
    }
}
