<?php

namespace App\Models;

use App\Enums\ProjectGoal;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectBrief extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id', 'goal', 'city', 'state', 'area_m2', 'rooms_count', 'style_id',
        'budget_min', 'budget_max', 'timeline', 'description', 'reference_urls',
    ];

    protected function casts(): array
    {
        return [
            'goal' => ProjectGoal::class,
            'budget_min' => 'decimal:2',
            'budget_max' => 'decimal:2',
            'reference_urls' => 'array',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function style(): BelongsTo
    {
        return $this->belongsTo(Style::class);
    }

    public function matches(): HasMany
    {
        return $this->hasMany(ProjectMatch::class);
    }
}
