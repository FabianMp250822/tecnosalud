import { getArticleBySlug } from '@/services/content-service';
import type { Article } from '@/services/content-service';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }
  
  const locale = article.language === 'es' ? es : enUS;
  const dateFormat = article.language === 'es' ? "d 'de' MMMM 'de' yyyy" : "MMMM d, yyyy";

  const publicationDate = article.createdAt?.toDate 
    ? format(article.createdAt.toDate(), dateFormat, { locale }) 
    : (article.language === 'es' ? 'Fecha no disponible' : 'Date not available');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Logo />
            <Button asChild variant="ghost">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {article.language === 'es' ? 'Volver al Blog' : 'Back to Blog'}
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <article>
                <header className="mb-8 text-center">
                    <p className="text-base text-muted-foreground mb-2">{publicationDate}</p>
                    <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{article.title}</h1>
                </header>
                
                <Image
                    src={`https://placehold.co/1200x600.png`}
                    data-ai-hint={article.imageHint}
                    alt={article.title}
                    width={1200}
                    height={600}
                    className="w-full h-auto rounded-lg shadow-lg mb-8"
                />

                <div className="prose dark:prose-invert prose-lg max-w-none mx-auto text-muted-foreground text-lg whitespace-pre-line">
                    {article.details}
                </div>
            </article>
        </div>
      </main>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: 'Artículo no encontrado',
    };
  }

  return {
    title: `${article.title} | Tecnosalud Blog`,
    description: article.summary,
    openGraph: {
      title: `${article.title} | Tecnosalud Blog`,
      description: article.summary,
      type: 'article',
      images: [
        {
          url: `https://placehold.co/1200x600.png`,
          width: 1200,
          height: 600,
          alt: article.title,
        },
      ],
    },
  };
}
