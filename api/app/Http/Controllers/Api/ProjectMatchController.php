<?php

namespace App\Http\Controllers\Api;

use App\Enums\MatchStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectMatchResource;
use App\Models\Conversation;
use App\Models\ProjectMatch;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProjectMatchController extends Controller
{
    public function leads(Request $request): AnonymousResourceCollection
    {
        $professionalProfile = $request->user()->professionalProfile()->firstOrFail();

        $matches = ProjectMatch::query()
            ->where('professional_profile_id', $professionalProfile->id)
            ->with('projectBrief.style', 'projectBrief.client', 'conversation')
            ->orderByDesc('compatibility_score')
            ->get();

        return ProjectMatchResource::collection($matches);
    }

    public function expressInterest(Request $request, ProjectMatch $match): ProjectMatchResource
    {
        abort_unless($match->projectBrief->client_id === $request->user()->id, 403);

        $conversation = $match->conversation ?? Conversation::create([
            'match_id' => $match->id,
            'client_id' => $match->projectBrief->client_id,
            'professional_id' => $match->professionalProfile->user_id,
        ]);

        if ($match->status === MatchStatus::Pending) {
            $match->update(['status' => MatchStatus::Chatting]);
        }

        return new ProjectMatchResource($match->fresh(['professionalProfile.styles', 'professionalProfile.user', 'conversation']));
    }
}
