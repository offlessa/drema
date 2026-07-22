<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConversationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isClient = $request->user()->id === $this->client_id;

        return [
            'id' => $this->id,
            'match_id' => $this->match_id,
            'other_party_name' => $isClient ? $this->professional->name : $this->client->name,
            'created_at' => $this->created_at,
        ];
    }
}
