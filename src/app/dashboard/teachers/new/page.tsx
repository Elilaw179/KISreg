
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
  Calendar,
  Heart,
  BadgeCheck,
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
  fullName: z.string().min(3, "Full name is required (minimum 3 characters)"),
  staffId: z.string().min(3, "Staff ID is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(['Male', 'Female', 'Other']),
  nationality: z.string().min(2, "Nationality is required"),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']),
  phone: z.string().min(5, "Valid phone number is required"),
  email: z.string().email("Invalid official email address"),
  address: z.string().min(10, "Full residential address is required"),
  designation: z.string().min(2, "Designation is required"),
  department: z.string().min(2, "Department is required"),
  qualification: z.string().min(2, "Primary qualification is required"),
  dateOfJoining: z.string().min(1, "Date of joining is required"),
  nextOfKin: z.object({
    name: z.string().min(3, "NOK full name is required"),
    relationship: z.string().min(2, "Relationship is required"),
    phone: z.string().min(5, "NOK contact number is required"),
    address: z.string().min(10, "NOK residential address is required"),
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
      nextOfKin: {
        name: '',
        relationship: '',
        phone: '',
        address: '',
      },
    }
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 500) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Passport photo must be under 500KB."
        });
        return;
      }
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

    // Non-blocking write: initiate and proceed immediately
    addDoc(collection(db, 'teachers'), teacherData)
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: 'teachers',
          operation: 'create',
          requestResourceData: teacherData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    // Immediate navigation using local cache
    router.push('/dashboard/teachers');
    toast({
      title: "Registration Initiated",
      description: `${values.fullName}'s staff profile is being synchronized.`,
    });
  };

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/teachers">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h2 className="text-3xl font-headline font-bold text-primary">Staff Registration</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                <Card className="border-none shadow-sm">
                  <CardHeader className="bg-muted/30 border-b">
                    <CardTitle className="text-lg flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Bio-Data</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Full Name (Surname First)</FormLabel>
                          <FormControl><Input placeholder="e.g. Bakare, Olumide" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl><Input type="date" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Official Email Address</FormLabel>
                          <FormControl><Input type="email" placeholder="staff@kourrklys.edu.ng" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Residential Address</FormLabel>
                          <FormControl><Textarea {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                   <CardHeader className="bg-primary/5 border-b text-primary">
                     <CardTitle className="text-lg flex items-center gap-2"><Heart className="h-5 w-5" /> Next of Kin (Emergency Contact)</CardTitle>
                   </CardHeader>
                   <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                      <FormField
                        control={form.control}
                        name="nextOfKin.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>NOK Full Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nextOfKin.relationship"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nextOfKin.phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>NOK Phone</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nextOfKin.address"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>NOK Address</FormLabel>
                            <FormControl><Textarea {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                   </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-4 space-y-6">
                 <Card className="border-none shadow-sm">
                  <CardHeader><CardTitle className="text-sm font-bold">Passport Photo</CardTitle></CardHeader>
                  <CardContent className="flex flex-col items-center gap-4">
                    <div className="w-full aspect-square max-w-[200px] rounded-2xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center bg-muted/30 overflow-hidden relative group">
                      {photoPreview ? (
                        <>
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setPhotoPreview(null)} className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full hover:scale-110 transition-transform shadow-lg z-10"><X className="h-4 w-4" /></button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 text-center">
                          <Upload className="h-8 w-8 opacity-50" />
                          <span className="text-xs">Click to upload staff photo</span>
                        </div>
                      )}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handlePhotoChange} />
                    </div>
                  </CardContent>
                </Card>

                 <Card className="border-none shadow-sm">
                    <CardHeader className="border-b"><CardTitle className="text-sm font-bold">Employment Details</CardTitle></CardHeader>
                    <CardContent className="pt-4 space-y-4">
                       <FormField
                         control={form.control}
                         name="staffId"
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel>Staff ID</FormLabel>
                             <FormControl><Input placeholder="KIS/STAFF/..." {...field} /></FormControl>
                             <FormMessage />
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name="designation"
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel>Designation</FormLabel>
                             <FormControl><Input placeholder="e.g., Senior Teacher" {...field} /></FormControl>
                             <FormMessage />
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name="department"
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel>Department</FormLabel>
                             <FormControl><Input placeholder="e.g., Languages" {...field} /></FormControl>
                             <FormMessage />
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name="qualification"
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel>Primary Qualification</FormLabel>
                             <FormControl><Input placeholder="e.g., B.Sc Ed" {...field} /></FormControl>
                             <FormMessage />
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name="dateOfJoining"
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel>Joining Date</FormLabel>
                             <FormControl><Input type="date" {...field} /></FormControl>
                             <FormMessage />
                           </FormItem>
                         )}
                       />
                    </CardContent>
                 </Card>
              </div>
            </div>

            <div className="flex justify-end gap-3 sticky bottom-4 z-10 bg-background/80 backdrop-blur p-4 rounded-xl border shadow-lg">
               <Button type="button" variant="outline" asChild disabled={form.formState.isSubmitting}>
                 <Link href="/dashboard/teachers">Cancel</Link>
               </Button>
               <Button type="submit" className="px-10 font-bold" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Registering...
                   </>
                 ) : (
                   <>
                     <Save className="mr-2 h-4 w-4" /> 
                     Register Staff
                   </>
                 )}
               </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardShell>
  );
}
