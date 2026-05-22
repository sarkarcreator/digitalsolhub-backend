<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http as HttpClient;

class AiController extends Controller
{
    public function chat(Request $request)
    {
        $data = $request->validate([
            'prompt' => ['sometimes', 'string'],
            'systemInstruction' => ['sometimes', 'string'],
            'history' => ['sometimes', 'array'],
        ]);

        $apiKey = env('GEMINI_API_KEY') ?: null;

        if (!$apiKey) {
            // No key configured; return a safe simulated response so frontend remains functional in dev.
            Log::warning('AI proxy called but GEMINI_API_KEY is not configured.');
            $prompt = $data['prompt'] ?? '';
            $reply = "(Simulated) Thanks for your message. We received: " . substr($prompt, 0, 400);

            return response()->json(["text" => $reply]);
        }

        // Example of calling a real GenAI endpoint would go here. For now, attempt a minimal request
        // to Google's generative language API. You must ensure the request shape matches the API.
        try {
            $endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5:generateText';
            $payload = [
                'prompt' => ['text' => ($data['systemInstruction'] ?? '') . "\n" . ($data['prompt'] ?? '')],
                'temperature' => 0.3,
                'maxOutputTokens' => 512,
            ];

            $resp = HttpClient::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post($endpoint, $payload);

            if (!$resp->ok()) {
                Log::error('GenAI request failed', ['status' => $resp->status(), 'body' => $resp->body()]);
                return response()->json(['text' => 'AI service error'], 502);
            }

            $body = $resp->json();
            // Extract best-effort text from response shape
            $text = null;
            if (isset($body['candidates']) && is_array($body['candidates']) && isset($body['candidates'][0]['content'])) {
                $text = $body['candidates'][0]['content'];
            } elseif (isset($body['output']) && isset($body['output'][0]['content'])) {
                $text = $body['output'][0]['content'];
            }

            return response()->json(['text' => $text ?? '']);
        } catch (\Exception $e) {
            Log::error('AI proxy error: ' . $e->getMessage());
            return response()->json(['text' => 'AI service error'], 502);
        }
    }
}
