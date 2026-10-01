<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;\nuse App\Models\PartnerApplication;\nuse App\Models\Skill;

class ApplicationController extends Controller
{
    public function newsletter(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $id = DB::table('system_settings')->insertGetId([
            'setting_key' => 'newsletter_' . now()->format('Ymd_His') . '_' . Str::lower(Str::random(6)),
            'setting_value' => json_encode([
                'title' => 'Newsletter subscriber',
                'amount' => $data['email'],
                'status' => 'new',
                'owner' => $data['email'],
                'email' => $data['email'],
                'details' => 'Newsletter subscription from public website.',
            ]),
            'setting_type' => 'json',
            'description' => 'Public newsletter subscription',
            'is_editable' => true,
            'is_public' => false,
            'group' => 'admin_module_crm',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'id' => $id,
            'message' => 'Subscription received.',
        ], 201);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'applicationType' => ['required', 'string', 'max:80'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'targetCountry' => ['nullable', 'string', 'max:120'],
            'category' => ['nullable', 'string', 'max:120'],
            'budget' => ['nullable', 'string', 'max:120'],
            'details' => ['nullable', 'string', 'max:5000'],
            'document' => ['nullable', 'file', 'max:10240'],
        ]);

        $documentUrl = null;
        if ($request->hasFile('document')) {
            $path = $request->file('document')->store('applications', 'public');
            $documentUrl = $this->publishPublicDiskFile($path);
        }

        $label = $this->applicationLabel($data['applicationType']);
        $id = DB::table('system_settings')->insertGetId([
            'setting_key' => 'application_' . now()->format('Ymd_His') . '_' . Str::lower(Str::random(6)),
            'setting_value' => json_encode([
                'title' => $data['name'] . ' - ' . $label,
                'amount' => $data['email'],
                'status' => 'new',
                'owner' => $data['name'],
                'applicationType' => $data['applicationType'],
                'applicationLabel' => $label,
                'email' => $data['email'],
                'phone' => $data['phone'],
                'targetCountry' => $data['targetCountry'] ?? null,
                'category' => $data['category'] ?? null,
                'budget' => $data['budget'] ?? null,
                'documentUrl' => $documentUrl,
                'details' => trim(
                    "Application type: {$label}\n" .
                    "Name: {$data['name']}\n" .
                    "Email: {$data['email']}\n" .
                    "Phone: {$data['phone']}" .
                    (! empty($data['category']) ? "\nCategory: {$data['category']}" : '') .
                    (! empty($data['budget']) ? "\nBudget: {$data['budget']}" : '') .
                    (! empty($data['details']) ? "\nDetails: {$data['details']}" : '') .
                    (! empty($data['targetCountry']) ? "\nTarget country: {$data['targetCountry']}" : '') .
                    ($documentUrl ? "\nDocument: {$documentUrl}" : '')
                ),
            ]),
            'setting_type' => 'json',
            'description' => 'Public application form submission',
            'is_editable' => true,
            'is_public' => false,
            'group' => 'admin_module_crm',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'id' => $id,
            'message' => 'Application submitted successfully.',
        ], 201);
    }

    public function storePartnerApplication(Request $request)
    {
        $data=$request->validate([
            'full_name'=>['required','string','max:255'],'email'=>['required','email','max:255'],'phone'=>['nullable','string','max:50'],
            'country'=>['nullable','string','max:120'],'city'=>['nullable','string','max:120'],'bio'=>['nullable','string','max:5000'],
            'experience_years'=>['nullable','integer','min:0','max:80'],'availability'=>['nullable','string','max:120'],
            'skills'=>['nullable','array'],'skills.*'=>['integer','exists:skills,id'],'skills_text'=>['nullable','string','max:3000'],
        ]);
        $application=DB::transaction(function() use($data){
            $application=PartnerApplication::create([
                'application_number'=>'DSH-PA-'.now()->format('YmdHis').'-'.Str::upper(Str::random(4)),
                'full_name'=>$data['full_name'],'email'=>$data['email'],'phone'=>$data['phone']??null,'country'=>$data['country']??null,'city'=>$data['city']??null,
                'bio'=>$data['bio']??null,'experience_years'=>$data['experience_years']??null,'availability'=>$data['availability']??null,'status'=>'pending','submitted_at'=>now(),
            ]);
            foreach($data['skills']??[] as $skillId){$application->skills()->create(['skill_id'=>$skillId]);}\n            foreach(preg_split('/[,\\n]+/',(string)($data['skills_text']??''),-1,PREG_SPLIT_NO_EMPTY) as $skillName){$skillName=trim($skillName); if(!$skillName) continue; $skill=Skill::firstOrCreate(['slug'=>Str::slug($skillName)],['name'=>$skillName,'is_active'=>true]); $application->skills()->firstOrCreate(['skill_id'=>$skill->id]);}
            return $application->load('skills.skill');
        });
        return response()->json(['message'=>'Partner application submitted successfully.','application'=>$application],201);
    }

    protected function applicationLabel(string $type): string
    {
        return match ($type) {
            'admission' => 'Admission / Student',
            'job' => 'Job Application',
            'course' => 'Skill Development',
            'visa' => 'Visa / Study Abroad',
            'certification' => 'Online Certification',
            'freelance' => 'Freelance Program',
            'fbr' => 'FBR / Tax Services',
            'consult' => 'Consultation',
            'service' => 'Service Quote Request',
            'marketplace' => 'Marketplace Inquiry',
            'newsletter' => 'Newsletter',
            default => Str::headline($type),
        };
    }

    protected function publishPublicDiskFile(string $path): string
    {
        $normalized = str_replace('\\', '/', ltrim($path, '/'));
        $source = Storage::disk('public')->path($normalized);
        $target = public_path('storage/' . $normalized);

        if (is_file($source) && ! is_file($target)) {
            $directory = dirname($target);
            if (! is_dir($directory)) {
                mkdir($directory, 0755, true);
            }
            copy($source, $target);
        }

        return url('storage/' . $normalized);
    }
}
