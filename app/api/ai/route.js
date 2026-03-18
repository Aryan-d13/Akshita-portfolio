import { NextResponse } from "next/server";

/**
 * POST /api/ai
 * Server-side proxy to the Gemini API.
 * Expects: { messages: [{ role: "user"|"model", text: "..." }], context?: string }
 * Returns: { text: string }
 */
export async function POST(request) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "GEMINI_API_KEY not configured" },
            { status: 500 }
        );
    }

    const { messages, context } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return NextResponse.json(
            { error: "messages array is required" },
            { status: 400 }
        );
    }

    // Build the system instruction
    const systemInstruction = `You are a helpful writing assistant for a personal blog.
You help the author write, refine, and structure blog posts.

Guidelines:
- Write in a warm, personal, authentic tone — not corporate or generic.
- Output well-structured HTML using tags: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>.
- Do NOT use <h1> tags (the post title is separate).
- When asked to write a full post, include a compelling introduction, structured body sections, and a thoughtful conclusion.
- When asked to refine or edit, make targeted improvements while preserving the author's voice.
- Keep paragraphs concise and scannable.
- If the author asks for ideas, provide 3-5 options formatted as a numbered list.
${context ? `\nCurrent post context:\nTitle: ${context.title || "(no title yet)"}\nTags: ${context.tags || "(no tags)"}\nExisting body:\n${context.body || "(empty)"}` : ""}`;

    // Build Gemini API request body
    const contents = messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
    }));

    const geminiBody = {
        system_instruction: {
            parts: [{ text: systemInstruction }],
        },
        contents,
        generationConfig: {
            temperature: 0.8,
            topP: 0.95,
            maxOutputTokens: 8192,
        },
    };

    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(geminiBody),
            }
        );

        if (!res.ok) {
            const errText = await res.text();
            console.error("Gemini API error:", res.status, errText);
            return NextResponse.json(
                { error: `Gemini API error: ${res.status}` },
                { status: 502 }
            );
        }

        const data = await res.json();
        const text =
            data?.candidates?.[0]?.content?.parts
                ?.map((p) => p.text)
                .join("") || "";

        return NextResponse.json({ text });
    } catch (err) {
        console.error("Gemini proxy error:", err);
        return NextResponse.json(
            { error: "Failed to reach Gemini API" },
            { status: 502 }
        );
    }
}
