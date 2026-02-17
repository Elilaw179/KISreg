
"use client";

import React from 'react';
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
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_STUDENTS } from '@/lib/mock-data';
import Link from 'next/link';

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const student = MOCK_STUDENTS.find(s => s.id === params.id);

  if (!student) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h2 className="text-2xl font-bold">Student Not Found</h2>
          <Button asChild>
            <Link href="/dashboard/students">Back to Directory</Link>
          </Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6">
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
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/students/${student.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Record
              </Link>
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <Card className="lg:col-span-1 shadow-sm border overflow-hidden">
            <div className="bg-primary h-24 relative">
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 h-24 w-24 rounded-2xl border-4 border-white overflow-hidden bg-white shadow-lg">
                <img 
                  src={student.photoUrl || 'https://placehold.co/100'} 
                  alt={student.fullName} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
            <CardHeader className="pt-16 text-center space-y-2">
              <CardTitle className="text-2xl font-bold">{student.fullName}</CardTitle>
              <div className="flex items-center justify-center gap-2">
                <Badge variant={student.status === 'Active' ? 'default' : 'secondary'}>
                  {student.status}
                </Badge>
                <span className="text-sm font-medium px-2 py-0.5 bg-muted rounded text-muted-foreground">
                  {student.admissionNumber}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-muted rounded-lg shrink-0">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Current Class</p>
                  <p className="font-medium">{student.class}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-muted rounded-lg shrink-0">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Admission Date</p>
                  <p className="font-medium">{new Date(student.dateOfAdmission).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-muted rounded-lg shrink-0">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Date of Birth</p>
                  <p className="font-medium">{new Date(student.dateOfBirth).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Info Tabs/Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-lg">Detailed Information</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 border-b">
                  <div className="p-6 border-b md:border-b-0 md:border-r">
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-4 text-primary">
                      <User className="h-4 w-4" />
                      Guardian Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Guardian Name</p>
                        <p className="font-medium text-lg">{student.parentName}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                          <Phone className="h-4 w-4" />
                        </div>
                        <p className="font-medium">{student.parentContact}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-4 text-primary">
                      <MapPin className="h-4 w-4" />
                      Address Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Full Address</p>
                        <p className="font-medium leading-relaxed">{student.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-sm font-semibold flex items-center gap-2 mb-4 text-primary">
                    <School className="h-4 w-4" />
                    Academic History
                  </h3>
                  <div className="bg-muted/30 p-4 rounded-xl border border-dashed flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Previous School</p>
                      <p className="font-medium">{student.previousSchool}</p>
                    </div>
                    <Badge variant="outline" className="bg-white">Transferred</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activities</CardTitle>
                <CardDescription>Administrative actions related to this student.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-1 bg-primary rounded-full" />
                    <div>
                      <p className="text-sm font-medium">Record Created</p>
                      <p className="text-xs text-muted-foreground">Admin updated basic information • 2 months ago</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1 bg-accent rounded-full" />
                    <div>
                      <p className="text-sm font-medium">Passport Photo Uploaded</p>
                      <p className="text-xs text-muted-foreground">Admission processing complete • 2 months ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
