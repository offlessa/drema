<?php

namespace App\Models;

use App\Enums\MatchStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ProjectMatch extends Model
{
    protected $table = 'matches';

    protected $fillable = ['project_brief_id', 'professional_profile_id', 'compatibility_score', 'status'];

    protected function casts(): array
    {
        return [
            'status' => MatchStatus::class,
        ];
    }

    public function projectBrief(): BelongsTo
    {
        return $this->belongsTo(ProjectBrief::class);
    }

    public function professionalProfile(): BelongsTo
    {
        return $this->belongsTo(ProfessionalProfile::class);
    }

    public function conversation(): HasOne
    {
        return $this->hasOne(Conversation::class, 'match_id');
    }
}
