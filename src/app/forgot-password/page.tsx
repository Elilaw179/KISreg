
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="mb-8 flex flex-col items-center gap-2 relative z-10">
        <div className="bg-white rounded-3xl p-2 shrink-0 shadow-2xl w-24 h-24 relative overflow-hidden transition-all hover:rotate-3 hover:scale-110 border-2 border-primary/5 mb-2">
          <Image 
            src="/logokis.png"
            alt="KOURKLYS Logo"
            fill
            className="object-contain p-2"
            priority
          />
        </div>
        <h1 className="text-2xl font-headline font-black text-primary tracking-tight uppercase">KOURKLYS</h1>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-none rounded-3xl glass-card relative z-10 overflow-hidden">
        {!isSubmitted ? (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center font-headline font-bold">Reset Access Key</CardTitle>
              <CardDescription className="text-center text-sm font-medium">
                Enter your official email to receive a reset link.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Official Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="registrar@kourklys.edu.ng" 
                      className="pl-11 h-12 rounded-xl bg-muted/20 border-transparent focus:bg-background transition-all" 
                      required 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 p-8 pt-0">
                <Button type="submit" className="w-full h-12 text-sm font-black uppercase tracking-widest shadow-md rounded-xl">
                  Send Instructions
                </Button>
                <Button variant="ghost" asChild className="w-full h-11 rounded-xl">
                  <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Link>
                </Button>
              </CardFooter>
            </form>
          </>
        ) : (
          <CardContent className="pt-10 pb-10 flex flex-col items-center text-center space-y-4 px-8">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2 shadow-inner">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <CardTitle className="text-2xl font-black text-primary">Check your inbox</CardTitle>
            <CardDescription className="text-sm font-medium leading-relaxed">
              If the email matches a registered admin account, you will receive instructions shortly.
            </CardDescription>
            <div className="pt-6 w-full">
              <Button asChild className="w-full h-12 font-black uppercase tracking-widest shadow-md rounded-xl">
                <Link href="/login">Return to Login</Link>
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <footer className="mt-12 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-40">
        &copy; {new Date().getFullYear()} KOURKLYS International School.
      </footer>
    </div>
  );
}
