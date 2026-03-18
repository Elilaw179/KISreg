
"use client";

import React, { useEffect } from 'react';
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
  Stethoscope, 
  Mail, 
  Briefcase,
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
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

const studentFormSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  admissionNumber: z.string().min(3, "Admission number is required"),
  dateOfBirth: z.string().min(1, "DOB is required"),
  gender: z.enum(['Male', 'Female', 'Other']),
  class: z.string().min(1, "Class is required"),
  parentName: z.string().min(3, "Guardian name is required"),
  parentContact: z.string().min(5, "Contact is required"),
  parentEmail: z.string().email("Invalid email"),
  parentOccupation: z.string().min(2, "Occupation is required"),
  address: z.string().min(10, "Address is required"),
  status: z.enum(['Active', 'Withdrawn']),
  bloodGroup: z.string().optional(),
  medicalInfo: z.string().optional(),
});

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { toast } = useToast();
  const studentId = params.id as string;

  const studentRef = useMemoFirebase(() => {
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
      parentName: '',
      parentContact: '',
      parentEmail: '',
      parentOccupation: '',
      address: '',
      status: 'Active',
      bloodGroup: '',
      medicalInfo: '',
    }
  });

  useEffect(() => {
    if (student) {
      form.reset({
        fullName: student.fullName || '',
        admissionNumber: student.admissionNumber || '',
        dateOfBirth: student.dateOfBirth || '',
        gender: (student.gender as any) || 'Male',
        class: student.class || '',
        parentName: student.parentName || '',
        parentContact: student.parentContact || '',
        parentEmail: student.parentEmail || '',
        parentOccupation: student.parentOccupation || '',
        address: student.address || '',
        status: (student.status as any) || 'Active',
        bloodGroup: student.bloodGroup || '',
        medicalInfo: student.medicalInfo || '',
      });
    }
  }, [student, form]);

  const onSubmit = (values: z.infer<typeof studentFormSchema>) => {
    if (!studentRef) return;

    const updateData = {
      ...values,
      updatedAt: serverTimestamp(),
    };

    updateDoc(studentRef, updateData)
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: studentRef.path,
          operation: 'update',
          requestResourceData: updateData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    router.push(`/dashboard/students/${studentId}`);
    toast({
      title: "Update Saved",
      description: "Student record has been successfully modified.",
    });
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild><Link href={`/dashboard/students/${studentId}`}><ArrowLeft className="h-5 w-5" /></Link></Button>
          <h2 className="text-3xl font-headline font-bold text-primary">Modify Student Record</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                <Card className="border shadow-sm">
                  <CardHeader className="bg-muted/30 border-b"><CardTitle className="text-lg">Bio-Data</CardTitle></CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="admissionNumber" render={({ field }) => (
                      <FormItem><FormLabel>Admission No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="class" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>

                <Card className="border shadow-sm">
                  <CardHeader className="bg-muted/30 border-b"><CardTitle className="text-lg">Guardian Details</CardTitle></CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                    <FormField control={form.control} name="parentName" render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel>Guardian Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="parentEmail" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="parentOccupation" render={({ field }) => (
                      <FormItem><FormLabel>Occupation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <Card className="border shadow-sm bg-primary/5">
                  <CardHeader className="border-b bg-white/50"><CardTitle className="text-sm font-bold">Status Controls</CardTitle></CardHeader>
                  <CardContent className="pt-4">
                    <FormField control={form.control} name="status" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enrollment Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Withdrawn">Withdrawn</SelectItem></SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-end gap-3 sticky bottom-4 z-10 bg-background/80 backdrop-blur p-4 rounded-xl border shadow-lg">
               <Button type="button" variant="outline" asChild disabled={form.formState.isSubmitting}><Link href={`/dashboard/students/${studentId}`}>Cancel</Link></Button>
               <Button type="submit" className="px-10 font-bold" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
               </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardShell>
  );
}
