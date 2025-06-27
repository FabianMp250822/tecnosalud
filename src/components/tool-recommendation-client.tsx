"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BrainCircuit, Lightbulb, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

import type { RecommendToolOutput } from '@/ai/flows/tool-recommendation-wizard';
import { getToolRecommendation } from './tool-recommendation-actions';


const formSchema = z.object({
  taskDescription: z.string().min(20, {
    message: "Please describe your task in at least 20 characters.",
  }).max(500, {
    message: "Description must not be longer than 500 characters."
  }),
});

type FormData = z.infer<typeof formSchema>;

export function ToolRecommendationClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendToolOutput | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskDescription: "",
    },
  });

  async function onSubmit(values: FormData) {
    setLoading(true);
    setError(null);
    setRecommendation(null);
    
    const result = await getToolRecommendation(values.taskDescription);

    if (result.success) {
      setRecommendation(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Describe Your Task</CardTitle>
          <CardDescription>
            The more detailed your description, the better the recommendation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="taskDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I need to create a short, engaging summary of a long research paper.'"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Get Recommendation
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="flex flex-col gap-4">
        {loading && (
          <Card className="flex flex-col items-center justify-center p-8 flex-1">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="font-semibold">AI is thinking...</p>
            <p className="text-sm text-muted-foreground">Please wait a moment.</p>
          </Card>
        )}
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {recommendation && (
            <Card className="flex-1 animate-in fade-in">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Lightbulb className="text-accent" />
                        AI Recommendation
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-lg">{recommendation.toolName}</h3>
                        <p className="text-muted-foreground">{recommendation.toolDescription}</p>
                    </div>
                    <Separator />
                    <div>
                        <h4 className="font-semibold">Justification</h4>
                        <p className="text-sm text-muted-foreground">{recommendation.justification}</p>
                    </div>
                </CardContent>
            </Card>
        )}
         {!loading && !recommendation && (
            <Card className="flex flex-col items-center justify-center p-8 flex-1 border-dashed">
                <BrainCircuit className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="font-semibold text-muted-foreground">Your recommendation will appear here.</p>
            </Card>
         )}
      </div>
    </div>
  );
}
