'use client';

import { useState } from 'react';
import { improveText, ImproveTextInput } from '@/ai/flows/improve-text-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Wand2 } from 'lucide-react';

export function ToolRecommendationClient() {
  const [inputText, setInputText] = useState('');
  const [improvedText, setImprovedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor, introduce un texto para mejorar.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setImprovedText('');

    try {
      const input: ImproveTextInput = { text: inputText };
      const result = await improveText(input);
      setImprovedText(result.improvedText);
    } catch (error) {
      console.error('Error improving text:', error);
      toast({
        title: 'Error',
        description: 'No se pudo mejorar el texto. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Texto Original</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full gap-2">
                <Label htmlFor="original-text" className="sr-only">Texto Original</Label>
                <Textarea
                  id="original-text"
                  placeholder="Escribe o pega tu texto aquí..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={10}
                  className="resize-none"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Texto Mejorado</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : (
                <div className="w-full min-h-[200px] p-3 rounded-md bg-muted/50 whitespace-pre-wrap">
                  {improvedText || <span className="text-muted-foreground">La versión mejorada de tu texto aparecerá aquí.</span>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="mt-6 flex justify-center">
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? 'Mejorando...' : <> <Wand2 className="mr-2 h-5 w-5" /> Mejorar Texto </>}
          </Button>
        </div>
      </form>
    </div>
  );
}
