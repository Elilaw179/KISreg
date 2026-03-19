"use client";

import React, { useEffect } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { 
  ShieldAlert, 
  Lock, 
  Mail, 
  Save, 
  Loader2, 
  ShieldCheck,
  RefreshCcw,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  useFirestore, 
  useDoc, 
  useMemoFirebase, 
  setDocumentNonBlocking 
} from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { DEFAULT_ADMIN_CREDENTIALS } from '@/lib/auth-config';

const securitySchema = z.object({
  masterEmail: z.string().email("Invalid email address"),
  masterPassword: z.string().min(6, "Password must be at least 6 characters"),
});

type SecurityValues = z.infer<typeof securitySchema>;

export default function SystemSecurityPage() {
  const db = useFirestore();
  const { toast } = useToast();
  
  const configRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'auth-config');
  }, [db]);

  const { data: remoteConfig, isLoading: isFetching } = useDoc(configRef);

  const form = useForm<SecurityValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      masterEmail: DEFAULT_ADMIN_CREDENTIALS.email,
      masterPassword: DEFAULT_ADMIN_CREDENTIALS.password,
    },
  });

  useEffect(() => {
    if (remoteConfig) {
      form.reset({
        masterEmail: remoteConfig.masterEmail || DEFAULT_ADMIN_CREDENTIALS.email,
        masterPassword: remoteConfig.masterPassword || DEFAULT_ADMIN_CREDENTIALS.password,
      });
    }
  }, [remoteConfig, form]);

  const onSubmit = (values: SecurityValues) => {
    if (!configRef) return;
    
    // Save to Firestore so the login page can find it dynamically
    setDocumentNonBlocking(configRef, values, { merge: true });
    
    toast({
      title: "Security Config Synchronized",
      description: "New Master credentials have been saved. These will be required for your next login.",
    });
  };

  if (isFetching) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Decrypting Security Terminal...</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-headline font-black text-primary tracking-tight flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive">
                <ShieldAlert className="h-6 w-6" />
              </div>
              System Security
            </h2>
            <p className="text-muted-foreground font-medium mt-1 text-sm uppercase tracking-widest font-black">Master Access Controller</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl font-bold border-2" 
            onClick={() => form.reset()}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reload
          </Button>
        </div>

        <Card className="border-none shadow-2xl shadow-destructive/5 rounded-3xl overflow-hidden bg-white border-l-4 border-l-destructive">
          <CardHeader className="bg-destructive/5 py-6 px-8">
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <CardTitle className="text-sm font-black uppercase tracking-[0.2em]">Critical Configuration</CardTitle>
            </div>
            <CardDescription className="font-bold text-muted-foreground">
              These credentials govern total access to the school registry. Changing these will lock out anyone using the previous "Master" account.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Master Admin Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-white pl-11" 
                      placeholder="admin@kourrklys.edu.ng"
                      {...form.register('masterEmail')}
                    />
                  </div>
                  {form.formState.errors.masterEmail && <p className="text-[10px] font-bold text-destructive uppercase">{form.formState.errors.masterEmail.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Master Access Key (Password)</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="password"
                      className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-white pl-11" 
                      {...form.register('masterPassword')}
                    />
                  </div>
                  {form.formState.errors.masterPassword && <p className="text-[10px] font-bold text-destructive uppercase">{form.formState.errors.masterPassword.message}</p>}
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-destructive/20 bg-destructive hover:bg-destructive/90"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating Security Protocol...</>
                  ) : (
                    <><ShieldCheck className="mr-2 h-4 w-4" /> Save Master Credentials</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-4 py-8">
           <div className="h-px bg-muted flex-1" />
           <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em]">Restricted Access Area</p>
           <div className="h-px bg-muted flex-1" />
        </div>
      </div>
    </DashboardShell>
  );
}