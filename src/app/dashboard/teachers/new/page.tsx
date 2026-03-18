
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
  Heart, 
  X,
  Loader2,
  BadgeCheck,
  Briefcase,
  Globe,
  Mail,
  Phone,
  Calendar,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
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

    toast({ title: "Staff Registered", description: `Official profile created for ${values.fullName}.` });
    router.push('/dashboard/teachers');
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
                  <CardHeader className="bg-muted/30 border-b"><CardTitle className="text-lg flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Bio-Data</CardTitle></CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Official Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                      <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="nationality" render={({ field }) => (
                      <FormItem><FormLabel>Nationality</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="maritalStatus" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marital Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Single">Single</SelectItem>
                            <SelectItem value="Married">Married</SelectItem>
                            <SelectItem value="Divorced">Divorced</SelectItem>
                            <SelectItem value="Widowed">Widowed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel>Residential Address</FormLabel><FormControl><Textarea className="min-h-[80px]" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </CardContent>
                </Card>

                <Card className="border shadow-sm">
                  <CardHeader className="bg-primary/5 border-b text-primary"><CardTitle className="text-lg flex items-center gap-2"><Heart className="h-5 w-5" /> Emergency Contact (NOK)</CardTitle></CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                    <FormField control={form.control} name="nextOfKin.name" render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel>NOK Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="nextOfKin.relationship" render={({ field }) => (
                      <FormItem><FormLabel>Relationship</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="nextOfKin.phone" render={({ field }) => (
                      <FormItem><FormLabel>NOK Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="nextOfKin.address" render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel>NOK Address</FormLabel><FormControl><Textarea className="min-h-[80px]" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-4 space-y-6">
                 <Card className="shadow-sm border-none bg-white mb-6">
                  <CardHeader className="pb-3"><CardTitle className="text-sm font-black uppercase tracking-widest">Passport Photo</CardTitle></CardHeader>
                  <CardContent className="flex flex-col items-center gap-4">
                    <div className="w-full aspect-square rounded-2xl border-2 border-dashed border-primary/10 flex items-center justify-center bg-muted/20 overflow-hidden relative group transition-all">
                      {photoPreview ? (
                        <>
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setPhotoPreview(null)} className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full"><X className="h-4 w-4" /></button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-muted-foreground p-6 text-center">
                          <Upload className="h-6 w-6 text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Upload Photo</span>
                        </div>
                      )}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handlePhotoChange} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border shadow-sm bg-primary/5">
                  <CardHeader className="border-b bg-white/50"><CardTitle className="text-sm font-bold flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-primary" /> Professional Profile</CardTitle></CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <FormField control={form.control} name="staffId" render={({ field }) => (
                      <FormItem><FormLabel>Staff ID</FormLabel><FormControl><Input placeholder="KIS/STAFF/XXX" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="designation" render={({ field }) => (
                      <FormItem><FormLabel>Designation</FormLabel><FormControl><Input placeholder="e.g. Senior Tutor" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="department" render={({ field }) => (
                      <FormItem><FormLabel>Department</FormLabel><FormControl><Input placeholder="e.g. Sciences" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="qualification" render={({ field }) => (
                      <FormItem><FormLabel>Qualification</FormLabel><FormControl><Input placeholder="e.g. B.Sc (Ed)" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="dateOfJoining" render={({ field }) => (
                      <FormItem><FormLabel>Date of Joining</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-end gap-3 sticky bottom-4 z-10 bg-background/80 backdrop-blur p-4 rounded-xl border shadow-lg">
               <Button type="button" variant="outline" asChild disabled={form.formState.isSubmitting}><Link href="/dashboard/teachers">Cancel</Link></Button>
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
