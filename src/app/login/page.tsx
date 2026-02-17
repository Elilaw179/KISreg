
"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="relative w-32 h-32 mb-4">
          <Image 
            src="https://firebasestorage.googleapis.com/v0/b/firebasestudio.appspot.com/o/image-1741120286819.png?alt=media&token=8d234676-4351-40be-bece-9457635677a2"
            alt="Kourrklys International School Logo"
            fill
            className="object-contain"
            priority
            data-ai-hint="school logo"
          />
        </div>
        <h1 className="text-3xl font-headline font-extrabold text-primary tracking-tight">KOURRKLYS</h1>
        <p className="text-muted-foreground text-center font-medium">
          INTERNATIONAL SCHOOL
        </p>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-headline font-bold">Admin Portal</CardTitle>
          <CardDescription className="text-center">
            Sign in to manage student records
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="username" 
                  placeholder="admin@kourrklys.edu" 
                  className="pl-10 h-11" 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  className="pl-10 h-11" 
                  required 
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full h-12 text-base font-semibold shadow-md">
              <ShieldCheck className="mr-2 h-5 w-5" />
              Access System
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Secure access for authorized staff only.
            </p>
          </CardFooter>
        </form>
      </Card>

      <footer className="mt-12 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Kourrklys International School.
      </footer>
    </div>
  );
}
