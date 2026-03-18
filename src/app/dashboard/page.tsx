
"use client";

import React, { useMemo } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { 
  Users, 
  UserCheck, 
  UserX, 
  School,
  Loader2,
  TrendingUp,
  ArrowUpRight,
  BadgeCheck
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  Cell
} from 'recharts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

const SECONDARY_CLASSES = ['JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3'];

export default function DashboardPage() {
  const db = useFirestore();
  const { user } = useUser();
  
  const studentsQuery = useMemoFirebase(() => {
    // Only create the query if both the database and the user (auth state) are available.
    // This prevents "Missing or insufficient permissions" during the initial load.
    if (!db || !user) return null;
    return query(collection(db, 'students'), orderBy('createdAt', 'desc'));
  }, [db, user]);

  const { data: students, loading } = useCollection(studentsQuery);

  const stats = useMemo(() => {
    if (!students) return { total: 0, active: 0, withdrawn: 0 };
    return {
      total: students.length,
      active: students.filter((s: any) => s.status === 'Active').length,
      withdrawn: students.filter((s: any) => s.status === 'Withdrawn').length,
    };
  }, [students]);

  const classData = useMemo(() => {
    if (!students) return [];
    return SECONDARY_CLASSES.map(className => ({
      name: className,
      count: students.filter((s: any) => s.class === className).length
    }));
  }, [students]);

  const recentStudents = useMemo(() => {
    if (!students) return [];
    return students.slice(0, 4);
  }, [students]);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Synchronizing Registry...</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-4xl font-headline font-black tracking-tight text-primary">Overview</h2>
            <p className="text-muted-foreground font-medium">Kourrklys International School Administrative Intelligence.</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-10 rounded-xl font-bold" asChild>
              <Link href="/dashboard/students/new">Admission Form</Link>
            </Button>
            <Button size="sm" className="h-10 rounded-xl font-bold shadow-lg shadow-primary/20" asChild>
              <Link href="/dashboard/students">Student Directory</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover-lift border-none shadow-sm group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Enrollment</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary">{stats.total}</div>
              <div className="flex items-center gap-1 mt-1 text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span className="text-[10px] font-bold">Live Registry</span>
              </div>
            </CardContent>
          </Card>
          <Card className="hover-lift border-none shadow-sm group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Active</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-green-700">{stats.active}</div>
            </CardContent>
          </Card>
          <Card className="hover-lift border-none shadow-sm group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Withdrawn</CardTitle>
              <UserX className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-destructive/80">{stats.withdrawn}</div>
            </CardContent>
          </Card>
          <Card className="hover-lift border-none shadow-sm group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">School Stats</CardTitle>
              <School className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-amber-700">98%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline font-black text-xl flex items-center gap-2">Secondary Distribution <BadgeCheck className="h-5 w-5 text-primary" /></CardTitle>
              <CardDescription>Enrollment across JSS 1 to SS 3</CardDescription>
            </CardHeader>
            <CardContent className="pl-2 pb-6">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classData}>
                    <XAxis dataKey="name" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} />
                    <YAxis fontSize={11} fontWeight={700} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(60, 89, 155, 0.05)', radius: 8 }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                      {classData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3c599b' : '#5a78bd'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3 border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-headline font-black text-xl">Recently Admitted</CardTitle>
                  <CardDescription>Latest system entries</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/students">View All <ArrowUpRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentStudents.length > 0 ? (
                  recentStudents.map((student: any) => (
                    <div key={student.id} className="flex items-center gap-4 p-2 rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="h-10 w-10 rounded-lg bg-secondary overflow-hidden shrink-0 border">
                        <img src={student.photoUrl || 'https://placehold.co/100'} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <p className="text-sm font-bold text-primary">{student.fullName}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase">{student.class} • {student.admissionNumber}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground uppercase text-[10px] font-black tracking-widest">No Recent Data</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
