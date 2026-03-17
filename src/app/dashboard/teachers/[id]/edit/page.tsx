
"use client";

import React, { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Briefcase, 
  Phone, 
  Mail, 
  Calendar,
  Heart,
  BadgeCheck,
  Loader2
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
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const teacherFormSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  staffId: z.string().min(3, "Staff ID is required"),
  dateOfBirth: z.string().min(1, "DOB is required"),
  gender: z.enum(['Male', 'Female', 'Other']),
  nationality: z.string().min(2, "Nationality is required"),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']),
  phone: z.string().min(5, "Phone is required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(10, "Address is required"),
  designation: z.string().min(2, "Designation is required"),
  department: z.string().min(2, "Department is required"),
  qualification: z.string().min(2, "Qualification is required"),
  dateOfJoining: z.string().min(1, "Joining date is required"),
  nextOfKin: z.object({
    name: z.string().min(3, "NOK name is required"),
    relationship: z.string().min(2, "Relationship is required"),
    phone: z.string().min(5, "NOK phone is required"),
    address: z.string().min(10, "NOK address is required"),
  }),
});

export default function EditTeacherPage() {
  const params = useParams();
  const router = useRouter();
  const db = useFirestore();
  const teacherId = params.id as string;

  const teacherRef = useMemoFirebase(() => {
    if (!db || !teacherId) return null;
    return doc(db, 'teachers', teacherId);
  }, [db, teacherId]);

  const { data: teacher, loading } = useDoc(teacherRef);

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
      dateOfJoining: '',
      nextOfKin: {
        name: '',
        relationship: '',
        phone: '',
        address: '',
      },
    }
  });

  useEffect(() => {
    if (teacher) {
      form.reset({
        fullName: teacher.fullName || '',
        staffId: teacher.staffId || '',
        dateOfBirth: teacher.dateOfBirth || '',
        gender: teacher.gender || 'Male',
        nationality: teacher.nationality || 'Nigerian',
        maritalStatus: teacher.maritalStatus || 'Single',
        phone: teacher.phone || '',
        email: teacher.email || '',
        address: teacher.address || '',
        designation: teacher.designation || '',
        department: teacher.department || '',
        qualification: teacher.qualification || '',
        dateOfJoining: teacher.dateOfJoining || '',
        nextOfKin: teacher.nextOfKin || { name: '', relationship: '', phone: '', address: '' }
      });
    }
  }, [teacher, form]);

  const onSubmit = async (values: z.infer<typeof teacherFormSchema>) => {
    if (!teacherRef) return;

    const updateData = {
      ...values,
      updatedAt: serverTimestamp(),
    };

    updateDoc(teacherRef, updateData)
      .then(() => {
        router.push(`/dashboard/teachers/${teacherId}`);
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: teacherRef.path,
          operation: 'update',
          requestResourceData: updateData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/teachers/${teacherId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h2 className="text-3xl font-headline font-bold text-primary">Edit Staff Profile</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                <Card className="border-none shadow-sm">
                  <CardHeader className="bg-muted/30 border-b">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Personal Bio-Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Full Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
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
                          <Select onValueChange={field.onChange} value={field.value}>
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
                          <FormLabel>Email Address</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
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
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardHeader className="bg-primary/5 border-b text-primary">
                    <CardTitle className="text-lg flex items-center gap-2"><Heart className="h-5 w-5" /> Next of Kin</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                    <FormField
                      control={form.control}
                      name="nextOfKin.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
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
                          <FormLabel>Phone</FormLabel>
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
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-4 space-y-6">
                 <Card className="border-none shadow-sm bg-primary/5">
                    <CardHeader className="border-b bg-white/50">
                       <CardTitle className="text-sm font-bold flex items-center gap-2"><BadgeCheck className="h-4 w-4" /> Employment Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                       <FormField
                         control={form.control}
                         name="staffId"
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel>Staff ID</FormLabel>
                             <FormControl><Input {...field} /></FormControl>
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
                             <FormControl><Input {...field} /></FormControl>
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
                             <FormControl><Input {...field} /></FormControl>
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
                 <Link href={`/dashboard/teachers/${teacherId}`}>Discard</Link>
               </Button>
               <Button type="submit" className="px-10 font-bold" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Saving...
                   </>
                 ) : (
                   <>
                     <Save className="mr-2 h-4 w-4" /> 
                     Save Record
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
