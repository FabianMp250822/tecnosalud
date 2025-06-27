import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  isLocked?: boolean;
}

export function ToolCard({ title, description, href, icon, isLocked = false }: ToolCardProps) {
  return (
    <Card className={cn("flex flex-col", isLocked && "bg-muted/50 border-dashed")}>
      <CardHeader className="flex-1">
        <div className="mb-4 flex justify-between items-start">
            {icon}
            {isLocked && <Badge variant="secondary">Coming Soon</Badge>}
        </div>
        <CardTitle className="font-headline">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild className="w-full" disabled={isLocked}>
          <Link href={isLocked ? '#' : href}>
            {isLocked ? <Lock className="mr-2 h-4 w-4" /> : null}
            Launch Tool
            {!isLocked && <ArrowRight className="ml-2 h-4 w-4" />}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
