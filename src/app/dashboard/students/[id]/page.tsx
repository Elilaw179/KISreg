
"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { 
  ArrowLeft, 
  Edit, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  BookOpen, 
  User, 
  Trash2, 
  AlertTriangle, 
  Globe, 
  Stethoscope, 
  Droplet, 
  School, 
  Mail, 
  Briefcase, 
  Info,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from 'next/link';
import { useFirestore, useDoc, useUser, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { user } = useUser();
  const studentId = params.id as string;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const studentRef = useMemoFirebase(() => {
    if (!db || !studentId || !user) return null;
    return doc(db, 'students', studentId);
  }, [db, studentId, user]);

  const { data: student, loading } = useDoc(studentRef);

  const handleDelete = () => {
    if (!studentRef) return;
    deleteDocumentNonBlocking(studentRef);
    router.push('/dashboard/students');
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
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h2 className="text-2xl font-bold">Student Record Not Found</h2>
          <Button asChild>
            <Link href="/dashboard/students">Return to Directory</Link>
          </Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/students">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h2 className="text-3xl font-headline font-bold text-primary">Student Profile</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="shadow-sm" asChild>
              <Link href={`/dashboard/students/${student.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Update Record
              </Link>
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="shadow-sm" 
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-md border overflow-hidden">
              <div className="bg-primary h-24 relative">
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 h-28 w-28 rounded-2xl border-4 border-white overflow-hidden bg-white shadow-xl">
                  <img 
                    src={student.photoUrl || 'https://picsum.photos/seed/student/200/200'} 
                    alt={student.fullName} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
              <CardHeader className="pt-16 text-center space-y-2">
                <CardTitle className="text-2xl font-bold">{student.fullName}</CardTitle>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant={student.status === 'Active' ? 'default' : 'secondary'} className="px-3">
                    {student.status}
                  </Badge>
                  <span className="text-sm font-bold px-2 py-0.5 bg-muted rounded text-primary">
                    {student.admissionNumber}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 border-t px-6 pb-8">
                <div className="flex items-center gap-4 text-sm">
                  <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Current Class</p>
                    <p className="font-bold text-lg">{student.class}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Nationality</p>
                    <p className="font-semibold">{student.nationality}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Date of Birth</p>
                    <p className="font-semibold">{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Joined On</p>
                    <p className="font-semibold">{student.dateOfAdmission ? new Date(student.dateOfAdmission).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border overflow-hidden">
              <CardHeader className="bg-red-50 border-b">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-red-900">
                  <Stethoscope className="h-4 w-4" />
                  Medical & Health Brief
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Blood Group</span>
                  <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                    <Droplet className="h-3 w-3 mr-1" />
                    {student.bloodGroup || 'N/A'}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Health Notes / Allergies</p>
                  <p className="text-sm font-medium leading-relaxed bg-muted p-3 rounded-lg border border-dashed">
                    {student.medicalInfo || 'No special conditions reported.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-md border">
              <CardHeader className="border-b bg-muted/20">
                <CardTitle className="text-lg flex items-center gap-2">
                   <Phone className="h-5 w-5 text-primary" />
                   Guardian & Home Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-8 border-b md:border-b-0 md:border-r">
                    <h3 className="text-xs font-black flex items-center gap-2 mb-6 text-primary uppercase tracking-widest">
                      <User className="h-4 w-4" />
                      Primary Contact
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Guardian Name</p>
                        <p className="font-bold text-xl text-primary/90">{student.parentName}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Phone Number</p>
                          <p className="font-bold text-lg">{student.parentContact}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Email Address</p>
                          <p className="font-bold">{student.parentEmail || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Occupation</p>
                          <p className="font-bold">{student.parentOccupation || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xs font-black flex items-center gap-2 mb-6 text-primary uppercase tracking-widest">
                      <MapPin className="h-4 w-4" />
                      Home Address
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-muted/30 p-4 rounded-xl border border-dashed">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-2">Residential Area</p>
                        <p className="font-medium leading-relaxed text-sm">{student.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border">
              <CardHeader className="bg-muted/10 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <School className="h-5 w-5 text-primary" />
                  Academic History & Foundation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex justify-between items-center group">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Previous Institution</p>
                      <p className="font-bold text-lg group-hover:text-primary transition-colors">{student.previousSchool || 'First Enrollment'}</p>
                    </div>
                    <Badge variant="outline" className="bg-white px-4 py-1 text-primary border-primary/20">Verified</Badge>
                  </div>
                  <div className="bg-muted/30 p-6 rounded-2xl border border-dashed flex flex-col justify-center">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Enrollment Basis</p>
                    <p className="text-sm font-medium">Standard school registration book entry confirmed for {student.dateOfAdmission ? new Date(student.dateOfAdmission).getFullYear() : 'N/A'} session.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border">
               <CardHeader className="bg-muted/5 border-b py-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Additional Metadata
                  </CardTitle>
               </CardHeader>
               <CardContent className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Gender</p>
                    <p className="text-sm font-semibold">{student.gender}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">System ID</p>
                    <p className="text-sm font-semibold text-xs truncate">#{student.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Nationality</p>
                    <p className="text-sm font-semibold">{student.nationality}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Admission Date</p>
                    <p className="text-sm font-semibold">{student.dateOfAdmission ? new Date(student.dateOfAdmission).toLocaleDateString() : 'N/A'}</p>
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete <strong>{student.fullName}</strong>'s record from the KIS database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  );
}
