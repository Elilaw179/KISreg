
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    // Simulate a secure handshake delay
    setTimeout(() => {
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="mb-10 flex flex-col items-center gap-4 relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="relative w-36 h-36 mb-2 drop-shadow-2xl transition-transform hover:scale-105">
          <Image 
            src="https://firebasestorage.googleapis.com/v0/b/firebasestudio.appspot.com/o/image-1741120286819.png?alt=media&token=8d234676-4351-40be-bece-9457635677a2"
            alt="Kourrklys International School Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-headline font-black text-primary tracking-tight">KOURRKLYS</h1>
          <p className="text-muted-foreground font-bold tracking-[0.2em] uppercase text-xs">
            International School
          </p>
        </div>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-none glass-card relative z-10 animate-in fade-in zoom-in-95 duration-500 delay-200">
        <CardHeader className="space-y-2 pt-8">
          <CardTitle className="text-3xl text-center font-headline font-black text-primary/90">Admin Access</CardTitle>
          <CardDescription className="text-center text-sm font-medium">
            Sign in to the KIS Administrative Management System
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6 px-8">
            <div className="space-y-2.5">
              <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Username / Email</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input 
                  id="username" 
                  placeholder="admin@kourrklys.edu.ng" 
                  className="pl-11 h-12 bg-muted/50 border-transparent focus:bg-white focus:border-primary/20 transition-all rounded-xl" 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Security Code</Label>
                <Link href="/forgot-password" size="sm" className="text-xs text-primary hover:text-primary/70 transition-colors font-bold">
                  Lost Key?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  className="pl-11 pr-10 h-12 bg-muted/50 border-transparent focus:bg-white focus:border-primary/20 transition-all rounded-xl" 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-6 p-8 pt-2">
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all rounded-xl"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Secure Login
                </>
              )}
            </Button>
            <div className="flex items-center justify-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                 Authorized Personnel Only
               </p>
            </div>
          </CardFooter>
        </form>
      </Card>

      <footer className="mt-16 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
        &copy; {new Date().getFullYear()} Kourrklys International School Admin Portal
      </footer>
    </div>
  );
}
