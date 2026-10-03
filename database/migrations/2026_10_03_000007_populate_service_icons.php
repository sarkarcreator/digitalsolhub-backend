<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('services') || ! Schema::hasColumn('services', 'icon')) {
            return;
        }

        $icons = [
            'web-development' => 'Monitor',
            'app-development' => 'Smartphone',
            'digital-marketing' => 'Megaphone',
            'seo-services' => 'Globe',
            'social-media-marketing' => 'Video',
            'graphic-design-branding' => 'Layers',
            'content-creation' => 'FileText',
            'ai-automation' => 'Cpu',
            'ecommerce-solutions' => 'ShoppingCart',
            'ui-ux-design' => 'Palette',
        ];

        foreach ($icons as $slug => $icon) {
            DB::table('services')
                ->where('slug', $slug)
                ->update(['icon' => $icon, 'updated_at' => now()]);
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('services')) {
            return;
        }

        DB::table('services')->whereIn('slug', array_keys([
            'web-development' => true,
            'app-development' => true,
            'digital-marketing' => true,
            'seo-services' => true,
            'social-media-marketing' => true,
            'graphic-design-branding' => true,
            'content-creation' => true,
            'ai-automation' => true,
            'ecommerce-solutions' => true,
            'ui-ux-design' => true,
        ]))->update(['icon' => null, 'updated_at' => now()]);
    }
};
