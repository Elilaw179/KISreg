
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ArrowLeft, 
  Upload, 
  Save, 
  X,
  User,
  Briefcase,
  Mail,
  Loader2,
  Stethoscope,
  MapPin,
  CalendarDays,
  Globe,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { CLASSES } from '@/lib/mock-data';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

const studentFormSchema = z.object({
  fullName: z.string().min(3, "Full name is required (Surname First)"),
  admissionNumber: z.string().min(3, "Unique Admission No. is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(['Male', 'Female', 'Other']),
  class: z.string().min(1, "Academic class assignment is required"),
  dateOfAdmission: z.string().min(1, "Admission date is required"),
  nationality: z.string().min(2, "Nationality is required"),
  parentName: z.string().min(3, "Primary guardian name is required"),
  parentContact: z.string().min(5, "Contact phone number is required"),
  parentEmail: z.string().email("A valid professional email is required"),
  parentOccupation: z.string().min(2, "Guardian occupation is required"),
  address: z.string().min(10, "Full residential address is required"),
  bloodGroup: z.string().optional(),
  medicalInfo: z.string().optional(),
  previousSchool: z.string().optional(),
});

export default function NewStudentPage() {
  const router = useRouter();
  const db = useFirestore();
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      fullName: '',
      admissionNumber: '',
      dateOfBirth: '',
      gender: 'Male',
      class: '',
      dateOfAdmission: new Date().toISOString().split('T')[0],
      nationality: 'Nigerian',
      parentName: '',
      parentContact: '',
      parentEmail: '',
      parentOccupation: '',
      address: '',
      bloodGroup: '',
      medicalInfo: '',
      previousSchool: '',
    }
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: z.infer<typeof studentFormSchema>) => {
    if (!db) return;

    const studentData = {
      ...values,
      status: 'Active',
      photoUrl: photoPreview || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    addDoc(collection(db, 'students'), studentData)
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: 'students',
          operation: 'create',
          requestResourceData: studentData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    toast({
      title: "Admission Finalized",
      description: `Registry entry created for ${values.fullName}.`,
    });
    router.push('/dashboard/students');
  };

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href="/dashboard/students">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="space-y-0.5">
            <h2 className="text-3xl font-headline font-black text-primary tracking-tight">Student Enrollment</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">New Admission Entry Form</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-8">
                <Card className="shadow-sm border-none bg-white">
                  <CardHeader className="pb-3"><CardTitle className="text-sm font-black uppercase tracking-widest">Identity Passport</CardTitle></CardHeader>
                  <CardContent className="flex flex-col items-center gap-4">
                    <div className="w-full aspect-square rounded-2xl border-2 border-dashed border-primary/10 flex items-center justify-center bg-muted/20 overflow-hidden relative group transition-all hover:bg-muted/30">
                      {photoPreview ? (
                        <>
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setPhotoPreview(null)} className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full shadow-lg"><X className="h-4 w-4" /></button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-muted-foreground p-6 text-center">
                          <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <Upload className="h-6 w-6 text-primary" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest">Upload Official Photo</span>
                        </div>
                      )}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handlePhotoChange} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-none bg-primary/5">
                  <CardHeader className="bg-primary/5 border-b py-4">
                    <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-primary"><Stethoscope className="h-4 w-4" /> Medical Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <FormField control={form.control} name="bloodGroup" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Blood Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="h-11 rounded-xl bg-white"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                          <SelectContent>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}</SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="medicalInfo" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Allergies / Notes</FormLabel>
                        <FormControl><Textarea className="min-h-[100px] rounded-xl bg-white resize-none text-sm" placeholder="List any critical conditions..." {...field} /></FormControl>
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-8 space-y-8">
                <Card className="shadow-sm border-none bg-white">
                  <CardHeader className="bg-muted/20 border-b py-4">
                    <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Core Bio-Data</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-6 pt-8">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name (SURNAME, First Name Middle Name)</FormLabel>
                        <FormControl><Input placeholder="e.g. ADEMOLA, Segun Sunday" className="h-12 rounded-xl" {...field} /></FormControl>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="admissionNumber" render={({ field }) => (
                      <FormItem><FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registry No.</FormLabel><FormControl><Input placeholder="KIS/2024/XXX" className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="class" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Academic Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Assign Class" /></SelectTrigger></FormControl>
                          <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                      <FormItem><FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date of Birth</FormLabel><FormControl><Input type="date" className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select Gender" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="nationality" render={({ field }) => (
                      <FormItem><FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nationality</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="dateOfAdmission" render={({ field }) => (
                      <FormItem><FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Admission Date</FormLabel><FormControl><Input type="date" className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="previousSchool" render={({ field }) => (
                      <FormItem><FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Previous School</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-none bg-white">
                  <CardHeader className="bg-muted/20 border-b py-4">
                    <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" /> Guardian & Residence</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-6 pt-8">
                    <FormField control={form.control} name="parentName" render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Primary Guardian Name</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="parentEmail" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact Email</FormLabel>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-11 h-12 rounded-xl" placeholder="email@example.com" {...field} />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="parentContact" render={({ field }) => (
                      <FormItem><FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="parentOccupation" render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Occupation / Business</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Residential Address</FormLabel><FormControl><Textarea className="min-h-[80px] rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-end gap-3 sticky bottom-4 z-20 bg-background/90 backdrop-blur-md p-4 rounded-2xl border shadow-xl">
               <Button type="button" variant="outline" className="rounded-xl px-6 h-12 font-bold" asChild disabled={form.formState.isSubmitting}><Link href="/dashboard/students">Discard Entry</Link></Button>
               <Button type="submit" className="px-12 h-12 font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalizing...</> : <><Save className="mr-2 h-4 w-4" /> Register Student</>}
               </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardShell>
  );
}
