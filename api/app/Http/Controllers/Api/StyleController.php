<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StyleResource;
use App\Models\Style;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class StyleController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return StyleResource::collection(Style::orderBy('name')->get());
    }
}
