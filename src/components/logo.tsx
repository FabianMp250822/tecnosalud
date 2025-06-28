import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn('flex items-center', className)}
      aria-label="Tecnosalud Home"
    >
      <Image 
        src="https://tecnosalud.cloud/assets/img/logo/logo-color.png" 
        alt="Tecnosalud Logo" 
        width={180} 
        height={40}
        className="object-contain h-10 w-auto"
        priority
      />
    </Link>
  );
}
