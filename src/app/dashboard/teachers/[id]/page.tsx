
"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { 
  ArrowLeft, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Heart, 
  Globe,
  User,
  Trash2,
  AlertCircle,
  Award,
  CalendarCheck,
  Loader2,
  UserCheck,
  UserX
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
import { useFirestore, useDoc, useUser, useMemoFirebase, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';

export default function TeacherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { user } = useUser();
  const teacherId = params.id as string;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const teacherRef = useMemoFirebase(() => {
    if (!db || !teacherId || !user) return null;
    return doc(db, 'staffs', teacherId);
  }, [db, teacherId, user]);

  const { data: teacher, loading } = useDoc(teacherRef);

  const toggleStatus = () => {
    if (!teacherRef || !teacher) return;
    const newStatus = teacher.status === 'Active' ? 'Inactive' : 'Active';
    updateDocumentNonBlocking(teacherRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
  };

  const handleDelete = () => {
    if (!teacherRef) return;
    deleteDocumentNonBlocking(teacherRef);
    router.push('/dashboard/teachers');
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary opacity-30" />
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Syncing Staff Bio...</p>
        </div>
      </DashboardShell>
    );
  }

  if (!teacher) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-primary">Record Unavailable</h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">This staff record may have been deleted or is currently being updated in the database.</p>
          </div>
          <Button className="rounded-xl font-bold px-8 shadow-lg shadow-primary/10" asChild>
            <Link href="/dashboard/teachers">Return to Management</Link>
          </Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5" asChild>
              <Link href="/dashboard/teachers">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="space-y-0.5">
              <h2 className="text-3xl font-headline font-black text-primary tracking-tight">Staff Profile</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Kourrklys Professional Registry</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="rounded-xl font-bold shadow-sm" asChild>
              <Link href={`/dashboard/teachers/${teacher.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
            <Button 
              variant={teacher.status === 'Inactive' ? 'default' : 'secondary'} 
              size="sm" 
              className="rounded-xl font-bold shadow-sm"
              onClick={toggleStatus}
            >
              {teacher.status === 'Inactive' ? (
                <><UserCheck className="mr-2 h-4 w-4" /> Re-Activate</>
              ) : (
                <><UserX className="mr-2 h-4 w-4" /> Deactivate</>
              )}
            </Button>
            <Button variant="destructive" size="sm" className="rounded-xl font-bold shadow-md shadow-destructive/20" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Record
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <Card className="shadow-xl border-none overflow-hidden rounded-3xl group">
              <div className="h-32 bg-primary relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 group-hover:scale-110 transition-transform duration-700">
                  <Award className="h-24 w-24 text-white" />
                </div>
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 h-32 w-32 rounded-3xl border-4 border-white overflow-hidden bg-white shadow-2xl transition-transform duration-500 group-hover:scale-105">
                  <img src={teacher.photoUrl || 'https://picsum.photos/seed/admin/200/200'} alt={teacher.fullName} className="w-full h-full object-cover" />
                </div>
              </div>
              <CardHeader className="pt-20 text-center space-y-1">
                <CardTitle className="text-2xl font-black text-primary">{teacher.fullName}</CardTitle>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-black text-[10px] tracking-widest px-4">
                    {teacher.staffId}
                  </Badge>
                  <Badge variant={teacher.status === 'Inactive' ? 'secondary' : 'default'} className={teacher.status === 'Inactive' ? 'opacity-60' : 'bg-green-100 text-green-700 hover:bg-green-100'}>
                    {teacher.status || 'Active'}
                  </Badge>
                </div>
                <p className="text-sm font-black text-muted-foreground/60 pt-2 uppercase tracking-tight">{teacher.designation || 'Faculty Member'}</p>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 border-t px-8 pb-10">
                <div className="flex items-center gap-4 text-sm group/item">
                  <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary transition-colors group-hover/item:bg-primary group-hover/item:text-white shadow-sm border border-primary/5">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Email Identifier</p>
                    <p className="font-bold truncate text-primary/80">{teacher.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm group/item">
                  <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary transition-colors group-hover/item:bg-primary group-hover/item:text-white shadow-sm border border-primary/5">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Mobile Connect</p>
                    <p className="font-bold text-primary/80">{teacher.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-primary/5 rounded-3xl">
              <CardHeader className="pb-3 border-b bg-white/40 rounded-t-3xl">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Expertise Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1.5">Official Qualification</p>
                  <p className="font-black text-sm text-primary leading-tight">{teacher.qualification || 'Not Specified'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1.5">Assigned Department</p>
                  <Badge variant="secondary" className="bg-white text-primary font-bold border-primary/5 shadow-sm px-4 py-1">
                    {teacher.department || 'General Admin'}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1.5">Employment Start</p>
                  <p className="font-black text-sm text-primary">{teacher.dateOfJoining ? new Date(teacher.dateOfJoining).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Pending'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-muted/30 border-b py-5">
                <CardTitle className="text-lg font-black text-primary flex items-center gap-3">
                  <User className="h-6 w-6" />
                  Staff Bio-Data & Demographics
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-10 p-10">
                <div className="space-y-8">
                  <div className="group">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-2 group-hover:text-primary transition-colors">Date of Birth</p>
                    <p className="font-bold text-lg flex items-center gap-3"><Calendar className="h-5 w-5 text-primary/30" /> {teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}</p>
                  </div>
                  <div className="group">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-2 group-hover:text-primary transition-colors">Gender Registry</p>
                    <p className="font-black text-primary/80 uppercase tracking-tight">{teacher.gender}</p>
                  </div>
                  <div className="group">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-2 group-hover:text-primary transition-colors">National Identity</p>
                    <p className="font-bold text-lg flex items-center gap-3"><Globe className="h-5 w-5 text-primary/30" /> {teacher.nationality}</p>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="group">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-2 group-hover:text-primary transition-colors">Marital Status</p>
                    <p className="font-black text-primary/80 uppercase tracking-tight">{teacher.maritalStatus}</p>
                  </div>
                  <div className="group">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-2 group-hover:text-primary transition-colors">Permanent Address</p>
                    <div className="bg-muted/30 p-4 rounded-2xl border border-dashed border-primary/10">
                      <p className="text-sm font-bold leading-relaxed text-primary/70">{teacher.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-primary text-white py-5">
                <CardTitle className="text-lg font-black flex items-center gap-3">
                  <Heart className="h-6 w-6" />
                  Emergency Contact (Next of Kin)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">NOK Full Name</p>
                      <p className="font-black text-2xl text-primary">{teacher.nextOfKin?.name || 'Unspecified'}</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-4 py-1">
                      {teacher.nextOfKin?.relationship || 'Contact'}
                    </Badge>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 bg-primary/5 p-5 rounded-2xl border border-primary/10 group hover:bg-primary transition-all duration-300">
                      <Phone className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest group-hover:text-white/60">Urgent Phone</p>
                        <p className="font-black text-xl text-primary group-hover:text-white">{teacher.nextOfKin?.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 bg-muted/20 p-6 rounded-2xl border border-dashed border-primary/10">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-3">Residential Address for Emergencies</p>
                    <p className="text-sm font-bold text-primary/80 leading-relaxed">{teacher.nextOfKin?.address || 'Address not listed.'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg rounded-2xl">
               <CardHeader className="bg-muted/5 border-b py-4">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-muted-foreground">
                    <CalendarCheck className="h-4 w-4" />
                    System Registry Metadata
                  </CardTitle>
               </CardHeader>
               <CardContent className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-6 px-8 pb-8">
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1">Designation</p>
                    <p className="text-xs font-black text-primary">{teacher.designation || 'Staff'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1">Department</p>
                    <p className="text-xs font-black text-primary">{teacher.department || 'Admin'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1">Staff ID</p>
                    <p className="text-xs font-black text-primary">{teacher.staffId}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1">Joined Date</p>
                    <p className="text-xs font-black text-primary">{teacher.dateOfJoining ? new Date(teacher.dateOfJoining).toLocaleDateString() : 'N/A'}</p>
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
              This action cannot be undone. This will permanently delete <strong>{teacher.fullName}</strong>'s profile and all associated employment records from the school registry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Confirm Deletion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  );
}
