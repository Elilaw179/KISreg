"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  LogOut, 
  Settings, 
  Search,
  Bell,
  GraduationCap
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

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Student Records', href: '/dashboard/students', icon: Users },
    { name: 'New Admission', href: '/dashboard/students/new', icon: UserPlus },
  ];

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r-0 shadow-2xl">
        <SidebarHeader className="p-4 flex flex-row items-center gap-3">
          <div className="bg-white rounded-full p-2 shrink-0 shadow-inner">
             <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden overflow-hidden">
            <span className="font-headline font-black text-lg text-white leading-tight">KOURRKLYS</span>
            <span className="text-[10px] text-white/70 font-medium tracking-widest uppercase">International School</span>
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
                  className="hover:bg-sidebar-accent mb-1 h-11"
                >
                  <Link href={item.href}>
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-sidebar-accent h-10" asChild tooltip="Settings">
                <Link href="/dashboard/settings">
                  <Settings className="w-5 h-5" />
                  <span>Admin Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-destructive text-white h-10 mt-2" asChild tooltip="Logout">
                <Link href="/login">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <div className="relative max-w-sm hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Find records..."
                className="pl-8 bg-muted/50 border-none ring-0 focus-visible:ring-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative h-10 w-10">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
            </Button>
            <div className="flex items-center gap-3 pl-2 border-l">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none">Admin User</p>
                <p className="text-[10px] text-muted-foreground mt-1">Registrar Office</p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-primary/20">
                <AvatarImage src="https://picsum.photos/seed/admin/200/200" alt="Admin" />
                <AvatarFallback className="bg-primary text-white text-xs">AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-8 flex-1 bg-muted/20">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}