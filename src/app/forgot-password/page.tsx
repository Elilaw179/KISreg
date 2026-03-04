
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
    // Simulate password reset request
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="relative w-24 h-24 mb-2">
          <Image 
            src="https://firebasestorage.googleapis.com/v0/b/firebasestudio.appspot.com/o/image-1741120286819.png?alt=media&token=8d234676-4351-40be-bece-9457635677a2"
            alt="Kourrklys International School Logo"
            fill
            className="object-contain"
            priority
            data-ai-hint="school logo"
          />
        </div>
        <h1 className="text-2xl font-headline font-extrabold text-primary tracking-tight uppercase">Kourrklys</h1>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-none">
        {!isSubmitted ? (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center font-headline font-bold">Reset Password</CardTitle>
              <CardDescription className="text-center">
                Enter your official email to receive a reset link.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Official Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="staffname@kourrklys.edu.ng" 
                      className="pl-10 h-11" 
                      required 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full h-12 text-base font-semibold shadow-md">
                  Send Reset Instructions
                </Button>
                <Button variant="ghost" asChild className="w-full">
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
            <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
            <CardDescription className="text-base max-w-[280px]">
              We've sent password reset instructions to your email address.
            </CardDescription>
            <div className="pt-6 w-full">
              <Button asChild className="w-full h-11 font-bold shadow-md">
                <Link href="/login">Return to Login</Link>
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <footer className="mt-12 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Kourrklys International School.
      </footer>
    </div>
  );
}
