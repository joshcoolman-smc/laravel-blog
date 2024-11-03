<?php

return [
    'openai' => [
        'key' => env('OPENAI_API_KEY'),
    ],

    'ai' => [
        'enabled' => env('AI_WRITER', false),
    ],
];
