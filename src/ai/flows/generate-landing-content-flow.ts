'use server';
/**
 * @fileOverview An AI flow to generate dynamic content for the landing page.
 *
 * - generateLandingContent - A function that returns hero content and AI news.
 * - GenerateLandingContentInput - The input type for the function.
 * - GenerateLandingContentOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Locale } from '@/lib/types';

const GenerateLandingContentInputSchema = z.object({
  language: z.enum(['en', 'es']).describe('The language for the generated content.'),
});
export type GenerateLandingContentInput = z.infer<typeof GenerateLandingContentInputSchema>;

const GenerateLandingContentOutputSchema = z.object({
  hero: z.object({
    title: z.string().describe("A catchy, professional hero title for a tech solutions company named 'Tecnosalud'."),
    description: z.string().describe("A concise and compelling hero description for 'Tecnosalud'."),
  }),
  news: z.array(z.object({
    title: z.string().describe("The headline of a recent AI news story."),
    summary: z.string().describe("A brief summary of the AI news story."),
    imageHint: z.string().describe("One or two keywords for a relevant stock photo (e.g., 'AI robot')."),
  })).length(5).describe('A list of 5 recent and important news items about Artificial Intelligence breakthroughs.'),
});
export type GenerateLandingContentOutput = z.infer<typeof GenerateLandingContentOutputSchema>;

export async function generateLandingContent(language: Locale): Promise<GenerateLandingContentOutput> {
  return generateLandingContentFlow({ language });
}

const prompt = ai.definePrompt({
  name: 'generateLandingContentPrompt',
  input: { schema: GenerateLandingContentInputSchema },
  output: { schema: GenerateLandingContentOutputSchema },
  prompt: `You are a marketing expert and content creator for 'Tecnosalud', a leading tech solutions company.
Your task is to generate compelling landing page content in the specified language: {{{language}}}.

The content should be professional, innovative, and engaging.

Instructions:
1.  Create a powerful and inspiring hero title and description. The tone should be modern and reflect the 'Aurora' brand style (dynamic, premium, innovative).
2.  Provide a list of 5 recent, real, and significant news or breakthroughs in the world of Artificial Intelligence. For each news item, provide a title, a short summary, and a one or two-word hint for a relevant image.
`,
});

const generateLandingContentFlow = ai.defineFlow(
  {
    name: 'generateLandingContentFlow',
    inputSchema: GenerateLandingContentInputSchema,
    outputSchema: GenerateLandingContentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
