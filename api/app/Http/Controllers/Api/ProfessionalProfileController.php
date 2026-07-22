<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfessionalProfileRequest;
use App\Http\Resources\ProfessionalProfileResource;
use App\Models\ProfessionalProfile;
use Illuminate\Http\Request;

class ProfessionalProfileController extends Controller
{
    public function show(Request $request): ProfessionalProfileResource
    {
        $profile = $request->user()->professionalProfile()->with('styles')->firstOrFail();

        return new ProfessionalProfileResource($profile);
    }

    public function store(ProfessionalProfileRequest $request): ProfessionalProfileResource
    {
        $data = $request->safe()->except('style_ids');

        /** @var ProfessionalProfile $profile */
        $profile = $request->user()->professionalProfile()->updateOrCreate([], $data);

        $profile->styles()->sync($request->safe()->input('style_ids', []));

        return new ProfessionalProfileResource($profile->load('styles'));
    }

    public function showPublic(ProfessionalProfile $professionalProfile): ProfessionalProfileResource
    {
        return new ProfessionalProfileResource($professionalProfile->load('styles', 'user'));
    }
}
