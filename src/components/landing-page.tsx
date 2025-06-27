"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BrainCircuit, Check, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/logo';

export function LandingPage() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Logo />
            <nav className="hidden md:flex md:items-center md:gap-6 text-sm font-medium">
              <button onClick={() => scrollTo('features')} className="text-foreground/80 hover:text-foreground transition-colors">Features</button>
              <button onClick={() => scrollTo('pricing')} className="text-foreground/80 hover:text-foreground transition-colors">Pricing</button>
              <button onClick={() => scrollTo('testimonials')} className="text-foreground/80 hover:text-foreground transition-colors">Testimonials</button>
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up <ArrowRight /></Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section id="hero" className="py-20 sm:py-28 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary font-medium">
              <BrainCircuit className="mr-2 h-4 w-4" />
              Now powered by GenAI
            </Badge>
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Unlock the Power of AI
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80">
              IntelliSuite provides a curated collection of AI-powered tools to streamline your workflow, boost creativity, and solve complex problems.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started for Free <ArrowRight /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features" onClick={(e) => { e.preventDefault(); scrollTo('features'); }}>Explore Tools</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 sm:py-24 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Everything You Need, All in One Place</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
                From content creation to data analysis, our suite of AI tools is designed for efficiency and power.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="bg-primary/10 text-primary p-3 rounded-md w-max mb-4"><BrainCircuit className="h-6 w-6" /></div>
                  <CardTitle className="font-headline">Tool Recommendation</CardTitle>
                  <CardDescription>Describe your task and our AI will suggest the perfect tool for the job.</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="bg-primary/10 text-primary p-3 rounded-md w-max mb-4"><Quote className="h-6 w-6" /></div>
                  <CardTitle className="font-headline">Content Summarization</CardTitle>
                  <CardDescription>Condense long articles and documents into concise, easy-to-read summaries.</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="bg-primary/10 text-primary p-3 rounded-md w-max mb-4"><Image src="https://placehold.co/24x24.png" width={24} height={24} alt="Image Generation Icon" data-ai-hint="abstract shape" /></div>
                  <CardTitle className="font-headline">Image Generation</CardTitle>
                  <CardDescription>Bring your ideas to life by generating stunning visuals from text prompts.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
        
        <section id="pricing" className="py-20 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Simple, Transparent Pricing</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
                Choose a plan that works for you. No hidden fees.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 justify-center">
              <Card className="lg:col-start-2">
                <CardHeader>
                  <CardTitle className="font-headline">Pro Plan</CardTitle>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight">$10</span>
                    <span className="text-foreground/70">/ month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-foreground/90">
                    <li className="flex items-center gap-2"><Check className="h-5 w-5 text-accent" /> Unlimited access to all tools</li>
                    <li className="flex items-center gap-2"><Check className="h-5 w-5 text-accent" /> Priority support</li>
                    <li className="flex items-center gap-2"><Check className="h-5 w-5 text-accent" /> Early access to new features</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild><Link href="/signup">Get Started</Link></Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 sm:py-24 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Loved by Professionals Worldwide</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
                Don't just take our word for it. Here's what our users are saying.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-primary/50 mb-4" />
                  <p className="text-foreground/90">"IntelliSuite has become an indispensable part of my daily workflow. The content summarizer saves me hours of reading each week."</p>
                </CardContent>
                <CardFooter className="pt-4">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/40x40.png" alt="User avatar" data-ai-hint="person portrait" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-semibold">Jane Doe</p>
                    <p className="text-sm text-foreground/70">Content Strategist</p>
                  </div>
                </CardFooter>
              </Card>
               <Card>
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-primary/50 mb-4" />
                  <p className="text-foreground/90">"The tool recommendation AI is surprisingly accurate. It introduced me to tools I didn't even know I needed. A real game-changer."</p>
                </CardContent>
                <CardFooter className="pt-4">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/40x40.png" alt="User avatar" data-ai-hint="person portrait" />
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-semibold">Michael Smith</p>
                    <p className="text-sm text-foreground/70">Marketing Manager</p>
                  </div>
                </CardFooter>
              </Card>
               <Card>
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-primary/50 mb-4" />
                  <p className="text-foreground/90">"As a developer, I appreciate the clean UI and the seamless integration of the AI tools. It just works."</p>
                </CardContent>
                <CardFooter className="pt-4">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/40x40.png" alt="User avatar" data-ai-hint="person portrait" />
                    <AvatarFallback>SA</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-semibold">Samantha Allen</p>
                    <p className="text-sm text-foreground/70">Software Engineer</p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Logo />
            <p className="text-sm text-foreground/70">&copy; {new Date().getFullYear()} IntelliSuite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
