<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Style extends Model
{
    protected $fillable = ['name', 'slug'];

    public function professionalProfiles(): BelongsToMany
    {
        return $this->belongsToMany(ProfessionalProfile::class, 'professional_style');
    }
}
