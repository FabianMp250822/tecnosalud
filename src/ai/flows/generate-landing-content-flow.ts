'use server';
/**
 * @fileOverview An AI flow to generate and cache dynamic content for the landing page and blog.
 *
 * - generateLandingContent - A function that returns hero content and AI news, caching it daily.
 * - GenerateLandingContentInput - The input type for the function.
 * - GenerateLandingContentOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Locale } from '@/lib/types';
import { getTodaysContent, saveDailyContent } from '@/services/content-service';

const GenerateLandingContentInputSchema = z.object({
  language: z.enum(['en', 'es']).describe('The language for the generated content.'),
});
export type GenerateLandingContentInput = z.infer<typeof GenerateLandingContentInputSchema>;

const NewsItemSchema = z.object({
    title: z.string().describe("The headline of a recent AI news story."),
    slug: z.string().describe("A URL-friendly slug for the blog post title, in lowercase, with words separated by hyphens."),
    summary: z.string().describe("A brief summary of the AI news story (2-3 sentences), suitable for a card view."),
    details: z.string().describe("A detailed blog post about the news story (4-6 paragraphs). Write in a journalistic but accessible style."),
    imageHint: z.string().describe("One or two keywords for a relevant stock photo (e.g., 'AI robot')."),
});

const GenerateLandingContentOutputSchema = z.object({
  hero: z.object({
    title: z.string().describe("A catchy, professional hero title for a tech solutions company named 'Tecnosalud'."),
    description: z.string().describe("A concise and compelling hero description for 'Tecnosalud'."),
  }),
  news: z.array(NewsItemSchema).length(3).describe('A list of 3 recent and important news items about Artificial Intelligence breakthroughs, formatted as blog posts.'),
});
export type GenerateLandingContentOutput = z.infer<typeof GenerateLandingContentOutputSchema>;


export async function generateLandingContent(language: Locale): Promise<GenerateLandingContentOutput> {
  const cachedContent = await getTodaysContent(language);
  if (cachedContent) {
    console.log(`[${language}] Returning cached content for today.`);
    return cachedContent;
  }

  console.log(`[${language}] No cache found. Generating new content...`);
  const newContent = await generateLandingContentFlow({ language });

  if (newContent) {
    await saveDailyContent(newContent, language);
    console.log(`[${language}] New content generated and saved to cache.`);
    return newContent;
  }

  throw new Error("Failed to generate or retrieve landing page content.");
}

const prompt = ai.definePrompt({
  name: 'generateLandingContentPrompt',
  input: { schema: GenerateLandingContentInputSchema },
  output: { schema: GenerateLandingContentOutputSchema },
  prompt: `You are a marketing expert and content creator for 'Tecnosalud', a leading tech solutions company.
Your task is to generate compelling landing page content and 3 blog posts about AI news in the specified language: {{{language}}}.

The content should be professional, innovative, and engaging.

Instructions:
1.  Create a powerful and inspiring hero title and description for the landing page. The tone should be modern and reflect the 'Aurora' brand style (dynamic, premium, innovative).
2.  Provide a list of 3 recent, real, and significant news or breakthroughs in the world of Artificial Intelligence. For each news item:
    - Write a catchy, SEO-friendly title.
    - Create a URL-friendly slug from the title (e.g., 'new-ai-model-released').
    - Write a short summary (2-3 sentences) for a preview card.
    - Write a full, detailed blog post (4-6 paragraphs) explaining the news. It should be well-structured, informative, and engaging for a tech-savvy but broad audience.
    - Provide a one or two-word hint for a relevant image.
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
