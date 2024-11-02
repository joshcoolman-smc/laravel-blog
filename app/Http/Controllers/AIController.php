<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    public function generate(Request $request)
    {
        Log::info('AI generate endpoint hit', [
            'request' => $request->all()
        ]);

        // Check if AI writer is enabled
        if (!config('services.ai.enabled')) {
            Log::warning('AI Writer is not enabled');
            return response()->json(['error' => 'AI Writer is not enabled'], 400);
        }

        $openaiKey = config('services.openai.key');
        if (empty($openaiKey)) {
            Log::warning('OpenAI API key is not configured');
            return response()->json(['error' => 'OpenAI API key is not configured'], 400);
        }

        $prompt = $request->input('prompt');
        if (empty($prompt)) {
            Log::warning('Empty prompt received');
            return response()->json(['error' => 'Prompt is required'], 400);
        }
        
        try {
            Log::info('Sending request to OpenAI', [
                'prompt' => $prompt
            ]);
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $openaiKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a helpful blog post writer. Format your response in proper HTML that can be directly inserted into a blog post editor. Use appropriate heading tags, paragraphs, and lists where relevant. Keep the formatting simple and clean.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'temperature' => 0.7,
            ]);

            if ($response->failed()) {
                Log::error('OpenAI request failed', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new \Exception('Failed to generate content: ' . $response->body());
            }

            $content = $response->json()['choices'][0]['message']['content'];
            Log::info('Successfully generated content');
            
            return response()->json(['content' => $content]);
            
        } catch (\Exception $e) {
            Log::error('Error in AI generation', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
