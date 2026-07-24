<?php

namespace Database\Factories;

use App\Enums\ProfessionalStatus;
use App\Enums\ProfessionalType;
use App\Models\ProfessionalProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProfessionalProfile>
 */
class ProfessionalProfileFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->state(['role' => 'professional']),
            'professional_type' => ProfessionalType::Architect,
            'city' => 'Tubarão',
            'state' => 'SC',
            'service_radius_km' => 50,
            'status' => ProfessionalStatus::Approved,
        ];
    }

    public function pending(): static
    {
        return $this->state(['status' => ProfessionalStatus::Pending]);
    }

    public function rejected(): static
    {
        return $this->state(['status' => ProfessionalStatus::Rejected]);
    }
}
