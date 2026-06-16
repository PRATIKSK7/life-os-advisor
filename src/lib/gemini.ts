import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateRecommendation(context: any, userQuery: string) {
  console.log("--- GEMINI DIAGNOSTICS ---");
  console.log("1. Gemini Key Exists:", !!process.env.GEMINI_API_KEY);
  
  if (!process.env.GEMINI_API_KEY) {
    const errorMsg = "Error: GEMINI_API_KEY is missing in your environment variables. Please add it to your .env.local file.";
    console.error(errorMsg);
    return errorMsg;
  }

  const prompt = `You are LifeOS, a highly intelligent Strategic Mentor and AI Chief of Staff for a computer science engineering student named Pratik S K.

Your goal is to optimize Pratik's time, protect his deep work blocks, and ensure he hits his long-term goals.

AI BEHAVIOR RULES:
You MUST prioritize his work in the following strict order:
1. Placements & Interviews
2. Internships
3. High-impact projects
4. Academics
5. Fitness

Discourage low-value tasks. Recommend the highest-impact task based on deadlines, placement preparation, project progress, and academic workload.

CONTEXT:
Current Time: ${context.time}
Upcoming Meetings: ${JSON.stringify(context.meetings, null, 2)}
Gym Sessions: ${JSON.stringify(context.gym, null, 2)}
Active Goals: ${JSON.stringify(context.goals, null, 2)}
Pending Tasks: ${JSON.stringify(context.tasks, null, 2)}
Available Free Time Blocks: ${JSON.stringify(context.freeTime, null, 2)}
Decision Engine Suggestion: ${JSON.stringify(context.recommendation, null, 2)}

USER QUERY:
"${userQuery}"

INSTRUCTIONS & RULES:
1. DO NOT generate paragraphs.
2. DO NOT exceed 8 bullet points total.
3. DO NOT write more than 2 lines per section.
4. Use short sentences and executive style summaries.
5. Maximum response length: 120 words.
6. You MUST format your response EXACTLY as follows:

🎯 Recommended Action
[Task Name or specific strategic action]

⭐ Priority Score
[0-100]/100

⏱ Time Required
[XX mins/hours]

🎯 Goal Supported
[Goal Name or N/A]

📈 Expected Impact
* [Bullet point 1]
* [Bullet point 2]

💡 Why This Matters
* [Bullet point 1]
* [Bullet point 2]

➡ Next Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]`;

  async function getBestModel(): Promise<string> {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.models) {
        console.error("Failed to list models:", data);
        return "gemini-1.5-flash"; // hard fallback
      }

      const availableModels = data.models
        .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
        .map((m: any) => m.name.replace('models/', ''));

      console.log("--- Available Gemini Models ---");
      console.log(availableModels.join(', '));

      const preferredOrder = [
        'gemini-2.5-flash',
        'gemini-2.5-pro',
        'gemini-2.0-flash',
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-pro'
      ];

      for (const pref of preferredOrder) {
        if (availableModels.includes(pref)) {
          return pref;
        }
      }

      // If none match, return the first available
      return availableModels[0] || 'gemini-1.5-flash';

    } catch (e) {
      console.error("Error fetching models:", e);
      return "gemini-1.5-flash";
    }
  }

  const tryGenerate = async (modelName: string) => {
    console.log("Using Gemini Model:", modelName);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    return await result.response;
  };

  try {
    const bestModelName = await getBestModel();
    const response = await tryGenerate(bestModelName);
    console.log(`4. Response received successfully from ${bestModelName}.`);
    return response.text();
  } catch (error: any) {
    console.error(`Gemini Error Details:`, error?.message || error);
    
    // Attempt absolute hard fallback just in case
    console.log("Attempting final fallback to default gemini-1.5-flash...");
    try {
      const fallbackResponse = await tryGenerate("gemini-1.5-flash");
      return fallbackResponse.text();
    } catch (fallbackError) {
      console.error("Gemini Fallback Error Details:", fallbackError);
      throw fallbackError;
    }
  }
}
