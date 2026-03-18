
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
  UploadCloud
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
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';

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
  status: z.enum(['Active', 'Inactive']),
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
      status: 'Active',
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

    addDocumentNonBlocking(collection(db, 'staffs'), teacherData);
    router.push('/dashboard/teachers');
  };

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href="/dashboard/teachers">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="space-y-0.5">
            <h2 className="text-3xl font-headline font-black text-primary tracking-tight">Staff Enrollment</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Professional Entry</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                <Card className="shadow-sm border-none bg-white rounded-3xl overflow-hidden">
                  <CardHeader className="bg-muted/20 border-b py-4 px-8">
                    <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-primary">
                      <User className="h-5 w-5" /> 
                      Core Bio-Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-6 pt-8 px-8 pb-10">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name (Surname First)</FormLabel>
                        <FormControl><Input placeholder="e.g. OKORO, Chidi James" className="h-12 rounded-xl" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Official Email</FormLabel>
                        <FormControl><Input placeholder="staff@kourrklys.edu.ng" className="h-12 rounded-xl" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</FormLabel>
                        <FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date of Birth</FormLabel>
                        <FormControl><Input type="date" className="h-12 rounded-xl" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="nationality" render={({ field }) => (
                      <FormItem><FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nationality</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="maritalStatus" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Marital Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger></FormControl>
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
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Residential Address</FormLabel>
                        <FormControl><Textarea className="min-h-[80px] rounded-xl" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-none bg-white rounded-3xl overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b py-4 px-8">
                    <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-primary">
                      <Heart className="h-5 w-5" /> 
                      Next of Kin (Emergency)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-6 pt-8 px-8 pb-10">
                    <FormField control={form.control} name="nextOfKin.name" render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">NOK Full Name</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="nextOfKin.relationship" render={({ field }) => (
                      <FormItem><FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Relationship</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="nextOfKin.phone" render={({ field }) => (
                      <FormItem><FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">NOK Contact Phone</FormLabel><FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="nextOfKin.address" render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">NOK Address</FormLabel><FormControl><Textarea className="min-h-[80px] rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-4 space-y-8">
                <Card className="shadow-sm border-none bg-white rounded-3xl overflow-hidden">
                  <CardHeader className="pb-3 px-6 pt-6">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Passport Photo</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-4 px-6 pb-6">
                    <div className="w-full aspect-square rounded-2xl border-2 border-dashed border-primary/10 flex items-center justify-center bg-muted/20 overflow-hidden relative group transition-all hover:bg-muted/30">
                      {photoPreview ? (
                        <>
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setPhotoPreview(null)} className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full shadow-lg"><X className="h-4 w-4" /></button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-muted-foreground p-6 text-center">
                          <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <UploadCloud className="h-6 w-6 text-primary" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest">Upload Portrait</span>
                        </div>
                      )}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handlePhotoChange} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-none bg-primary/5 rounded-3xl overflow-hidden">
                  <CardHeader className="border-b bg-white/50 py-4 px-6">
                    <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-primary">
                      <BadgeCheck className="h-4 w-4" /> 
                      Employment Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-5 px-6 pb-8">
                    <FormField control={form.control} name="staffId" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Staff Registry ID</FormLabel>
                        <FormControl><Input placeholder="KIS/STAFF/001" className="h-11 rounded-xl bg-white border-transparent focus:border-primary/20" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="designation" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Official Designation</FormLabel>
                        <FormControl><Input placeholder="e.g. Senior Educator" className="h-11 rounded-xl bg-white border-transparent focus:border-primary/20" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="department" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Department</FormLabel>
                        <FormControl><Input placeholder="e.g. Humanities" className="h-11 rounded-xl bg-white border-transparent focus:border-primary/20" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="status" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Initial Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="h-11 rounded-xl bg-white border-transparent focus:border-primary/20"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="qualification" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Academic Qualification</FormLabel>
                        <FormControl><Input placeholder="e.g. M.Ed (Education)" className="h-11 rounded-xl bg-white border-transparent focus:border-primary/20" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="dateOfJoining" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Joining Date</FormLabel>
                        <FormControl><Input type="date" className="h-11 rounded-xl bg-white border-transparent focus:border-primary/20" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-end gap-3 sticky bottom-4 z-20 bg-background/90 backdrop-blur-md p-4 rounded-2xl border shadow-xl">
               <Button type="button" variant="outline" className="rounded-xl px-6 h-12 font-bold" asChild disabled={form.formState.isSubmitting}>
                 <Link href="/dashboard/teachers">Discard Registry</Link>
               </Button>
               <Button type="submit" className="px-12 h-12 font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting ? (
                   <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                 ) : (
                   <><Save className="mr-2 h-4 w-4" /> Finalize Registry</>
                 )}
               </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardShell>
  );
}
