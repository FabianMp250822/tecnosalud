'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout, isAdmin } = useAuth();

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  ];

  if (isAdmin) {
    navItems.push({ href: '/dashboard/tool-recommendation', icon: Sparkles, label: 'Mejora de Texto' });
  }


  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);


  if (loading || !user) {
    return (
       <div className="flex flex-col min-h-screen">
        <header className="flex h-16 items-center gap-4 border-b bg-card px-6">
          <Skeleton className="h-8 w-8 lg:hidden" />
          <div className="flex w-full items-center justify-end gap-4">
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-40 w-full" />
          <div className="flex-1 rounded-lg border border-dashed shadow-sm p-4">
             <Skeleton className="h-full w-full" />
          </div>
        </main>
      </div>
    )
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  }

  const NavLink = ({ item }: { item: typeof navItems[0] }) => (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
        pathname === item.href && 'bg-muted text-primary',
      )}
    >
      <item.icon className="h-4 w-4" />
      {item.label}
    </Link>
  );

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center border-b px-6">
          <Logo />
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-4 text-sm font-medium">
          {navItems.map((item) => <NavLink key={item.href} item={item} />)}
        </nav>
      </div>
    </>
  );


  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
         {sidebarContent}
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-card px-6">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
             {sidebarContent}
            </SheetContent>
          </Sheet>
          
          <div className="flex w-full items-center justify-end gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL || `https://placehold.co/40x40.png`} alt="User avatar" data-ai-hint="person" />
                    <AvatarFallback>{user.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || 'Usuario'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
