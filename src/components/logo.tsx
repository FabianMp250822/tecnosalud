import Link from 'next/link';
import { Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2 text-xl font-bold text-foreground',
        'font-headline',
        className
      )}
      aria-label="Tecnosalud Home"
    >
      <Cpu className="h-6 w-6 text-primary" />
      <span>Tecnosalud</span>
    </Link>
  );
}
