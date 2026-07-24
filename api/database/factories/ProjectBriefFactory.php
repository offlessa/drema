<?php

namespace Database\Factories;

use App\Enums\ProjectGoal;
use App\Models\ProjectBrief;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProjectBrief>
 */
class ProjectBriefFactory extends Factory
{
    public function definition(): array
    {
        return [
            'client_id' => User::factory(),
            'goal' => ProjectGoal::BuildHouse,
            'city' => 'Tubarão',
            'state' => 'SC',
        ];
    }
}
