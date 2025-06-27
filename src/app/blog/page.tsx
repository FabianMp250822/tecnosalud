'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/hooks/use-language';
import { getAllArticles, Article } from '@/services/content-service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/logo';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const { t, language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const fetchedArticles = await getAllArticles(language);
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, [language]);

  const BlogCard = ({ article }: { article: Article }) => (
    <Link href={`/blog/${article.slug}`} className="block">
      <Card className="h-full flex flex-col overflow-hidden bg-card border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
        <Image
          src={article.imageUrl || `https://placehold.co/600x400.png`}
          alt={article.title}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
        />
        <CardHeader>
          <CardTitle className="font-headline text-xl line-clamp-2">{article.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription className="line-clamp-4">{article.summary}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );

  const BlogCardSkeleton = () => (
     <Card className="h-full flex flex-col bg-card/80">
        <Skeleton className="h-48 w-full rounded-t-lg" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-4/5" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Logo />
            <div className="flex items-center gap-4">
                <Link href="/" className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
                  {language === 'es' ? 'Inicio' : 'Home'}
                </Link>
               <LanguageSwitcher />
               <Button asChild className="text-primary-foreground bg-gradient-to-r from-sky-400 to-violet-400 hover:brightness-110 transition-transform hover:scale-105">
                <Link href="/login">{(t.nav as any).login} <ArrowRight className="ml-2 h-4 w-4"/></Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{language === 'es' ? 'Blog de Tecnosalud' : 'Tecnosalud Blog'}</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              {language === 'es' ? 'Las últimas noticias y avances en el mundo de la tecnología y la inteligencia artificial.' : 'The latest news and breakthroughs in the world of technology and artificial intelligence.'}
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
             {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => <BlogCardSkeleton key={index} />)
            ) : articles.length > 0 ? (
              articles.map((article) => <BlogCard key={article.id} article={article} />)
            ) : (
                <p className="text-muted-foreground col-span-3 text-center">
                    {language === 'es' ? 'No hay artículos disponibles en este momento.' : 'No articles available at the moment.'}
                </p>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
