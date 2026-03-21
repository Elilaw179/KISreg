
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
import { DEFAULT_ADMIN_CREDENTIALS } from '@/lib/auth-config';
import Image from 'next/image';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      let targetEmail = DEFAULT_ADMIN_CREDENTIALS.email;
      let targetPassword = DEFAULT_ADMIN_CREDENTIALS.password;

      try {
        const configRef = doc(db, 'settings', 'auth-config');
        const configSnap = await getDoc(configRef);
        if (configSnap.exists()) {
          const data = configSnap.data();
          if (data.masterEmail) targetEmail = data.masterEmail;
          if (data.masterPassword) targetPassword = data.masterPassword;
        }
      } catch (err) {
        console.warn("Sync delay: Using default master credentials.");
      }

      if (formData.email !== targetEmail || formData.password !== targetPassword) {
        throw new Error("Unauthorized administrative access attempt.");
      }

      let userCredential: UserCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-login-credentials') {
          userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        } else {
          throw error;
        }
      }

      if (userCredential.user) {
        const adminRoleRef = doc(db, 'roles_admin', userCredential.user.uid);
        await setDoc(adminRoleRef, { 
          isAdmin: true,
          email: formData.email,
          lastLogin: serverTimestamp()
        }, { merge: true });
      }
      
      toast({
        title: "Registry Authorized",
        description: "Welcome to the KOURKLYS Administrative Interface.",
      });
      router.push('/dashboard');
    } catch (error: any) {
      setIsLoggingIn(false);
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: error.message || "Credential verification failed.",
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

      <div className="mb-10 flex flex-col items-center gap-4 relative z-10">
        <div className="bg-white rounded-3xl p-2 shrink-0 shadow-2xl w-32 h-32 relative overflow-hidden transition-all hover:rotate-3 hover:scale-105 border-4 border-primary/5">
          <Image 
            src="/logokis.png"
            alt="KOURKLYS Logo"
            fill
            className="object-contain p-2"
            priority
          />
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-headline font-black text-primary tracking-tight uppercase">KOURKLYS</h1>
          <p className="text-muted-foreground font-bold tracking-[0.2em] uppercase text-[10px]">
            International School Admin Portal
          </p>
        </div>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-none glass-card relative z-10 rounded-3xl overflow-hidden">
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
                  placeholder="admin@kourklys.edu.ng" 
                  className="pl-11 h-12 bg-muted/20 border-transparent focus:bg-background transition-all rounded-2xl text-sm" 
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
                  className="pl-11 pr-10 h-12 bg-muted/20 border-transparent focus:bg-background transition-all rounded-2xl text-sm" 
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
              className="w-full h-12 text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-xl transition-all rounded-2xl"
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
        &copy; {new Date().getFullYear()} KOURKLYS Int. School • Administrative Infrastructure
      </footer>
    </div>
  );
}
