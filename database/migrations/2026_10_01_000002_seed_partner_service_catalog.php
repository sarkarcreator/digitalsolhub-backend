<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        if (!\Schema::hasTable('services')) {
            return;
        }

        $services = [
            ['Web Development','web-development','Websites, web apps and custom development.'],
            ['App Development','app-development','Mobile and application development.'],
            ['Digital Marketing','digital-marketing','Campaign strategy, growth and digital marketing.'],
            ['SEO Services','seo-services','Technical SEO, on-page SEO and search growth.'],
            ['Social Media Marketing','social-media-marketing','Social strategy, content and account management.'],
            ['Graphic Design & Branding','graphic-design-branding','Brand identity, graphics and marketing creatives.'],
            ['Content Creation','content-creation','Content strategy, writing, visuals and short-form content.'],
            ['AI Automation','ai-automation','AI agents, workflow automation and productivity systems.'],
            ['E-Commerce Solutions','ecommerce-solutions','Shopify, WooCommerce and e-commerce solutions.'],
            ['UI/UX Design','ui-ux-design','Interface, product and user-experience design.'],
        ];

        foreach ($services as [$name,$slug,$description]) {
            DB::table('services')->updateOrInsert(
                ['slug'=>$slug],
                ['name'=>$name,'description'=>$description,'is_active'=>true,'updated_at'=>now(),'created_at'=>now()]
            );
        }
    }

    public function down(): void
    {
        if (!\Schema::hasTable('services')) return;

        DB::table('services')->whereIn('slug', [
            'web-development','app-development','digital-marketing','seo-services',
            'social-media-marketing','graphic-design-branding','content-creation',
            'ai-automation','ecommerce-solutions','ui-ux-design'
        ])->delete();
    }
};
