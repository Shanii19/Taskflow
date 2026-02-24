import Groq from 'groq-sdk';

export interface AITaskSuggestion {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
}

/**
 * Given a natural-language prompt, asks Groq to generate a structured
 * task title, description, and priority level.
 */
export async function generateTaskWithAI(prompt: string): Promise<AITaskSuggestion> {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
        throw new Error('Groq API Key (VITE_GROQ_API_KEY) is not set.');
    }

    const groq = new Groq({
        apiKey,
        dangerouslyAllowBrowser: true,
    });

    const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
            {
                role: 'system',
                content: `You are a helpful project management assistant. 
Given a brief description of a task, generate a clear task title, a concise description, and an appropriate priority level.
Respond ONLY with a valid JSON object in this exact format (no markdown, no backticks):
{
  "title": "Short, action-oriented task title",
  "description": "Clear, one or two sentence description of what needs to be done and why.",
  "priority": "low" | "medium" | "high"
}`,
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        temperature: 0.4,
        max_tokens: 256,
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? '';

    try {
        const parsed = JSON.parse(raw) as AITaskSuggestion;
        if (!parsed.title || !parsed.description || !parsed.priority) {
            throw new Error('Incomplete AI response');
        }
        return parsed;
    } catch {
        // Fallback: if parse fails, extract what we can
        return {
            title: prompt.slice(0, 80),
            description: 'Generated from AI prompt.',
            priority: 'medium',
        };
    }
}
