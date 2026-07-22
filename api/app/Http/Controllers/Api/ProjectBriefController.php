<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectBriefRequest;
use App\Http\Resources\ProjectMatchResource;
use App\Models\ProjectBrief;
use App\Models\ProjectMatch;
use App\Services\MatchingService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProjectBriefController extends Controller
{
    public function __construct(private readonly MatchingService $matchingService) {}

    public function store(ProjectBriefRequest $request): AnonymousResourceCollection
    {
        /** @var ProjectBrief $brief */
        $brief = $request->user()->projectBriefs()->create($request->validated());

        $results = $this->matchingService->findCompatibleProfessionals($brief);

        foreach ($results as $result) {
            ProjectMatch::create([
                'project_brief_id' => $brief->id,
                'professional_profile_id' => $result['professional']->id,
                'compatibility_score' => $result['score'],
            ]);
        }

        return ProjectMatchResource::collection(
            $brief->matches()->with('professionalProfile.styles', 'professionalProfile.user')->orderByDesc('compatibility_score')->get()
        );
    }

    public function matches(Request $request, ProjectBrief $projectBrief): AnonymousResourceCollection
    {
        abort_unless($projectBrief->client_id === $request->user()->id, 403);

        return ProjectMatchResource::collection(
            $projectBrief->matches()->with('professionalProfile.styles', 'professionalProfile.user', 'conversation')->orderByDesc('compatibility_score')->get()
        );
    }
}
