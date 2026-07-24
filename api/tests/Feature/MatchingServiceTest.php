<?php

namespace Tests\Feature;

use App\Enums\ProfessionalType;
use App\Enums\ProjectGoal;
use App\Models\ProfessionalProfile;
use App\Models\ProjectBrief;
use App\Models\Style;
use App\Services\MatchingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MatchingServiceTest extends TestCase
{
    use RefreshDatabase;

    private MatchingService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new MatchingService;
    }

    public function test_relevant_professional_type_scores_higher_than_irrelevant(): void
    {
        $brief = ProjectBrief::factory()->create(['goal' => ProjectGoal::BuildHouse]);

        $relevant = ProfessionalProfile::factory()->create(['professional_type' => ProfessionalType::Architect]);
        $irrelevant = ProfessionalProfile::factory()->create(['professional_type' => ProfessionalType::InteriorDesigner]);

        $this->assertGreaterThan(
            $this->service->score($brief, $irrelevant),
            $this->service->score($brief, $relevant),
        );
    }

    public function test_same_city_scores_higher_than_same_state_only(): void
    {
        $brief = ProjectBrief::factory()->create(['city' => 'Tubarão', 'state' => 'SC']);

        $sameCity = ProfessionalProfile::factory()->create(['city' => 'Tubarão', 'state' => 'SC']);
        $sameStateOnly = ProfessionalProfile::factory()->create(['city' => 'Florianópolis', 'state' => 'SC']);
        $differentState = ProfessionalProfile::factory()->create(['city' => 'São Paulo', 'state' => 'SP']);

        $cityScore = $this->service->score($brief, $sameCity);
        $stateScore = $this->service->score($brief, $sameStateOnly);
        $noMatchScore = $this->service->score($brief, $differentState);

        $this->assertGreaterThan($stateScore, $cityScore);
        $this->assertGreaterThan($noMatchScore, $stateScore);
    }

    public function test_overlapping_budget_scores_higher_than_non_overlapping(): void
    {
        $brief = ProjectBrief::factory()->create(['budget_min' => 100_000, 'budget_max' => 300_000]);

        $overlapping = ProfessionalProfile::factory()->create(['budget_min' => 200_000, 'budget_max' => 400_000]);
        $nonOverlapping = ProfessionalProfile::factory()->create(['budget_min' => 500_000, 'budget_max' => 900_000]);

        $this->assertGreaterThan(
            $this->service->score($brief, $nonOverlapping),
            $this->service->score($brief, $overlapping),
        );
    }

    public function test_unknown_budget_scores_between_overlap_and_no_overlap(): void
    {
        $brief = ProjectBrief::factory()->create(['budget_min' => 100_000, 'budget_max' => 300_000]);

        $overlapping = ProfessionalProfile::factory()->create(['budget_min' => 200_000, 'budget_max' => 400_000]);
        $unknownBudget = ProfessionalProfile::factory()->create(['budget_min' => null, 'budget_max' => null]);
        $nonOverlapping = ProfessionalProfile::factory()->create(['budget_min' => 500_000, 'budget_max' => 900_000]);

        $overlapScore = $this->service->score($brief, $overlapping);
        $unknownScore = $this->service->score($brief, $unknownBudget);
        $noOverlapScore = $this->service->score($brief, $nonOverlapping);

        $this->assertGreaterThan($unknownScore, $overlapScore);
        $this->assertGreaterThan($noOverlapScore, $unknownScore);
    }

    public function test_shared_style_scores_higher_than_no_shared_style(): void
    {
        $sharedStyle = Style::factory()->create();
        $otherStyle = Style::factory()->create();
        $brief = ProjectBrief::factory()->create(['style_id' => $sharedStyle->id]);

        $matchingStyle = ProfessionalProfile::factory()->create();
        $matchingStyle->styles()->attach($sharedStyle);

        $nonMatchingStyle = ProfessionalProfile::factory()->create();
        $nonMatchingStyle->styles()->attach($otherStyle);

        $this->assertGreaterThan(
            $this->service->score($brief, $nonMatchingStyle),
            $this->service->score($brief, $matchingStyle),
        );
    }

    public function test_unspecified_brief_style_scores_between_match_and_no_match(): void
    {
        $sharedStyle = Style::factory()->create();
        $otherStyle = Style::factory()->create();

        $briefWithStyle = ProjectBrief::factory()->create(['style_id' => $sharedStyle->id]);
        $briefWithoutStyle = ProjectBrief::factory()->create(['style_id' => null]);

        $matchingStyle = ProfessionalProfile::factory()->create();
        $matchingStyle->styles()->attach($sharedStyle);

        $nonMatchingStyle = ProfessionalProfile::factory()->create();
        $nonMatchingStyle->styles()->attach($otherStyle);

        $matchScore = $this->service->score($briefWithStyle, $matchingStyle->fresh(['styles']));
        $unspecifiedScore = $this->service->score($briefWithoutStyle, $nonMatchingStyle->fresh(['styles']));
        $noMatchScore = $this->service->score($briefWithStyle, $nonMatchingStyle->fresh(['styles']));

        $this->assertGreaterThan($unspecifiedScore, $matchScore);
        $this->assertGreaterThan($noMatchScore, $unspecifiedScore);
    }

    public function test_find_compatible_professionals_excludes_pending_and_rejected(): void
    {
        $brief = ProjectBrief::factory()->create(['goal' => ProjectGoal::BuildHouse, 'city' => 'Tubarão', 'state' => 'SC']);

        $approved = ProfessionalProfile::factory()->create([
            'professional_type' => ProfessionalType::Architect,
            'city' => 'Tubarão',
            'state' => 'SC',
        ]);
        ProfessionalProfile::factory()->pending()->create([
            'professional_type' => ProfessionalType::Architect,
            'city' => 'Tubarão',
            'state' => 'SC',
        ]);
        ProfessionalProfile::factory()->rejected()->create([
            'professional_type' => ProfessionalType::Architect,
            'city' => 'Tubarão',
            'state' => 'SC',
        ]);

        $results = $this->service->findCompatibleProfessionals($brief);

        $this->assertCount(1, $results);
        $this->assertSame($approved->id, $results->first()['professional']->id);
    }

    public function test_find_compatible_professionals_excludes_scores_below_minimum(): void
    {
        // Irrelevant type (10) + no location match (0) + unknown budget (12) + unspecified style (8) = 30, at the boundary.
        // Brief needs a concrete budget range so a professional with a *specified* non-overlapping
        // range actually scores 0 for budget instead of falling into the "unknown" bucket too.
        $brief = ProjectBrief::factory()->create([
            'goal' => ProjectGoal::BuildHouse,
            'city' => 'Tubarão',
            'state' => 'SC',
            'budget_min' => 100_000,
            'budget_max' => 300_000,
            'style_id' => null,
        ]);

        // Below the 30-point floor: irrelevant type (10) + no location (0) + non-overlapping budget (0) + unspecified style (8) = 18.
        ProfessionalProfile::factory()->create([
            'professional_type' => ProfessionalType::InteriorDesigner,
            'city' => 'São Paulo',
            'state' => 'SP',
            'budget_min' => 500_000,
            'budget_max' => 900_000,
        ]);

        $atFloor = ProfessionalProfile::factory()->create([
            'professional_type' => ProfessionalType::InteriorDesigner,
            'city' => 'São Paulo',
            'state' => 'SP',
            'budget_min' => null,
            'budget_max' => null,
        ]);

        $results = $this->service->findCompatibleProfessionals($brief);

        $this->assertCount(1, $results);
        $this->assertSame($atFloor->id, $results->first()['professional']->id);
        $this->assertSame(30, $results->first()['score']);
    }

    public function test_find_compatible_professionals_sorts_by_score_descending(): void
    {
        $brief = ProjectBrief::factory()->create(['goal' => ProjectGoal::BuildHouse, 'city' => 'Tubarão', 'state' => 'SC']);

        $lowScore = ProfessionalProfile::factory()->create([
            'professional_type' => ProfessionalType::InteriorDesigner,
            'city' => 'São Paulo',
            'state' => 'SP',
        ]);
        $highScore = ProfessionalProfile::factory()->create([
            'professional_type' => ProfessionalType::Architect,
            'city' => 'Tubarão',
            'state' => 'SC',
        ]);

        $results = $this->service->findCompatibleProfessionals($brief);

        $this->assertSame($highScore->id, $results->first()['professional']->id);
        $this->assertSame($lowScore->id, $results->last()['professional']->id);
    }

    public function test_find_compatible_professionals_respects_limit(): void
    {
        $brief = ProjectBrief::factory()->create(['goal' => ProjectGoal::BuildHouse, 'city' => 'Tubarão', 'state' => 'SC']);

        ProfessionalProfile::factory()->count(3)->create([
            'professional_type' => ProfessionalType::Architect,
            'city' => 'Tubarão',
            'state' => 'SC',
        ]);

        $results = $this->service->findCompatibleProfessionals($brief, limit: 2);

        $this->assertCount(2, $results);
    }
}
