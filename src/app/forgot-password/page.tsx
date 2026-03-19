
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="relative w-24 h-24 mb-2">
          <Image 
            src="/logokis.png"
            alt="KIS Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-2xl font-headline font-black text-primary tracking-tight uppercase">KOURRKLYS</h1>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-none">
        {!isSubmitted ? (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center font-headline font-bold">Reset Access Key</CardTitle>
              <CardDescription className="text-center">
                Enter your official email to receive a reset link.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Official Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="registrar@kourrklys.edu.ng" 
                      className="pl-10 h-11 rounded-xl" 
                      required 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full h-12 text-sm font-black uppercase tracking-widest shadow-md rounded-xl">
                  Send Instructions
                </Button>
                <Button variant="ghost" asChild className="w-full rounded-xl">
                  <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Link>
                </Button>
              </CardFooter>
            </form>
          </>
        ) : (
          <CardContent className="pt-10 pb-10 flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <CardTitle className="text-2xl font-black">Check your inbox</CardTitle>
            <CardDescription className="text-base max-w-[280px]">
              If the email matches a registered admin account, you will receive instructions shortly.
            </CardDescription>
            <div className="pt-6 w-full">
              <Button asChild className="w-full h-11 font-black uppercase tracking-widest shadow-md rounded-xl">
                <Link href="/login">Return to Login</Link>
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <footer className="mt-12 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-40">
        &copy; {new Date().getFullYear()} Kourrklys International School.
      </footer>
    </div>
  );
}
