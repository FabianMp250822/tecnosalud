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
import { storage } from '@/lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

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
    imageUrl: z.string().optional().describe("The URL of a relevant, AI-generated image for the blog post, hosted on Firebase Storage. This is optional."),
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

// Define a schema specifically for the text generation part, omitting the imageUrl.
const TextNewsItemSchema = NewsItemSchema.omit({ imageUrl: true });
const GenerateLandingContentTextOutputSchema = z.object({
  hero: GenerateLandingContentOutputSchema.shape.hero,
  news: z.array(TextNewsItemSchema).length(3),
});

const generateTextPrompt = ai.definePrompt({
  name: 'generateLandingContentTextPrompt',
  input: { schema: GenerateLandingContentInputSchema },
  output: { schema: GenerateLandingContentTextOutputSchema },
  prompt: `You are a marketing expert and content creator for 'Tecnosalud', a leading tech solutions company.
Your task is to generate compelling landing page content and 3 blog posts about AI news in the specified language: {{{language}}}.

The content must be professional, innovative, and engaging. Your output MUST be a valid JSON object that adheres to the provided schema.

Instructions:
1.  Create a powerful and inspiring hero title and description for the landing page. The tone should be modern, dynamic, premium, and innovative.
2.  Provide a list of 3 recent, real, and significant news or breakthroughs in the world of Artificial Intelligence. For each news item, you must provide:
    - A catchy, SEO-friendly title.
    - A URL-friendly slug from the title (e.g., 'new-ai-model-released').
    - A short summary (2-3 sentences) for a preview card.
    - A full, detailed blog post (4-6 paragraphs) explaining the news. It should be well-structured, informative, and engaging for a tech-savvy but broad audience.
    - A one or two-word hint for a relevant image.
`,
});

const generateLandingContentFlow = ai.defineFlow(
  {
    name: 'generateLandingContentFlow',
    inputSchema: GenerateLandingContentInputSchema,
    outputSchema: GenerateLandingContentOutputSchema,
  },
  async (input) => {
    // 1. Generate all the text content first
    const { output: textOutput } = await generateTextPrompt(input);

    if (!textOutput || !textOutput.news) {
        throw new Error("Failed to generate text content.");
    }
    
    // 2. Generate an image for each news item in parallel
    const newsWithImages = await Promise.all(
        (textOutput.news || []).map(async (newsItem) => {
            if (!newsItem?.imageHint || !newsItem.slug) {
                return newsItem; // Proceed without image
            }

            try {
                // Generate image
                const { media } = await ai.generate({
                    model: 'googleai/gemini-2.0-flash-preview-image-generation',
                    prompt: `A visually stunning, high-quality, photorealistic image for a tech blog post about: ${newsItem.imageHint}. Style: cinematic, futuristic, blue and purple tones.`,
                    config: { responseModalities: ['TEXT', 'IMAGE'] },
                });

                if (!media.url) throw new Error('Image generation failed to return a data URL.');

                // Upload to Firebase Storage
                const imageRef = ref(storage, `article-images/${newsItem.slug}-${Date.now()}.png`);
                await uploadString(imageRef, media.url, 'data_url');
                const downloadURL = await getDownloadURL(imageRef);

                return { ...newsItem, imageUrl: downloadURL };
            } catch (error) {
                console.error(`Failed to generate or upload image for slug "${newsItem.slug}". Proceeding without image. Error:`, error);
                // On failure, return the item without an imageUrl
                return newsItem;
            }
        })
    );
    
    // 3. Assemble the final output, ensuring it matches the schema
    const finalOutput = {
        hero: textOutput.hero,
        news: newsWithImages,
    };
    
    // Validate with Zod before returning. This will throw if the structure is wrong.
    return GenerateLandingContentOutputSchema.parse(finalOutput);
  }
);
