<?php

namespace App\Models;

use App\Enums\ProfessionalStatus;
use App\Enums\ProfessionalType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProfessionalProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'professional_type', 'company_name', 'bio', 'city', 'state',
        'service_radius_km', 'years_experience', 'budget_min', 'budget_max', 'portfolio_url', 'status',
    ];

    protected function casts(): array
    {
        return [
            'professional_type' => ProfessionalType::class,
            'status' => ProfessionalStatus::class,
            'budget_min' => 'decimal:2',
            'budget_max' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function styles(): BelongsToMany
    {
        return $this->belongsToMany(Style::class, 'professional_style');
    }

    public function matches(): HasMany
    {
        return $this->hasMany(ProjectMatch::class);
    }
}
