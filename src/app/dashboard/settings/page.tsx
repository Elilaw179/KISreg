
"use client";

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { 
  Settings, 
  School, 
  Save, 
  UserCircle,
  Clock,
  Loader2,
  RefreshCcw,
  Camera,
  User,
  X
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
import { 
  useFirestore, 
  useDoc, 
  useMemoFirebase, 
  setDocumentNonBlocking, 
  useUser, 
  updateDocumentNonBlocking 
} from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { compressImage } from '@/lib/image-utils';

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
  const { user } = useUser();
  const { toast } = useToast();
  
  const [profileName, setProfileName] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Reference for global school settings
  const settingsRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'school-config');
  }, [db]);

  // Reference for current admin's professional profile
  const adminProfileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'staffs', user.uid);
  }, [db, user]);

  const { data: remoteSettings, isLoading: isFetching } = useDoc(settingsRef);
  const { data: adminProfile } = useDoc(adminProfileRef);

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

  useEffect(() => {
    if (adminProfile) {
      setProfileName(adminProfile.fullName || user?.displayName || '');
      setProfileImage(adminProfile.photoUrl || user?.photoURL || null);
    } else if (user) {
      setProfileName(user.displayName || '');
      setProfileImage(user.photoURL || null);
    }
  }, [adminProfile, user]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawData = reader.result as string;
        try {
          // Compress image to ensure it fits in Firestore and Auth limits
          const compressed = await compressImage(rawData, 200, 200);
          setProfileImage(compressed);
        } catch (err) {
          toast({ variant: "destructive", title: "Image Error", description: "Could not process photo." });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user || !adminProfileRef) return;
    setIsUpdatingProfile(true);
    
    // We store the admin's profile in the 'staffs' collection to avoid the 2KB Auth photoURL limit
    const adminData = {
      fullName: profileName,
      photoUrl: profileImage,
      email: user.email,
      role: 'Admin',
      status: 'Active',
      updatedAt: serverTimestamp(),
      createdAt: adminProfile?.createdAt || serverTimestamp(),
    };

    try {
      setDocumentNonBlocking(adminProfileRef, adminData, { merge: true });
      toast({
        title: "Identity Synchronized",
        description: "Your administrative profile has been updated in the registry.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not save profile.",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

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

        <div className="space-y-8">
          {/* Admin Identity Section */}
          <Card className="border-none shadow-2xl shadow-muted/50 rounded-3xl overflow-hidden bg-primary text-white">
            <CardHeader className="bg-white/10 border-b border-white/10 py-6 px-8">
              <CardTitle className="text-lg font-black flex items-center gap-3">
                <UserCircle className="h-6 w-6" />
                Admin Identity
              </CardTitle>
              <CardDescription className="font-bold text-white/70">Update your professional profile and avatar.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="h-32 w-32 rounded-3xl border-4 border-white/20 overflow-hidden bg-white/10 relative shadow-2xl transition-transform group-hover:scale-105">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <User className="h-12 w-12 opacity-20" />
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Camera className="h-6 w-6 text-white" />
                      <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                    </label>
                  </div>
                  {profileImage && (
                    <button 
                      onClick={() => setProfileImage(null)}
                      className="absolute -top-2 -right-2 p-1 bg-destructive text-white rounded-full shadow-lg"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                
                <div className="flex-1 space-y-4 w-full">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/70">Registrar Display Name</Label>
                    <Input 
                      className="h-12 rounded-xl bg-white/10 border-white/10 text-white placeholder:text-white/30 focus:bg-white/20" 
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="e.g. Dr. Jane Doe"
                    />
                  </div>
                  <Button 
                    onClick={handleUpdateProfile}
                    className="bg-white text-primary hover:bg-white/90 font-black uppercase tracking-widest text-[10px] h-11 px-8 rounded-xl"
                    disabled={isUpdatingProfile}
                  >
                    {isUpdatingProfile ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Syncing...</>
                    ) : (
                      'Save Profile'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* School Information */}
            <Card className="border-none shadow-2xl shadow-muted/50 rounded-3xl overflow-hidden">
              <CardHeader className="bg-muted/20 border-b py-6 px-8">
                <CardTitle className="text-lg font-black flex items-center gap-3 text-primary">
                  <School className="h-6 w-6" />
                  School Identity
                </CardTitle>
                <CardDescription className="font-bold">Update official details for reports and documents.</CardDescription>
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

            <div className="flex justify-end gap-3 pt-4 sticky bottom-6 z-20 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border shadow-2xl">
              <Button 
                type="submit" 
                className="font-black px-12 h-12 rounded-xl shadow-lg shadow-primary/20 uppercase tracking-widest transition-transform hover:scale-[1.02]"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="mr-2 h-4 w-4" /> Save Global Config</>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}
