"use server";

import { recommendTool } from '@/ai/flows/tool-recommendation-wizard';

export async function getToolRecommendation(taskDescription: string) {
  try {
    if (!taskDescription) {
        return { success: false, error: 'Task description cannot be empty.' };
    }
    const recommendation = await recommendTool({ taskDescription });
    return { success: true, data: recommendation };
  } catch (error) {
    console.error("Error in getToolRecommendation action:", error);
    return { success: false, error: 'An unexpected error occurred. Please try again later.' };
  }
}
