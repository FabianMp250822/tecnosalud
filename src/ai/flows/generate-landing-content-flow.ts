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
    imageUrl: z.string().url().optional().describe("The URL of a relevant, AI-generated image for the blog post, hosted on Firebase Storage. This is optional."),
});

const GenerateLandingContentOutputSchema = z.object({
  hero: z.object({
    title: z.string().describe("A catchy, professional hero title for a tech solutions company named 'Tecnosalud'."),
    description: z.string().describe("A concise and compelling hero description for 'Tecnosalud'."),
    imageHint: z.string().describe("One or two keywords for a relevant, abstract hero background image (e.g., 'digital network')."),
    imageUrl: z.string().url().optional(),
  }),
  about: z.object({
    imageHint: z.string().describe("One or two keywords for an image for the 'About Us' section, representing teamwork and technology (e.g., 'diverse team collaboration')."),
    imageUrl: z.string().url().optional(),
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

// Define a schema specifically for the text generation part, omitting the imageUrls.
const TextNewsItemSchema = NewsItemSchema.omit({ imageUrl: true });
const GenerateLandingContentTextOutputSchema = z.object({
  hero: z.object({
    title: GenerateLandingContentOutputSchema.shape.hero.shape.title,
    description: GenerateLandingContentOutputSchema.shape.hero.shape.description,
    imageHint: GenerateLandingContentOutputSchema.shape.hero.shape.imageHint,
  }),
  about: z.object({
    imageHint: GenerateLandingContentOutputSchema.shape.about.shape.imageHint,
  }),
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
1.  Create a powerful and inspiring hero title and description. Also provide a 1-2 word hint for a visually stunning, abstract background image (e.g., 'digital network').
2.  Provide a 1-2 word hint for an image for the 'About Us' section that represents teamwork and technology (e.g., 'diverse team collaboration').
3.  Provide a list of 3 recent, real, and significant news or breakthroughs in the world of Artificial Intelligence. For each news item, you must provide:
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

    if (!textOutput || !textOutput.news || !textOutput.hero || !textOutput.about) {
        throw new Error("Failed to generate text content.");
    }

    // Helper function for image generation and upload
    const createImage = async (hint: string, name: string, promptText: string, folder: 'site-images' | 'article-images') => {
        if (!hint || !name) return undefined;
        try {
            const { media } = await ai.generate({
                model: 'googleai/gemini-2.0-flash-preview-image-generation',
                prompt: `${promptText}: ${hint}. Style: cinematic, futuristic, high-quality, photorealistic, blue and purple tones.`,
                config: { responseModalities: ['TEXT', 'IMAGE'] },
            });
            if (!media.url) throw new Error('Image generation failed to return a data URL.');
            const imageRef = ref(storage, `${folder}/${name}-${Date.now()}.png`);
            await uploadString(imageRef, media.url, 'data_url');
            return getDownloadURL(imageRef);
        } catch (error) {
            console.error(`Failed to generate or upload image for "${name}". Error:`, error);
            return undefined;
        }
    };
    
    // 2. Generate all images in parallel
    const imagePromises = [
        createImage(textOutput.hero.imageHint, 'hero-background', 'A visually stunning, abstract hero background image for a tech company', 'site-images'),
        createImage(textOutput.about.imageHint, 'about-us-image', 'An image for an "About Us" section of a tech company', 'site-images'),
        ...textOutput.news.map(newsItem => 
            createImage(newsItem.imageHint, newsItem.slug, 'A visually stunning image for a tech blog post about', 'article-images')
        )
    ];

    const [heroImageUrl, aboutImageUrl, ...newsImagesUrls] = await Promise.all(imagePromises);
    
    const newsWithImages = textOutput.news.map((newsItem, index) => ({
        ...newsItem,
        imageUrl: newsImagesUrls[index],
    }));
    
    // 3. Assemble the final output
    const finalOutput = {
        hero: {
            ...textOutput.hero,
            imageUrl: heroImageUrl,
        },
        about: {
            ...textOutput.about,
            imageUrl: aboutImageUrl,
        },
        news: newsWithImages,
    };
    
    // Validate with Zod before returning. This will throw if the structure is wrong.
    return GenerateLandingContentOutputSchema.parse(finalOutput);
  }
);
