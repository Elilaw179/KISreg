
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
  Loader2,
  Sparkles,
  ShieldCheck,
  Heart
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
import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const adminProfileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'staffs', user.uid);
  }, [db, user]);

  const { data: adminProfile } = useDoc(adminProfileRef);

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

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
          <Sparkles className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Authenticating Session</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Student Directory', href: '/dashboard/students', icon: Users },
    { name: 'Staff Management', href: '/dashboard/teachers', icon: GraduationCap },
    { name: 'Admission Center', href: '/dashboard/students/new', icon: ClipboardList },
  ];

  const displayName = adminProfile?.fullName || user.displayName || 'Admin User';
  const photoUrl = adminProfile?.photoUrl || user.photoURL || "https://picsum.photos/seed/admin/200/200";

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r-0 shadow-2xl transition-all duration-300">
        <SidebarHeader className="p-6 flex flex-row items-center gap-3">
          <div className="bg-white rounded-2xl p-1.5 shrink-0 shadow-xl w-11 h-11 relative overflow-hidden transition-all hover:rotate-3 hover:scale-110">
             <Image 
                src="https://firebasestorage.googleapis.com/v0/b/firebasestudio.appspot.com/o/image-1741120286819.png?alt=media&token=8d234676-4351-40be-bece-9457635677a2"
                alt="KIS Logo"
                fill
                className="object-contain p-1"
                priority
             />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden overflow-hidden">
            <span className="font-headline font-black text-xl text-white leading-tight tracking-tight">KOURRKLYS</span>
            <span className="text-[10px] text-white/50 font-bold tracking-[0.2em] uppercase">Int. School</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-3 pt-8">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.href}
                  tooltip={item.name}
                  className={cn(
                    "mb-2 h-12 transition-all duration-300 rounded-2xl px-4",
                    pathname === item.href 
                      ? "bg-primary text-white shadow-xl shadow-primary/30 translate-x-1" 
                      : "hover:bg-white/10 text-white/70 hover:text-white"
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className={cn("w-5 h-5 transition-transform duration-300", pathname === item.href ? "scale-110" : "opacity-60")} />
                    <span className="font-bold tracking-tight">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-6 space-y-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                className={cn(
                  "h-12 transition-all rounded-2xl px-4",
                  pathname === '/dashboard/settings' ? "bg-white/10 text-white" : "hover:bg-white/5 text-white/60"
                )} 
                asChild 
                tooltip="Settings" 
                isActive={pathname === '/dashboard/settings'}
              >
                <Link href="/dashboard/settings">
                  <Settings className="w-5 h-5 opacity-60" />
                  <span className="font-bold">Admin Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                className="hover:bg-destructive hover:text-white text-white/60 h-12 mt-2 transition-all rounded-2xl px-4 group" 
                onClick={handleLogout}
                tooltip="Logout"
              >
                <LogOut className="w-5 h-5 opacity-60 group-hover:translate-x-1 transition-transform" />
                <span className="font-bold">Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      
      <SidebarInset className="transition-all duration-300 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 flex h-20 items-center gap-4 border-b bg-background/60 backdrop-blur-xl px-6 md:px-10 shrink-0">
          <SidebarTrigger className="hover:bg-muted h-10 w-10 rounded-xl" />
          <div className="flex-1">
            <div className="relative max-w-sm hidden md:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                type="search"
                placeholder="Find records, staff or events..."
                className="pl-12 bg-muted/50 border-transparent ring-0 focus-visible:ring-primary/20 focus-visible:bg-white transition-all rounded-2xl h-11 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <ModeToggle />
            <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-2xl hover:bg-muted transition-all">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background animate-pulse shadow-sm shadow-primary/50"></span>
            </Button>
            <div className="flex items-center gap-4 pl-6 border-l h-10">
              <div className="text-right hidden sm:block space-y-0.5">
                <p className="text-sm font-black text-primary leading-none">{displayName}</p>
                <p className="text-[10px] text-muted-foreground font-black tracking-widest uppercase opacity-60">Registrar Office</p>
              </div>
              <Avatar className="h-11 w-11 border-2 border-primary/10 shadow-xl transition-all hover:scale-110 hover:rotate-3 cursor-pointer ring-offset-background ring-primary/20 hover:ring-2">
                <AvatarImage src={photoUrl} alt="Admin" />
                <AvatarFallback className="bg-primary text-white text-xs font-black">AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        <main className="p-6 md:p-10 flex-1 bg-muted/5">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>

        <footer className="border-t bg-white py-8 px-6 md:px-10 shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 relative opacity-80 grayscale">
                <Image 
                  src="https://firebasestorage.googleapis.com/v0/b/firebasestudio.appspot.com/o/image-1741120286819.png?alt=media&token=8d234676-4351-40be-bece-9457635677a2"
                  alt="KIS Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-xs font-black text-primary uppercase tracking-widest leading-none">Kourrklys International School</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Administrative Infrastructure &copy; {new Date().getFullYear()}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Database Sync: Online</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary opacity-40" />
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Secure Entry Terminal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Session: 2024/2025</span>
              </div>
            </div>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
