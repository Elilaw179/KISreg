
"use client";

import React, { useEffect } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { 
  Settings, 
  School, 
  Save, 
  UserCircle,
  Clock,
  Loader2,
  RefreshCcw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const settingsSchema = z.object({
  schoolName: z.string().min(3, "School name is required"),
  schoolAbbr: z.string().min(2, "Abbreviation is required"),
  schoolAddress: z.string().min(5, "Address is required"),
  schoolEmail: z.string().email("Invalid email"),
  schoolPhone: z.string().min(5, "Phone is required"),
  activeSession: z.string().min(4, "Active session is required (e.g., 2024/2025)"),
  currentTerm: z.string().min(1, "Current term is required"),
  twoFactorEnabled: z.boolean().default(false),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  
  const settingsRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'school-config');
  }, [db]);

  const { data: remoteSettings, isLoading: isFetching } = useDoc(settingsRef);

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      schoolName: 'Kourrklys International School',
      schoolAbbr: 'KIS',
      schoolAddress: '12 Victoria Island, Lagos, Nigeria',
      schoolEmail: 'admin@kourrklys.edu.ng',
      schoolPhone: '+234 801 234 5678',
      activeSession: '2023/2024',
      currentTerm: '2nd',
      twoFactorEnabled: false,
    },
  });

  useEffect(() => {
    if (remoteSettings) {
      form.reset({
        schoolName: remoteSettings.schoolName || '',
        schoolAbbr: remoteSettings.schoolAbbr || '',
        schoolAddress: remoteSettings.schoolAddress || '',
        schoolEmail: remoteSettings.schoolEmail || '',
        schoolPhone: remoteSettings.schoolPhone || '',
        activeSession: remoteSettings.activeSession || '',
        currentTerm: remoteSettings.currentTerm || '1st',
        twoFactorEnabled: !!remoteSettings.twoFactorEnabled,
      });
    }
  }, [remoteSettings, form]);

  const onSubmit = (values: SettingsValues) => {
    if (!settingsRef) return;

    setDocumentNonBlocking(settingsRef, values, { merge: true });
    
    toast({
      title: "Settings Synchronized",
      description: "School configurations have been updated globally.",
    });
  };

  if (isFetching) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Fetching System Config...</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-headline font-black text-primary tracking-tight flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Settings className="h-6 w-6" />
              </div>
              System Config
            </h2>
            <p className="text-muted-foreground font-medium mt-1">Manage global preferences and school identity parameters.</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl font-bold border-2" 
            onClick={() => form.reset()}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reset Form
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* School Information */}
          <Card className="border-none shadow-2xl shadow-muted/50 rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/20 border-b py-6 px-8">
              <CardTitle className="text-lg font-black flex items-center gap-3 text-primary">
                <School className="h-6 w-6" />
                School Identity
              </CardTitle>
              <CardDescription className="font-bold">Update the official school details used on reports and system documents.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8 pt-10 px-8 pb-10">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Official School Name</Label>
                <Input className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-white" {...form.register('schoolName')} />
                {form.formState.errors.schoolName && <p className="text-[10px] font-bold text-destructive uppercase">{form.formState.errors.schoolName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Acronym / Abbreviation</Label>
                <Input className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-white uppercase" {...form.register('schoolAbbr')} />
                {form.formState.errors.schoolAbbr && <p className="text-[10px] font-bold text-destructive uppercase">{form.formState.errors.schoolAbbr.message}</p>}
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Corporate Address</Label>
                <Input className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-white" {...form.register('schoolAddress')} />
                {form.formState.errors.schoolAddress && <p className="text-[10px] font-bold text-destructive uppercase">{form.formState.errors.schoolAddress.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Administrative Email</Label>
                <Input className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-white" type="email" {...form.register('schoolEmail')} />
                {form.formState.errors.schoolEmail && <p className="text-[10px] font-bold text-destructive uppercase">{form.formState.errors.schoolEmail.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Contact Phone</Label>
                <Input className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-white" {...form.register('schoolPhone')} />
                {form.formState.errors.schoolPhone && <p className="text-[10px] font-bold text-destructive uppercase">{form.formState.errors.schoolPhone.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Academic Session Settings */}
          <Card className="border-none shadow-2xl shadow-muted/50 rounded-3xl overflow-hidden">
            <CardHeader className="bg-primary/5 border-b py-6 px-8">
              <CardTitle className="text-lg font-black flex items-center gap-3 text-primary">
                <Clock className="h-6 w-6" />
                Academic Session Control
              </CardTitle>
              <CardDescription className="font-bold">Real-time term and session synchronization.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8 pt-10 px-8 pb-10">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Active Academic Session (Type In)</Label>
                <Input 
                  className="h-12 rounded-xl bg-white border-primary/20 focus:ring-primary/30" 
                  placeholder="e.g. 2024/2025"
                  {...form.register('activeSession')} 
                />
                {form.formState.errors.activeSession && <p className="text-[10px] font-bold text-destructive uppercase">{form.formState.errors.activeSession.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Current Academic Term</Label>
                <Select 
                  onValueChange={(val) => form.setValue('currentTerm', val)} 
                  value={form.watch('currentTerm')}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-white border-primary/20">
                    <SelectValue placeholder="Select Term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st Term (Autumn/First Half)</SelectItem>
                    <SelectItem value="2nd">2nd Term (Spring/Second Half)</SelectItem>
                    <SelectItem value="3rd">3rd Term (Summer/Third Half)</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.currentTerm && <p className="text-[10px] font-bold text-destructive uppercase">{form.formState.errors.currentTerm.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* User Account Settings */}
          <Card className="border-none shadow-2xl shadow-muted/50 rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/20 border-b py-6 px-8">
              <CardTitle className="text-lg font-black flex items-center gap-3 text-primary">
                <UserCircle className="h-6 w-6" />
                Security Overlays
              </CardTitle>
              <CardDescription className="font-bold">Administrative access and security protocols.</CardDescription>
            </CardHeader>
            <CardContent className="pt-10 px-8 pb-10">
              <div className="flex items-center justify-between p-6 bg-muted/30 rounded-2xl border border-dashed border-primary/10">
                <div className="space-y-1">
                  <Label className="text-sm font-black text-primary uppercase tracking-tight">Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground font-medium">Add an extra verification layer to all admin logins.</p>
                </div>
                <Switch 
                  checked={form.watch('twoFactorEnabled')} 
                  onCheckedChange={(val) => form.setValue('twoFactorEnabled', val)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-4 sticky bottom-6 z-20 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border shadow-2xl">
            <Button 
              type="submit" 
              className="font-black px-12 h-12 rounded-xl shadow-lg shadow-primary/20 uppercase tracking-widest transition-transform hover:scale-[1.02]"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Committing Changes...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" /> Save Global Config</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
