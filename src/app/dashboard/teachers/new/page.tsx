
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
  User, 
  Briefcase, 
  Phone, 
  Mail, 
  Heart, 
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

const teacherFormSchema = z.object({
  fullName: z.string().min(3, "Full name required"),
  staffId: z.string().min(3, "Staff ID required"),
  dateOfBirth: z.string().min(1, "DOB required"),
  gender: z.enum(['Male', 'Female']),
  nationality: z.string().min(2, "Nationality required"),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']),
  phone: z.string().min(5, "Phone required"),
  email: z.string().email("Valid email required"),
  address: z.string().min(10, "Address required"),
  designation: z.string().min(2, "Designation required"),
  department: z.string().min(2, "Department required"),
  qualification: z.string().min(2, "Qualification required"),
  dateOfJoining: z.string().min(1, "Joining date required"),
  nextOfKin: z.object({
    name: z.string().min(3, "NOK name required"),
    relationship: z.string().min(2, "Relationship required"),
    phone: z.string().min(5, "NOK phone required"),
    address: z.string().min(10, "NOK address required"),
  }),
});

export default function NewTeacherPage() {
  const router = useRouter();
  const db = useFirestore();
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof teacherFormSchema>>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      fullName: '',
      staffId: '',
      dateOfBirth: '',
      gender: 'Male',
      nationality: 'Nigerian',
      maritalStatus: 'Single',
      phone: '',
      email: '',
      address: '',
      designation: '',
      department: '',
      qualification: '',
      dateOfJoining: new Date().toISOString().split('T')[0],
      nextOfKin: { name: '', relationship: '', phone: '', address: '' },
    }
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 500000) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else if (file) {
      toast({ variant: "destructive", title: "File too large", description: "Passport must be under 500KB." });
    }
  };

  const onSubmit = (values: z.infer<typeof teacherFormSchema>) => {
    if (!db) return;

    const teacherData = {
      ...values,
      photoUrl: photoPreview || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    addDoc(collection(db, 'teachers'), teacherData)
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: 'teachers',
          operation: 'create',
          requestResourceData: teacherData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    router.push('/dashboard/teachers');
    toast({ title: "Staff Registered", description: `Official profile created for ${values.fullName}.` });
  };

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild><Link href="/dashboard/teachers"><ArrowLeft className="h-5 w-5" /></Link></Button>
          <h2 className="text-3xl font-headline font-bold text-primary">Official Staff Enrollment</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                <Card className="border shadow-sm">
                  <CardHeader className="bg-muted/30 border-b"><CardTitle className="text-lg">Personal Info</CardTitle></CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </CardContent>
                </Card>

                <Card className="border shadow-sm">
                  <CardHeader className="bg-primary/5 border-b text-primary"><CardTitle className="text-lg flex items-center gap-2"><Heart className="h-5 w-5" /> Emergency Contact (Next of Kin)</CardTitle></CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                    <FormField control={form.control} name="nextOfKin.name" render={({ field }) => (
                      <FormItem><FormLabel>NOK Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="nextOfKin.phone" render={({ field }) => (
                      <FormItem><FormLabel>NOK Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="nextOfKin.relationship" render={({ field }) => (
                      <FormItem><FormLabel>Relationship</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-4 space-y-6">
                 <Card className="border shadow-sm">
                  <CardHeader><CardTitle className="text-sm font-bold">Passport Photo</CardTitle></CardHeader>
                  <CardContent className="flex flex-col items-center gap-4">
                    <div className="w-full aspect-square rounded-2xl border-2 border-dashed flex items-center justify-center bg-muted/30 overflow-hidden relative">
                      {photoPreview ? <><img src={photoPreview} className="w-full h-full object-cover" /><button type="button" onClick={() => setPhotoPreview(null)} className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full"><X className="h-4 w-4" /></button></> : <Upload className="opacity-50" />}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handlePhotoChange} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-end gap-3 sticky bottom-4 z-10 bg-background/80 backdrop-blur p-4 rounded-xl border shadow-lg">
               <Button type="button" variant="outline" asChild><Link href="/dashboard/teachers">Cancel</Link></Button>
               <Button type="submit" className="px-10 font-bold" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</> : <><Save className="mr-2 h-4 w-4" /> Finalize Registry</>}
               </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardShell>
  );
}
