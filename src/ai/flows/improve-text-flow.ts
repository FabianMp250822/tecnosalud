'use server';
/**
 * @fileOverview An AI flow for improving text content.
 *
 * - improveText - A function that takes text and returns an improved version.
 * - ImproveTextInput - The input type for the improveText function.
 * - ImproveTextOutput - The return type for the improveText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ImproveTextInputSchema = z.object({
  text: z.string().describe('The text to be improved.'),
});
export type ImproveTextInput = z.infer<typeof ImproveTextInputSchema>;

const ImproveTextOutputSchema = z.object({
  improvedText: z
    .string()
    .describe('The improved, more engaging, and professional version of the text.'),
});
export type ImproveTextOutput = z.infer<typeof ImproveTextOutputSchema>;


export async function improveText(input: ImproveTextInput): Promise<ImproveTextOutput> {
  return improveTextFlow(input);
}

const improveTextPrompt = ai.definePrompt({
  name: 'improveTextPrompt',
  input: {schema: ImproveTextInputSchema},
  output: {schema: ImproveTextOutputSchema},
  prompt: `You are an expert copywriter and editor. Your task is to refine the provided text to be more engaging, clear, and professional, while strictly preserving the original meaning and intent.

Text to improve:
{{{text}}}
`,
});

const improveTextFlow = ai.defineFlow(
  {
    name: 'improveTextFlow',
    inputSchema: ImproveTextInputSchema,
    outputSchema: ImproveTextOutputSchema,
  },
  async (input) => {
    const {output} = await improveTextPrompt(input);
    return output!;
  }
);
