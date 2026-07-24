<?php

namespace App\Console\Commands;

use App\Enums\MatchStatus;
use App\Enums\ProfessionalStatus;
use App\Models\ProfessionalProfile;
use App\Models\ProjectBrief;
use App\Models\ProjectMatch;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Reports the 4 success metrics defined in docs/ROADMAP.md for Fase 0,
 * computed from data that already exists (project_briefs, matches,
 * conversations, messages) rather than a separate events pipeline.
 */
class Fase0Metrics extends Command
{
    protected $signature = 'metrics:fase0 {--city= : Filtra pela cidade piloto}';

    protected $description = 'Métricas de sucesso da Fase 0 (ver docs/ROADMAP.md)';

    public function handle(): int
    {
        $city = $this->option('city');

        $briefsQuery = ProjectBrief::when($city, fn ($q) => $q->where('city', $city));
        $totalBriefs = (clone $briefsQuery)->count();
        $briefsWithMatch = (clone $briefsQuery)->whereHas('matches')->count();

        $matchesQuery = ProjectMatch::when(
            $city,
            fn ($q) => $q->whereHas('projectBrief', fn ($b) => $b->where('city', $city))
        );
        $totalMatches = (clone $matchesQuery)->count();
        $matchesChatting = (clone $matchesQuery)->where('status', MatchStatus::Chatting)->count();

        $avgHoursToFirstMessage = $this->averageHoursToFirstMessage($city);

        $activeProfessionals = ProfessionalProfile::where('status', ProfessionalStatus::Approved)
            ->when($city, fn ($q) => $q->where('city', $city))
            ->whereHas('matches')
            ->count();
        $totalApprovedProfessionals = ProfessionalProfile::where('status', ProfessionalStatus::Approved)
            ->when($city, fn ($q) => $q->where('city', $city))
            ->count();

        $this->newLine();
        $this->info('Fase 0 — ' . ($city ? "cidade: {$city}" : 'todas as cidades'));
        $this->line(str_repeat('─', 60));

        $this->reportRate(
            '% de questionários com ≥1 match',
            $briefsWithMatch,
            $totalBriefs,
        );
        $this->comment('  todo match salvo já passou do score mínimo (MatchingService::MINIMUM_SCORE)');

        $this->newLine();
        $this->reportRate(
            '% de matches em que o cliente demonstrou interesse',
            $matchesChatting,
            $totalMatches,
        );

        $this->newLine();
        $this->line(sprintf(
            'Tempo médio até a 1ª mensagem: %s',
            $avgHoursToFirstMessage !== null ? number_format($avgHoursToFirstMessage, 1) . 'h' : 'sem dados ainda',
        ));

        $this->newLine();
        $this->line(sprintf(
            'Profissionais aprovados ativos (≥1 lead): %d de %d aprovados',
            $activeProfessionals,
            $totalApprovedProfessionals,
        ));
        $this->newLine();

        return self::SUCCESS;
    }

    private function reportRate(string $label, int $numerator, int $denominator): void
    {
        $percentage = $denominator > 0 ? round($numerator / $denominator * 100, 1) : null;

        $this->line(sprintf(
            '%s: %s (%d de %d)',
            $label,
            $percentage !== null ? "{$percentage}%" : 'sem dados ainda',
            $numerator,
            $denominator,
        ));
    }

    private function averageHoursToFirstMessage(?string $city): ?float
    {
        $rows = DB::table('matches')
            ->join('project_briefs', 'project_briefs.id', '=', 'matches.project_brief_id')
            ->join('conversations', 'conversations.match_id', '=', 'matches.id')
            ->join('messages', 'messages.conversation_id', '=', 'conversations.id')
            ->when($city, fn ($q) => $q->where('project_briefs.city', $city))
            ->groupBy('conversations.id', 'project_briefs.created_at')
            ->select('project_briefs.created_at as brief_created_at')
            ->selectRaw('MIN(messages.created_at) as first_message_at')
            ->get();

        if ($rows->isEmpty()) {
            return null;
        }

        $hours = $rows->map(
            fn ($row) => \Carbon\Carbon::parse($row->brief_created_at)
                ->diffInMinutes(\Carbon\Carbon::parse($row->first_message_at)) / 60
        );

        return round($hours->avg(), 2);
    }
}
