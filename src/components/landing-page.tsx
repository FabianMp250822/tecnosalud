
"use client";

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { ArrowRight, ChevronRight, Code, Cpu, Database, Server, ShieldCheck, Users, CloudCog, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { LanguageSwitcher } from '@/components/language-switcher';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from '@/components/ui/skeleton';
import { generateLandingContent, GenerateLandingContentOutput } from '@/ai/flows/generate-landing-content-flow';
import type { Locale } from '@/lib/types';

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const serviceIcons: { [key: string]: React.ElementType } = {
  consulting: Cpu,
  development: Code,
  bi: Database,
  cybersecurity: ShieldCheck,
  data_analysis: Database,
  it_services: Server,
  cloud_migration: CloudCog,
  maintenance: Wrench,
  support: Users,
};

const clientLogos = [
  { name: 'Client 1', logo: 'https://placehold.co/160x80.png', hint: 'tech logo' },
  { name: 'Client 2', logo: 'https://placehold.co/160x80.png', hint: 'company brand' },
  { name: 'Client 3', logo: 'https://placehold.co/160x80.png', hint: 'tech logo' },
  { name: 'Client 4', logo: 'https://placehold.co/160x80.png', hint: 'company brand' },
  { name: 'Client 5', logo: 'https://placehold.co/160x80.png', hint: 'tech logo' },
  { name: 'Client 6', logo: 'https://placehold.co/160x80.png', hint: 'company brand' },
  { name: 'Client 7', logo: 'https://placehold.co/160x80.png', hint: 'tech logo' },
  { name: 'Client 8', logo: 'https://placehold.co/160x80.png', hint: 'company brand' },
];


export function LandingPage() {
  const { t, language } = useLanguage();
  const [dynamicContent, setDynamicContent] = useState<GenerateLandingContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const content = await generateLandingContent(language as Locale);
        setDynamicContent(content);
      } catch (error) {
        console.error("Failed to fetch dynamic content:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [language]);


  const services = Object.entries((t.services as any).items).map(([key, value]: [string, any]) => ({
    key,
    ...value,
    Icon: serviceIcons[key] || Server,
  }));
  

  return (
    <div className="flex-1 flex flex-col bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Logo />
            <nav className="hidden md:flex md:items-center md:gap-8 text-sm font-medium">
              <button onClick={() => scrollTo('services')} className="text-foreground/80 hover:text-primary transition-colors">{(t.nav as any).services}</button>
              <Link href="/blog" className="text-foreground/80 hover:text-primary transition-colors">{(t.nav as any).blog}</Link>
              <button onClick={() => scrollTo('about')} className="text-foreground/80 hover:text-primary transition-colors">{(t.nav as any).about}</button>
              <button onClick={() => scrollTo('contact')} className="text-foreground/80 hover:text-primary transition-colors">{(t.nav as any).contact}</button>
            </nav>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Button variant="ghost" asChild>
                <Link href="/login">{(t.nav as any).login}</Link>
              </Button>
              <Button asChild className="text-primary-foreground bg-gradient-to-r from-sky-400 to-violet-400 hover:brightness-110 transition-transform hover:scale-105">
                <Link href="/signup">{(t.nav as any).signup} <ArrowRight className="ml-2 h-4 w-4"/></Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section id="hero" className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-violet-950/20 to-background"></div>
           <Image 
            src="https://placehold.co/1920x1080.png"
            alt="Robotic hand touching a digital globe"
            data-ai-hint="robotic hand digital globe"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 opacity-10 z-0"
          />
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-primary font-semibold tracking-wider uppercase">{(t.hero as any).subtitle}</p>
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl lg:text-7xl mt-4 max-w-4xl mx-auto">
              {isLoading ? <Skeleton className="h-20 w-full max-w-4xl mx-auto" /> : dynamicContent?.hero.title || (t.hero as any).title}
            </h1>
            <div className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              {isLoading ? (
                <div className="space-y-2 max-w-2xl mx-auto">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ) : (
                dynamicContent?.hero.description || (t.hero as any).description
              )}
            </div>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" asChild className="text-primary-foreground bg-gradient-to-r from-sky-400 to-violet-400 hover:brightness-110 transition-transform hover:scale-105">
                <Link href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services'); }}>{(t.hero as any).cta} <ArrowRight className="ml-2"/></Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="services" className="py-20 sm:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-primary font-semibold tracking-wider uppercase">{(t.services as any).subtitle}</p>
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl mt-2">{(t.services as any).title}</h2>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Card key={service.key} className="bg-card border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader>
                    <div className="bg-primary/10 text-primary p-3 rounded-md w-max mb-4"><service.Icon className="h-6 w-6" /></div>
                    <CardTitle className="font-headline text-lg">{service.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">{service.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section id="ai-news" className="py-20 sm:py-24 bg-card/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-primary font-semibold tracking-wider uppercase">{(t.ai_news as any).subtitle}</p>
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl mt-2">{(t.ai_news as any).title}</h2>
            </div>
            <div className="mt-16">
              <Carousel
                opts={{ align: "start", loop: true }}
                className="w-full max-w-6xl mx-auto"
              >
                <CarouselContent>
                  {isLoading || !dynamicContent?.news ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-4">
                          <Card className="h-full flex flex-col bg-card/80">
                            <CardHeader className="p-0">
                              <Skeleton className="h-48 w-full rounded-t-lg" />
                            </CardHeader>
                            <CardContent className="flex-grow p-6 space-y-4">
                              <Skeleton className="h-6 w-4/5" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))
                  ) : (
                    dynamicContent.news.map((newsItem, index) => (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-4 h-full">
                           <Link href={`/blog/${newsItem.slug}`} className="block h-full">
                            <Card className="h-full flex flex-col overflow-hidden bg-card border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                              <Image
                                src={`https://placehold.co/600x400.png`}
                                data-ai-hint={newsItem.imageHint}
                                alt={newsItem.title}
                                width={600}
                                height={400}
                                className="w-full h-48 object-cover"
                              />
                              <CardHeader>
                                <CardTitle className="font-headline text-lg line-clamp-2">{newsItem.title}</CardTitle>
                              </CardHeader>
                              <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-4">{newsItem.summary}</p>
                              </CardContent>
                            </Card>
                          </Link>
                        </div>
                      </CarouselItem>
                    ))
                  )}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
            </div>
          </div>
        </section>

        <section id="clients" className="py-20 sm:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-primary font-semibold tracking-wider uppercase">{(t.clients as any).subtitle}</p>
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl mt-2 max-w-2xl mx-auto">{(t.clients as any).title}</h2>
            </div>
            <div className="mt-16">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {clientLogos.map((client, index) => (
                    <CarouselItem key={index} className="basis-1/2 md:basis-1/4 lg:basis-1/6 pl-4">
                      <div className="p-4 flex items-center justify-center">
                        <Image
                          src={client.logo}
                          alt={client.name}
                          width={140}
                          height={70}
                          data-ai-hint={client.hint}
                          className="object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </section>
        
        <section id="about" className="py-20 sm:py-24 bg-card/95">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-primary font-semibold tracking-wider uppercase">{(t.about as any).subtitle}</p>
                <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl mt-2">{(t.about as any).title}</h2>
                <p className="mt-6 text-muted-foreground">{(t.about as any).content}</p>
              </div>
              <div className="relative">
                 <Image 
                    src="https://placehold.co/600x400.png"
                    alt="Team working in a modern office"
                    data-ai-hint="team modern office"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-2xl shadow-primary/10"
                  />
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 sm:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">{(t.commitment as any).title}</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              {(t.commitment as any).description}
            </p>
            <div className="mt-8 flex justify-center">
              <Button size="lg" asChild className="text-primary-foreground bg-gradient-to-r from-sky-400 to-violet-400 hover:brightness-110 transition-transform hover:scale-105">
                <Link href="/signup">{(t.commitment as any).cta} <ChevronRight /></Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <Logo />
              <p className="mt-4 text-sm text-muted-foreground">{(t.footer as any).description}</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{(t.footer as any).services}</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {services.slice(0, 5).map(s => (
                  <li key={s.key}><a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services'); }} className="text-muted-foreground hover:text-primary transition-colors">{s.title}</a></li>
                ))}
              </ul>
            </div>
             <div>
              <h3 className="font-semibold text-foreground">{(t.footer as any).links}</h3>
              <ul className="mt-4 space-y-2 text-sm">
                  <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }} className="text-muted-foreground hover:text-primary transition-colors">{(t.nav as any).about}</a></li>
                  <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">{(t.nav as any).blog}</Link></li>
                  <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }} className="text-muted-foreground hover:text-primary transition-colors">{(t.nav as any).contact}</a></li>
                   <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">{(t.footer as any).privacy}</Link></li>
                  <li><Link href="/cookies-policy" className="text-muted-foreground hover:text-primary transition-colors">{(t.footer as any).cookies}</Link></li>
              </ul>
            </div>
             <div>
              <h3 className="font-semibold text-foreground">{(t.footer as any).contact}</h3>
               <p className="mt-4 text-sm text-muted-foreground">contact@tecnosalud.com</p>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
             <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Tecnosalud. {(t.footer as any).rights}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
