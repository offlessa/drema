<?php

namespace App\Enums;

enum ProjectGoal: string
{
    case BuildHouse = 'build_house';
    case Renovate = 'renovate';
    case InteriorDesign = 'interior_design';
    case CommercialProject = 'commercial_project';
    case Landscaping = 'landscaping';

    /**
     * Professional types considered relevant for this goal, used by the matching score.
     *
     * @return ProfessionalType[]
     */
    public function relevantProfessionalTypes(): array
    {
        return match ($this) {
            self::BuildHouse => [ProfessionalType::Architect, ProfessionalType::Engineer, ProfessionalType::ConstructionCompany],
            self::Renovate => [ProfessionalType::Architect, ProfessionalType::Engineer, ProfessionalType::ConstructionCompany, ProfessionalType::InteriorDesigner],
            self::InteriorDesign => [ProfessionalType::InteriorDesigner],
            self::CommercialProject => [ProfessionalType::Architect, ProfessionalType::Engineer, ProfessionalType::ConstructionCompany, ProfessionalType::InteriorDesigner],
            self::Landscaping => [ProfessionalType::Architect, ProfessionalType::InteriorDesigner],
        };
    }
}
