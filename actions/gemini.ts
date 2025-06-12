import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY environment variable is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


interface Message {
  text: string;
  isBot: boolean;
  options?: string[];
  isMarkdown?: boolean;
}

export const generateGeminiResponse = async (
  prompt: string,
  history: Message[],
  emotion: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pred: { type: string }
) => {
  const template = `You are an empathetic mental health assistant, here to provide support and guidance.

Current Context:
- User's Current Emotion: ${emotion}
- User's Latest Message: ${prompt}
- Chat History: ${JSON.stringify(history)}

Instructions:
1. Respond with empathy and understanding
2. Use natural, conversational language
3. Format response in Markdown for better readability
4. Feel free to ask follow-up questions when appropriate
5. Focus on providing emotional support and practical mental health strategies
6. Always maintain a supportive and positive tone
7. If you detect signs of serious distress, recommend professional help

Please provide a supportive response that helps guide the user toward better mental well-being.`

    

  try {
    const result = await model.generateContent(template);
    const response = result.response.text();
    console.log('Gemini Response:', response);
    return response;
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to generate response. Please try again later.');
  }

}

