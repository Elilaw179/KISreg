
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
  School,
  Calendar as CalendarIcon,
  Phone,
  Home,
  Globe,
  Stethoscope,
  Droplet,
  Mail,
  Briefcase
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

const studentFormSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  admissionNumber: z.string().min(3, "Admission number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(['Male', 'Female', 'Other']),
  class: z.string().min(1, "Please select a class"),
  dateOfAdmission: z.string().min(1, "Admission date is required"),
  nationality: z.string().min(2, "Nationality is required"),
  parentName: z.string().min(3, "Guardian name is required"),
  parentContact: z.string().min(5, "Contact number is required"),
  parentEmail: z.string().email("Invalid email address"),
  parentOccupation: z.string().min(2, "Occupation is required"),
  address: z.string().min(10, "Full residential address is required"),
  bloodGroup: z.string().optional(),
  medicalInfo: z.string().optional(),
  previousSchool: z.string().optional(),
});

export default function NewStudentPage() {
  const router = useRouter();
  const db = useFirestore();
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
      .then(() => {
        router.push('/dashboard/students');
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: 'students',
          operation: 'create',
          requestResourceData: studentData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/students">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h2 className="text-3xl font-headline font-bold text-primary">New Admission</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Photo & Medical Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <Card className="shadow-sm border">
                  <CardHeader><CardTitle className="text-lg">Passport Photo</CardTitle></CardHeader>
                  <CardContent className="flex flex-col items-center gap-4">
                    <div className="w-full aspect-square max-w-[240px] rounded-2xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center bg-muted/30 overflow-hidden relative group">
                      {photoPreview ? (
                        <>
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setPhotoPreview(null)} className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full hover:scale-110 transition-transform shadow-lg z-10"><X className="h-4 w-4" /></button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground p-6 text-center">
                          <Upload className="h-10 w-10 opacity-50 mb-2 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium">Click to upload photo</span>
                        </div>
                      )}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handlePhotoChange} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b">
                    <CardTitle className="text-lg flex items-center gap-2"><Stethoscope className="h-5 w-5 text-primary" /> Medical Info</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <FormField
                      control={form.control}
                      name="bloodGroup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Group</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                            <SelectContent>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}</SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="medicalInfo"
                      render={({ field }) => (
                        <FormItem><FormLabel>Health Conditions</FormLabel><FormControl><Textarea placeholder="..." {...field} /></FormControl></FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Main Form Fields */}
              <div className="lg:col-span-8 space-y-6">
                <Card className="shadow-sm border">
                  <CardHeader className="bg-muted/30 border-b">
                    <CardTitle className="text-lg flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Student Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel>Full Name (Surname First)</FormLabel><FormControl><Input placeholder="e.g., Okeke, Chioma" {...field} /></FormControl><FormMessage /></FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="admissionNumber"
                      render={({ field }) => (
                        <FormItem><FormLabel>Admission Number</FormLabel><FormControl><Input placeholder="KIS/..." {...field} /></FormControl><FormMessage /></FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem><FormLabel>Nationality</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="class"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger></FormControl>
                            <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="shadow-sm border">
                  <CardHeader className="bg-muted/30 border-b">
                    <CardTitle className="text-lg flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" /> Guardian Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                    <FormField
                      control={form.control}
                      name="parentName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel>Guardian Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="parentContact"
                      render={({ field }) => (
                        <FormItem><FormLabel>Contact Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="parentEmail"
                      render={({ field }) => (
                        <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="parentOccupation"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel>Occupation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel>Home Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-end gap-3 sticky bottom-4 z-10 bg-background/80 backdrop-blur p-4 rounded-xl border shadow-lg">
               <Button type="button" variant="outline" asChild><Link href="/dashboard/students">Discard</Link></Button>
               <Button type="submit" className="px-10 font-bold"><Save className="mr-2 h-4 w-4" /> Finalize Admission</Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardShell>
  );
}
