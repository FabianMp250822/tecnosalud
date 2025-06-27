"use client";

import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const USFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-6" viewBox="0 0 7410 3900"><path fill="#b22234" d="M0 0h7410v3900H0z"/><path d="M0 750h7410v300H0zm0 600h7410v300H0zm0 600h7410v300H0zm0 600h7410v300H0z" fill="#fff"/><path fill="#3c3b6e" d="M0 0h2964v2100H0z"/><path d="m593 420 183 564-476-348h588L309 984zm593 0 183 564-476-348h588L896 984zm593 0 183 564-476-348h588l-476 348zm592 0 183 564-476-348h588l-476 348zM593 1260l183 564-476-348h588l-476 348zm593 0 183 564-476-348h588l-476 348zm593 0 183 564-476-348h588l-476 348zm592 0 183 564-476-348h588l-476 348zM309 840l183 564-476-348h588l-476 348zm593 0 183 564-476-348h588l-476 348zm593 0 183 564-476-348h588l-476 348zm592 0 183 564-476-348h588l-476 348zM309 1680l183 564-476-348h588l-476 348zm593 0 183 564-476-348h588l-476 348zm593 0 183 564-476-348h588l-476 348zm592 0 183 564-476-348h588l-476 348z" fill="#fff"/></svg>
);

const ESFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-6" viewBox="0 0 750 500"><path d="M0 0h750v500H0z" fill="#c60b1e"/><path d="M0 125h750v250H0z" fill="#ffc400"/></svg>
);


export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('es')}>
          <ESFlag />
          <span className="ml-2">Español</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('en')}>
          <USFlag />
          <span className="ml-2">English</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
