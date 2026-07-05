// lib/vision/analyzeImage.ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function analyzeImage(url: string): Promise<string[]> {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Liste uniquement les objets visibles dans cette image. Réponds par une liste simple de mots."
            },
            {
              type: "image_url",
              image_url: {
                url: url
              }
            }
          ]
        }
      ],
      max_tokens: 200,
    });

    const text = response.choices[0].message.content || "";

    const tags = text
      .split(/[,.\n]/)
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 1);

    return tags;
  } catch (err) {
    console.error("Vision error:", err);
    return [];
  }
}
