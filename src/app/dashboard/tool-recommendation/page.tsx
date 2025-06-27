import { ToolRecommendationClient } from '@/components/tool-recommendation-client';

export default function TextImproverPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl md:text-3xl font-bold">Mejora de Texto con IA</h1>
      </div>
      <p className="text-muted-foreground">
        Utiliza inteligencia artificial para refinar y mejorar tus textos, haciéndolos más claros, concisos y profesionales.
      </p>
      <ToolRecommendationClient />
    </>
  );
}
