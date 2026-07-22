<?php

namespace Database\Seeders;

use App\Models\Style;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StyleSeeder extends Seeder
{
    private const STYLES = [
        'Contemporâneo',
        'Moderno',
        'Minimalista',
        'Industrial',
        'Rústico',
        'Clássico',
        'Escandinavo',
        'Tropical',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (self::STYLES as $name) {
            Style::updateOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name],
            );
        }
    }
}
