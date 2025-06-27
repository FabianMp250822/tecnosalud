import { ToolRecommendationClient } from '@/components/tool-recommendation-client';

export default function ToolRecommendationPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-headline text-2xl md:text-3xl font-bold">Tool Recommendation Wizard</h1>
        <p className="text-muted-foreground">
          Describe the task you want to accomplish, and our AI will recommend the best tool for the job.
        </p>
      </div>
      <ToolRecommendationClient />
    </div>
  );
}
