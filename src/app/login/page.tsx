"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ADMIN_CREDENTIALS } from '@/lib/auth-config';
import Image from 'next/image';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      // Validate local credentials first (Master Admin check)
      if (formData.email !== ADMIN_CREDENTIALS.email || formData.password !== ADMIN_CREDENTIALS.password) {
        throw new Error("Invalid administrative credentials.");
      }

      // Real Firebase Authentication
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      toast({
        title: "Access Granted",
        description: "Welcome to the KIS Administrative Portal.",
      });
      
      // router.push is handled by the useEffect above
    } catch (error: any) {
      setIsLoggingIn(false);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "Invalid credentials. Please verify your security key and email.",
      });
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="mb-10 flex flex-col items-center gap-4 relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="relative w-32 h-32 mb-2 drop-shadow-2xl">
          <Image 
            src="https://firebasestorage.googleapis.com/v0/b/firebasestudio.appspot.com/o/image-1741120286819.png?alt=media&token=8d234676-4351-40be-bece-9457635677a2"
            alt="Kourrklys International School Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-headline font-black text-primary tracking-tight uppercase">KOURRKLYS</h1>
          <p className="text-muted-foreground font-bold tracking-[0.2em] uppercase text-[10px]">
            International School Admin Portal
          </p>
        </div>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-none glass-card relative z-10 animate-in fade-in zoom-in-95 duration-500 delay-200">
        <CardHeader className="space-y-2 pt-8">
          <CardTitle className="text-2xl text-center font-headline font-black text-primary/90 uppercase tracking-tight">Secured Entry</CardTitle>
          <CardDescription className="text-center text-xs font-bold uppercase text-muted-foreground/60 tracking-widest">
            Authorization Required
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-5 px-8">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-1">Email Identifier</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@kourrklys.edu.ng" 
                  className="pl-11 h-12 bg-muted/20 border-transparent focus:bg-white focus:border-primary/20 transition-all rounded-xl text-sm" 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Security Code</Label>
                <Link href="/forgot-password" size="sm" className="text-[10px] text-primary hover:text-primary/70 transition-colors font-black uppercase tracking-widest">
                  Reset Key
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-11 pr-10 h-12 bg-muted/20 border-transparent focus:bg-white focus:border-primary/20 transition-all rounded-xl text-sm" 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors z-20"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-6 p-8 pt-4">
            <Button 
              type="submit" 
              className="w-full h-12 text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-xl transition-all rounded-xl"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Access Dashboard
                </>
              )}
            </Button>
            <div className="flex items-center justify-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                 Authorized Personnel Only
               </p>
            </div>
          </CardFooter>
        </form>
      </Card>

      <footer className="mt-16 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-40">
        &copy; {new Date().getFullYear()} Kourrklys Int. School • Admin Infrastructure
      </footer>
    </div>
  );
}
