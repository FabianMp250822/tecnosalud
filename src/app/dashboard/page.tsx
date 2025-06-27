import { BrainCircuit, Quote } from 'lucide-react';
import { ToolCard } from '@/components/tool-card';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl md:text-3xl font-bold">Dashboard</h1>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Welcome, Pro User!</CardTitle>
          <CardDescription>Your subscription is active. Explore your available tools below.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ToolCard
          title="Tool Recommendation Wizard"
          description="Not sure where to start? Describe your task and let AI find the best tool for you."
          href="/dashboard/tool-recommendation"
          icon={<BrainCircuit className="h-8 w-8 text-primary" />}
        />
        <ToolCard
          title="Content Summarizer"
          description="Save time by generating concise summaries of long articles or documents."
          href="/dashboard/content-summarization"
          icon={<Quote className="h-8 w-8 text-primary" />}
          isLocked={true}
        />
      </div>
    </>
  );
}
