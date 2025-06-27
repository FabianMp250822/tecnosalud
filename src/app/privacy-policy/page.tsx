'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import { Logo } from '@/components/logo';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PolicySection = {
  heading: string;
  text: string;
};

type PolicyContent = {
  title: string;
  back_to_home: string;
  content: PolicySection[];
};

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();
  const policyData = t.privacy_policy as any as PolicyContent;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Logo />
            <Button asChild variant="ghost">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {policyData.back_to_home}
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{policyData.title}</h1>
          <div className="mt-8 space-y-8">
            {policyData.content.map((section, index) => (
              <div key={index}>
                <h2 className="font-headline text-2xl font-semibold text-foreground">{section.heading}</h2>
                <p className="mt-4 text-lg text-muted-foreground whitespace-pre-line">{section.text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
