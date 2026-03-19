
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center space-y-6">
      <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center animate-pulse">
        <ShieldAlert className="h-12 w-12 text-destructive" />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-3xl font-black text-primary uppercase tracking-tight">Security Intercept</h2>
        <p className="text-muted-foreground font-medium">
          The system encountered a permission or data sync error. This usually happens if the session needs to be refreshed or your admin role is being synchronized.
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-8">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Retry Sync
        </Button>
        <Button variant="outline" asChild className="rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-8 border-2">
          <Link href="/login">
            <Home className="mr-2 h-4 w-4" />
            Terminal Home
          </Link>
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground font-mono opacity-50">
        Error Digest: {error.digest || 'unknown_registry_failure'}
      </p>
    </div>
  );
}
