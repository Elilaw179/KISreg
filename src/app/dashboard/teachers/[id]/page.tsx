
"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { 
  ArrowLeft, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Briefcase, 
  BookOpen, 
  ShieldCheck, 
  Heart, 
  Globe,
  User,
  Trash2,
  AlertCircle,
  GraduationCap,
  CalendarCheck,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_TEACHERS } from '@/lib/mock-data';
import Link from 'next/link';

export default function TeacherDetailPage() {
  const params = useParams();
  const teacher = MOCK_TEACHERS.find(t => t.id === params.id);

  if (!teacher) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="text-2xl font-bold text-muted-foreground">Staff Member Not Found</h2>
          <Button asChild><Link href="/dashboard/teachers">Back to List</Link></Button>
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
              <Link href="/dashboard/teachers">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h2 className="text-3xl font-headline font-bold text-primary">Staff Profile</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="shadow-sm" asChild>
              <Link href={`/dashboard/teachers/${teacher.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Record
              </Link>
            </Button>
            <Button variant="destructive" size="sm" className="shadow-sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Header Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-md border-none overflow-hidden">
              <div className="h-32 bg-primary relative">
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 h-32 w-32 rounded-3xl border-4 border-white overflow-hidden bg-white shadow-xl">
                  <img src={teacher.photoUrl || 'https://placehold.co/400'} alt={teacher.fullName} className="w-full h-full object-cover" />
                </div>
              </div>
              <CardHeader className="pt-20 text-center space-y-1">
                <CardTitle className="text-2xl font-bold">{teacher.fullName}</CardTitle>
                <Badge variant="outline" className="mx-auto bg-primary/5 text-primary border-primary/20">
                  {teacher.staffId}
                </Badge>
                <p className="text-sm font-bold text-muted-foreground pt-2">{teacher.designation}</p>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="font-medium">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="font-medium">{teacher.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-medium text-xs leading-relaxed">{teacher.address}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-primary/5">
              <CardHeader className="pb-2 border-b bg-white/50">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Professional Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Qualification</p>
                  <p className="font-bold text-sm leading-tight">{teacher.qualification}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Department</p>
                  <Badge variant="secondary" className="mt-1">{teacher.department}</Badge>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Joined KIS On</p>
                  <p className="font-bold text-sm">{new Date(teacher.dateOfJoining).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Bio-Data
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-8 pt-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Date of Birth</p>
                    <p className="font-bold flex items-center gap-2"><Calendar className="h-4 w-4 text-primary/40" /> {new Date(teacher.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Gender</p>
                    <p className="font-bold">{teacher.gender}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Nationality</p>
                    <p className="font-bold flex items-center gap-2"><Globe className="h-4 w-4 text-primary/40" /> {teacher.nationality}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Marital Status</p>
                    <p className="font-bold">{teacher.maritalStatus}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Residential Address</p>
                    <p className="text-sm font-medium leading-relaxed bg-muted/50 p-3 rounded-lg border border-dashed">{teacher.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-primary text-white">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Next of Kin (Emergency Contact)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Full Name</p>
                      <p className="font-bold text-xl">{teacher.nextOfKin.name}</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-none text-xs px-3">{teacher.nextOfKin.relationship}</Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-primary/10">
                      <Phone className="h-6 w-6 text-primary" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Contact Number</p>
                        <p className="font-bold text-lg">{teacher.nextOfKin.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 bg-muted/30 p-4 rounded-xl border border-dashed border-muted-foreground/20">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-2">Residential Address</p>
                    <p className="text-sm font-medium leading-relaxed">{teacher.nextOfKin.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
               <CardHeader className="bg-muted/10 border-b py-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4" />
                    Employment Details Summary
                  </CardTitle>
               </CardHeader>
               <CardContent className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Designation</p>
                    <p className="text-xs font-semibold">{teacher.designation}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Department</p>
                    <p className="text-xs font-semibold">{teacher.department}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Staff ID</p>
                    <p className="text-xs font-semibold">{teacher.staffId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Joining Date</p>
                    <p className="text-xs font-semibold">{new Date(teacher.dateOfJoining).toLocaleDateString()}</p>
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
