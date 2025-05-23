import OpenAI from 'openai';
import { stringify } from 'querystring';
import { NextResponse,NextRequest } from 'next/server';
export async function POST(req: Request,res:Response) {
    try {
        const body = await req.json();
        const { newPrompt } = body;

        const openai = new OpenAI({
            apiKey: "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", // Always use environment variables for API keys
        });

        const completion = await openai.chat.completions.create({
            model: 'o3-mini-2025-01-31', // Ensure this is the correct model name
            messages: [{ role: 'system', content: newPrompt }],
        });
        return new Response(JSON.stringify(completion.choices[0]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error processing request:', error);
        // Improved error handling to capture API-specific errors
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorResponse = error instanceof Error && 'response' in error ? await (error as any).response.text() : '';
        console.error('API error response:', errorResponse);

        return new Response(JSON.stringify({ error: errorMessage, errorResponse }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}