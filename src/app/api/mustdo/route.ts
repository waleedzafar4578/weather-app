import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export async function POST(req: NextRequest) {
  console.log('Now inside the function');
  
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or any other model you prefer
      messages: [
        { role: "system", content: "You are a weather assistant that provides specific precautions based on weather data. You must respond ONLY with a valid JSON object in the exact format specified, with no additional text, explanations, or formatting. Do not include any markdown, code blocks, or other formatting."   },
        { role: "user", content: prompt }
      ],
    });

    return NextResponse.json({ answer: response.choices[0].message.content });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return NextResponse.json({ error: 'Failed to get response from OpenAI' }, { status: 500 });
  }
}
