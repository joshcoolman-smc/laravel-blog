<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    private $baseSystemPrompt = 'You are a professional blog writer who creates engaging, well-structured content. Your articles should be comprehensive and detailed, typically taking 3-5 minutes to read (approximately 750-1250 words). Format your response in proper HTML using appropriate heading tags (h1, h2), paragraphs, and lists where relevant. Include engaging introductions, detailed body sections with examples or evidence, and clear conclusions. Maintain a natural, conversational tone while ensuring depth and value in the content.';

    private $modificationPrompt = 'You are a professional blog editor who enhances and expands existing content. When modifying text, maintain its core message and structure while:
1. Expanding sections that need more detail
2. Adding relevant examples or evidence
3. Ensuring the content is comprehensive (3-5 minute read, approximately 750-1250 words)
4. Improving flow and readability
5. Maintaining proper HTML formatting with appropriate heading tags, paragraphs, and lists

Your goal is to enhance the content while preserving its original voice and key points.';

    private $structuredOutputPrompt = 'Provide your response in JSON format with the following structure:
{
    "title": "An attention-grabbing, SEO-friendly title (50-60 characters)",
    "description": "A compelling meta description summarizing the content (150-160 characters)",
    "content": "The main article content in HTML format"
}';

    public function generate(Request $request)
    {
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
        $currentText = $request->input('currentText');
        $generateTitle = $request->input('generateTitle', false);
        $generateDescription = $request->input('generateDescription', false);
        
        if (empty($prompt)) {
            Log::warning('Empty prompt received');
            return response()->json(['error' => 'Prompt is required'], 400);
        }
        
        try {
            Log::info('Sending request to OpenAI', [
                'hasCurrentText' => !empty($currentText),
                'generateTitle' => $generateTitle,
                'generateDescription' => $generateDescription
            ]);

            $messages = [
                [
                    'role' => 'system',
                    'content' => $this->baseSystemPrompt
                ]
            ];

            // Add structured output prompt if generating title or description
            if ($generateTitle || $generateDescription) {
                $messages[] = [
                    'role' => 'system',
                    'content' => $this->structuredOutputPrompt
                ];
            }

            if (!empty($currentText)) {
                $messages[] = [
                    'role' => 'system',
                    'content' => $this->modificationPrompt
                ];
                $messages[] = [
                    'role' => 'user',
                    'content' => "Here is the current text:\n\n" . $currentText . "\n\nModify this text according to these instructions:\n\n" . $prompt
                ];
            } else {
                $messages[] = [
                    'role' => 'user',
                    'content' => "Write a detailed article about the following topic. Remember to aim for a 3-5 minute read length:\n\n" . $prompt
                ];
            }
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $openaiKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-3.5-turbo',
                'messages' => $messages,
                'temperature' => 0.7,
                'max_tokens' => 2500,
                'response_format' => ($generateTitle || $generateDescription) ? ['type' => 'json_object'] : null
            ]);

            if ($response->failed()) {
                Log::error('OpenAI request failed', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new \Exception('Failed to generate content: ' . $response->body());
            }

            $responseContent = $response->json()['choices'][0]['message']['content'];
            
            // Parse JSON response if structured output was requested
            if ($generateTitle || $generateDescription) {
                $parsedResponse = json_decode($responseContent, true);
                return response()->json([
                    'content' => $parsedResponse['content'],
                    'title' => $generateTitle ? $parsedResponse['title'] : null,
                    'description' => $generateDescription ? $parsedResponse['description'] : null
                ]);
            }

            return response()->json(['content' => $responseContent]);
            
        } catch (\Exception $e) {
            Log::error('Error in AI generation', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
