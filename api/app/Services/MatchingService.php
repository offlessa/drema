<?php

namespace App\Services;

use App\Enums\ProfessionalStatus;
use App\Models\ProfessionalProfile;
use App\Models\ProjectBrief;
use Illuminate\Support\Collection;

/**
 * Compatibility score between a client's project brief and a professional.
 *
 * Deliberately rule-based and explainable (not a black-box ML model): with
 * zero historical matches/reviews on the platform, an opaque "AI score"
 * would have nothing real to learn from. This scores on category fit,
 * location, budget overlap and style — the same signals a person would use
 * to judge compatibility — and can be swapped for a learned model later
 * once there is real match/outcome data to train on.
 */
class MatchingService
{
    private const TYPE_MATCH = 30;

    private const TYPE_MISMATCH = 10;

    private const CITY_MATCH = 30;

    private const STATE_MATCH = 15;

    private const BUDGET_OVERLAP = 25;

    private const BUDGET_UNKNOWN = 12;

    private const STYLE_MATCH = 15;

    private const STYLE_UNSPECIFIED = 8;

    private const MINIMUM_SCORE = 30;

    /**
     * @return Collection<int, array{professional: ProfessionalProfile, score: int}>
     */
    public function findCompatibleProfessionals(ProjectBrief $brief, int $limit = 5): Collection
    {
        return ProfessionalProfile::query()
            ->where('status', ProfessionalStatus::Approved)
            ->with('styles', 'user')
            ->get()
            ->map(fn (ProfessionalProfile $professional) => [
                'professional' => $professional,
                'score' => $this->score($brief, $professional),
            ])
            ->filter(fn (array $result) => $result['score'] >= self::MINIMUM_SCORE)
            ->sortByDesc('score')
            ->take($limit)
            ->values();
    }

    public function score(ProjectBrief $brief, ProfessionalProfile $professional): int
    {
        $score = $this->typeScore($brief, $professional)
            + $this->locationScore($brief, $professional)
            + $this->budgetScore($brief, $professional)
            + $this->styleScore($brief, $professional);

        return min(100, $score);
    }

    private function typeScore(ProjectBrief $brief, ProfessionalProfile $professional): int
    {
        $relevantTypes = $brief->goal->relevantProfessionalTypes();

        return in_array($professional->professional_type, $relevantTypes, true)
            ? self::TYPE_MATCH
            : self::TYPE_MISMATCH;
    }

    private function locationScore(ProjectBrief $brief, ProfessionalProfile $professional): int
    {
        if (mb_strtolower($professional->city) === mb_strtolower($brief->city)) {
            return self::CITY_MATCH;
        }

        if ($professional->state === $brief->state) {
            return self::STATE_MATCH;
        }

        return 0;
    }

    private function budgetScore(ProjectBrief $brief, ProfessionalProfile $professional): int
    {
        if ($brief->budget_min === null || $brief->budget_max === null
            || $professional->budget_min === null || $professional->budget_max === null) {
            return self::BUDGET_UNKNOWN;
        }

        $overlaps = $professional->budget_min <= $brief->budget_max
            && $professional->budget_max >= $brief->budget_min;

        return $overlaps ? self::BUDGET_OVERLAP : 0;
    }

    private function styleScore(ProjectBrief $brief, ProfessionalProfile $professional): int
    {
        if ($brief->style_id === null) {
            return self::STYLE_UNSPECIFIED;
        }

        return $professional->styles->contains('id', $brief->style_id)
            ? self::STYLE_MATCH
            : 0;
    }
}
