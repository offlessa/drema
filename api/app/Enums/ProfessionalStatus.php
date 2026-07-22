<?php

namespace App\Enums;

enum ProfessionalStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
}
