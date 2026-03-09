
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
  School, 
  Phone, 
  Globe, 
  Stethoscope, 
  Mail, 
  Briefcase,
  Home,
  Check,
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
import { CLASSES } from '@/lib/mock-data';
import Link from 'next/link';
import { useFirestore, useDoc } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const studentFormSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  admissionNumber: z.string().min(3, "Admission number is required"),
  dateOfBirth: z.string().min(1, "DOB is required"),
  gender: z.enum(['Male', 'Female', 'Other']),
  class: z.string().min(1, "Class selection is required"),
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
  status: z.enum(['Active', 'Withdrawn']),
});

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const db = useFirestore();
  const studentId = params.id as string;

  const studentRef = useMemo(() => {
    if (!db || !studentId) return null;
    return doc(db, 'students', studentId);
  }, [db, studentId]);

  const { data: student, loading } = useDoc(studentRef);

  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      fullName: '',
      admissionNumber: '',
      dateOfBirth: '',
      gender: 'Male',
      class: '',
      dateOfAdmission: '',
      nationality: 'Nigerian',
      parentName: '',
      parentContact: '',
      parentEmail: '',
      parentOccupation: '',
      address: '',
      bloodGroup: '',
      medicalInfo: '',
      previousSchool: '',
      status: 'Active',
    }
  });

  useEffect(() => {
    if (student) {
      form.reset({
        ...student,
        bloodGroup: student.bloodGroup || '',
        medicalInfo: student.medicalInfo || '',
        previousSchool: student.previousSchool || '',
        parentEmail: student.parentEmail || '',
        parentOccupation: student.parentOccupation || '',
      });
    }
  }, [student, form]);

  const onSubmit = async (values: z.infer<typeof studentFormSchema>) => {
    if (!studentRef) return;

    const updateData = {
      ...values,
      updatedAt: serverTimestamp(),
    };

    try {
      await updateDoc(studentRef, updateData);
      router.push(`/dashboard/students/${studentId}`);
    } catch (error) {
      const permissionError = new FirestorePermissionError({
        path: studentRef.path,
        operation: 'update',
        requestResourceData: updateData,
      });
      errorEmitter.emit('permission-error', permissionError);
    }
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

  if (!student) {
    return (
      <DashboardShell>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold">Student not found</h2>
          <Button variant="link" asChild><Link href="/dashboard/students">Back to Directory</Link></Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/students/${studentId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h2 className="text-3xl font-headline font-bold text-primary">Edit Student Record</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                {/* Personal Details */}
                <Card className="shadow-sm border">
                  <CardHeader className="bg-muted/30 border-b">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Student Bio-Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Full Name (Surname First)</FormLabel>
                          <FormControl><Input placeholder="Thompson, Adewale" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="admissionNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admission Number</FormLabel>
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
                          <FormControl>
                            <div className="relative">
                              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" {...field} />
                            </div>
                          </FormControl>
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
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Guardian Details */}
                <Card className="shadow-sm border">
                  <CardHeader className="bg-muted/30 border-b">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      Guardian & Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                    <FormField
                      control={form.control}
                      name="parentName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Guardian's Full Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="parentContact"
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
                      name="parentEmail"
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
                      name="parentOccupation"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Occupation</FormLabel>
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
                          <FormControl><Textarea className="min-h-[80px]" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Academic & Medical Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <Card className="shadow-sm border">
                  <CardHeader className="bg-primary/5 border-b">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <School className="h-4 w-4 text-primary" />
                      Academic Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <FormField
                      control={form.control}
                      name="class"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Enrollment Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="shadow-sm border">
                  <CardHeader className="bg-red-50 border-b">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-red-900">
                      <Stethoscope className="h-4 w-4" />
                      Medical Brief
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <FormField
                      control={form.control}
                      name="bloodGroup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Group</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="medicalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl><Textarea className="min-h-[100px] text-xs" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-end gap-3 sticky bottom-4 z-10 bg-background/80 backdrop-blur p-4 rounded-xl border shadow-lg">
               <Button type="button" variant="outline" asChild disabled={form.formState.isSubmitting}>
                 <Link href={`/dashboard/students/${studentId}`}>Cancel</Link>
               </Button>
               <Button type="submit" className="px-8 font-bold" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Saving...
                   </>
                 ) : (
                   <>
                     <Save className="mr-2 h-4 w-4" /> 
                     Save Changes
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
