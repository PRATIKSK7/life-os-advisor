import { NextResponse } from 'next/server';
import { generateRecommendation } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    console.log("API Route Hit: /api/advisor");
    console.log("Gemini Key Exists:", !!process.env.GEMINI_API_KEY);

    const body = await req.json();
    const { userQuery, ...context } = body;
    const recommendationText = await generateRecommendation(context, userQuery);
    
    return NextResponse.json({ recommendation: recommendationText });
  } catch (error) {
    console.error("ADVISOR ROUTE ERROR:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
