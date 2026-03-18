
"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Settings, 
  Search,
  Bell,
  GraduationCap,
  ClipboardList,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { ModeToggle } from '@/components/mode-toggle';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Authenticating...</p>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Student Directory', href: '/dashboard/students', icon: Users },
    { name: 'Staff Management', href: '/dashboard/teachers', icon: GraduationCap },
    { name: 'Admission Center', href: '/dashboard/students/new', icon: ClipboardList },
  ];

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r-0 shadow-2xl transition-all duration-300">
        <SidebarHeader className="p-4 flex flex-row items-center gap-3">
          <div className="bg-white rounded-xl p-1 shrink-0 shadow-md w-10 h-10 relative overflow-hidden transition-transform hover:scale-105">
             <Image 
                src="https://firebasestorage.googleapis.com/v0/b/firebasestudio.appspot.com/o/image-1741120286819.png?alt=media&token=8d234676-4351-40be-bece-9457635677a2"
                alt="KIS Logo"
                fill
                className="object-contain p-1"
                priority
             />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden overflow-hidden">
            <span className="font-headline font-black text-lg text-white leading-tight tracking-tight">KOURRKLYS</span>
            <span className="text-[10px] text-white/70 font-bold tracking-widest uppercase">Int. School</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-2 pt-6">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.href}
                  tooltip={item.name}
                  className={cn(
                    "mb-1 h-11 transition-all duration-200",
                    pathname === item.href ? "bg-white/10 text-white shadow-sm" : "hover:bg-white/5 text-white/80"
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-white" : "text-white/60")} />
                    <span className="font-semibold">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 space-y-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                className={cn(
                  "h-11 transition-all",
                  pathname === '/dashboard/settings' ? "bg-white/10 text-white" : "hover:bg-white/5 text-white/80"
                )} 
                asChild 
                tooltip="Settings" 
                isActive={pathname === '/dashboard/settings'}
              >
                <Link href="/dashboard/settings">
                  <Settings className="w-5 h-5 text-white/60" />
                  <span className="font-medium">Admin Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                className="hover:bg-destructive hover:text-white text-white/80 h-11 mt-2 transition-colors" 
                onClick={handleLogout}
                tooltip="Logout"
              >
                <LogOut className="w-5 h-5 opacity-60" />
                <span className="font-medium">Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      
      <SidebarInset className="transition-all duration-300">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 md:px-6">
          <SidebarTrigger className="hover:bg-muted" />
          <div className="flex-1">
            <div className="relative max-w-sm hidden md:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                type="search"
                placeholder="Find records..."
                className="pl-10 bg-muted/30 border-none ring-0 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all rounded-full h-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button variant="ghost" size="icon" className="relative h-10 w-10 hover:bg-muted transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse"></span>
            </Button>
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">{user?.displayName || 'Admin User'}</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-1 tracking-wider uppercase">Registrar Office</p>
              </div>
              <Avatar className="h-10 w-10 border-2 border-primary/10 shadow-sm transition-transform hover:scale-105 cursor-pointer">
                <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/admin/200/200"} alt="Admin" />
                <AvatarFallback className="bg-primary text-white text-xs font-bold">AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-8 flex-1 bg-muted/10">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
