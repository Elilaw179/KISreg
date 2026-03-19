"use client";

import React, { useMemo } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  School,
  Loader2,
  TrendingUp,
  ArrowUpRight,
  BadgeCheck,
  Zap,
  Clock,
  BookOpen,
  UserX,
  Award,
  Trophy
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { FormattedDate } from '@/components/formatted-date';

const SECONDARY_CLASSES = ['JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3'];
const PRIMARY_CLASSES = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

export default function DashboardPage() {
  const db = useFirestore();
  const { user } = useUser();
  
  const studentsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'students');
  }, [db, user]);

  const staffQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'staffs');
  }, [db, user]);

  const { data: students, isLoading: studentsLoading } = useCollection(studentsQuery);
  const { data: staffs, isLoading: staffLoading } = useCollection(staffQuery);

  const stats = useMemo(() => {
    if (!students) return { total: 0, primary: 0, secondary: 0, staff: 0, withdrawn: 0, gradPrimary: 0, gradSecondary: 0 };
    
    const activeStudents = students.filter((s: any) => s.status === 'Active');
    const withdrawnStudents = students.filter((s: any) => s.status === 'Withdrawn');
    const graduatedStudents = students.filter((s: any) => s.status === 'Graduated');
    
    return {
      total: activeStudents.length,
      primary: activeStudents.filter((s: any) => PRIMARY_CLASSES.includes(s.class)).length,
      secondary: activeStudents.filter((s: any) => SECONDARY_CLASSES.includes(s.class)).length,
      staff: staffs?.length || 0,
      withdrawn: withdrawnStudents.length,
      gradPrimary: graduatedStudents.filter((s: any) => PRIMARY_CLASSES.includes(s.class)).length,
      gradSecondary: graduatedStudents.filter((s: any) => SECONDARY_CLASSES.includes(s.class)).length
    };
  }, [students, staffs]);

  const secondaryClassData = useMemo(() => {
    if (!students) return [];
    return SECONDARY_CLASSES.map(className => ({
      name: className,
      count: students.filter((s: any) => s.class === className && s.status === 'Active').length
    }));
  }, [students]);

  const primaryClassData = useMemo(() => {
    if (!students) return [];
    return PRIMARY_CLASSES.map(className => ({
      name: className.replace('Grade ', 'G'),
      fullName: className,
      count: students.filter((s: any) => s.class === className && s.status === 'Active').length
    }));
  }, [students]);

  const recentStudents = useMemo(() => {
    if (!students) return [];
    return [...students].sort((a, b) => {
      const getTime = (val: any) => {
        if (!val) return 0;
        if (typeof val.toMillis === 'function') return val.toMillis();
        if (val.seconds) return val.seconds * 1000;
        const d = new Date(val);
        return isNaN(d.getTime()) ? 0 : d.getTime();
      };
      return getTime(b.createdAt) - getTime(a.createdAt);
    }).slice(0, 5);
  }, [students]);

  if (studentsLoading || staffLoading) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary/30" />
            <Zap className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] animate-pulse">Syncing Administrative Intelligence</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
               <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
               <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Registry Terminal Live</p>
            </div>
            <h2 className="text-5xl font-headline font-black tracking-tight text-primary leading-tight">Overview</h2>
            <p className="text-muted-foreground font-medium max-w-md">Real-time enrollment diagnostics and registry oversight for Kourrklys International School.</p>
          </div>
          <div className="flex gap-3">
            <Button size="lg" variant="outline" className="h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest border-2 hover:bg-muted" asChild>
              <Link href="/dashboard/students/new">Admission Form</Link>
            </Button>
            <Button size="lg" className="h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-transform" asChild>
              <Link href="/dashboard/students">Student Directory</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          <Card className="hover-lift border-none bg-primary text-primary-foreground overflow-hidden relative group rounded-3xl col-span-2 md:col-span-1">
            <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 group-hover:scale-110 transition-transform duration-700">
              <Users className="h-24 w-24" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white/70">Active Students</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black">{stats.total}</div>
              <div className="flex items-center gap-2 mt-2 text-white/80">
                <TrendingUp className="h-3 w-3" />
                <span className="text-[9px] font-black uppercase tracking-widest">Enrolled</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-lift border-none shadow-xl shadow-muted/50 overflow-hidden relative group rounded-3xl bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Primary</CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                <School className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary">{stats.primary}</div>
              <p className="text-[9px] font-bold text-blue-600 mt-2 uppercase tracking-widest">Basic Edu</p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-none shadow-xl shadow-muted/50 overflow-hidden relative group rounded-3xl bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Secondary</CardTitle>
              <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary">{stats.secondary}</div>
              <p className="text-[9px] font-bold text-indigo-600 mt-2 uppercase tracking-widest">Higher Prep</p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-none shadow-xl shadow-muted/50 overflow-hidden relative group rounded-3xl bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Staff</CardTitle>
              <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-amber-600">{stats.staff}</div>
              <p className="text-[9px] font-bold text-amber-700 mt-2 uppercase tracking-widest">Personnel</p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-none shadow-xl shadow-muted/50 overflow-hidden relative group rounded-3xl bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 text-destructive">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest opacity-70">Withdrawn</CardTitle>
              <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center">
                <UserX className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-red-600">{stats.withdrawn}</div>
              <p className="text-[9px] font-bold text-red-600 mt-2 uppercase tracking-widest">Registry Exit</p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-none shadow-xl shadow-muted/50 overflow-hidden relative group rounded-3xl bg-card border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 text-green-600">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest opacity-70">Grad Primary</CardTitle>
              <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                <Award className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-green-600">{stats.gradPrimary}</div>
              <p className="text-[9px] font-bold text-green-600 mt-2 uppercase tracking-widest">Alumni (Pri)</p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-none shadow-xl shadow-muted/50 overflow-hidden relative group rounded-3xl bg-card border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 text-green-600">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest opacity-70">Grad Secondary</CardTitle>
              <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                <Trophy className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-green-600">{stats.gradSecondary}</div>
              <p className="text-[9px] font-bold text-green-600 mt-2 uppercase tracking-widest">Alumni (Sec)</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-7 w-full">
          <Card className="lg:col-span-4 border-none shadow-2xl shadow-muted/50 rounded-3xl overflow-hidden bg-card w-full">
            <CardHeader className="p-8 border-b bg-muted/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="font-headline font-black text-2xl flex items-center gap-3 text-primary">Enrollment Distribution <BadgeCheck className="h-6 w-6 text-primary" /></CardTitle>
                  <CardDescription className="font-bold text-muted-foreground mt-1">Class distribution across all academic levels</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <Tabs defaultValue="secondary" className="space-y-8">
                <TabsList className="bg-muted/50 p-1 h-12 rounded-2xl w-full md:w-auto">
                  <TabsTrigger value="secondary" className="flex-1 md:flex-none rounded-xl px-6 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Secondary</TabsTrigger>
                  <TabsTrigger value="primary" className="flex-1 md:flex-none rounded-xl px-6 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Primary</TabsTrigger>
                </TabsList>
                
                <TabsContent value="secondary" className="mt-0">
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={secondaryClassData}>
                        <XAxis dataKey="name" fontSize={11} fontWeight={900} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                        <YAxis fontSize={11} fontWeight={900} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                        <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.05)', radius: 12 }} />
                        <Bar dataKey="count" radius={[12, 12, 0, 0]} barSize={45}>
                          {secondaryClassData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.8)'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="primary" className="mt-0">
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={primaryClassData}>
                        <XAxis dataKey="name" fontSize={11} fontWeight={900} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                        <YAxis fontSize={11} fontWeight={900} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                        <Tooltip 
                          cursor={{ fill: 'rgba(59, 130, 246, 0.05)', radius: 12 }}
                          formatter={(value, name, props) => [value, props.payload.fullName]}
                        />
                        <Bar dataKey="count" radius={[12, 12, 0, 0]} barSize={45}>
                          {primaryClassData.map((_, index) => (
                            <Cell key={`cell-primary-${index}`} fill={index % 2 === 0 ? 'hsl(var(--primary) / 0.6)' : 'hsl(var(--primary) / 0.4)'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 border-none shadow-2xl shadow-muted/50 rounded-3xl overflow-hidden bg-card w-full">
            <CardHeader className="p-8 border-b bg-muted/5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-headline font-black text-2xl text-primary">Recently Admitted</CardTitle>
                  <CardDescription className="font-bold text-muted-foreground mt-1">Latest registry entries</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="rounded-xl font-bold text-primary" asChild>
                  <Link href="/dashboard/students">View All <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6">
                {recentStudents.length > 0 ? (
                  recentStudents.map((student: any) => (
                    <div key={student.id} className="flex items-center gap-5 p-4 rounded-2xl hover:bg-muted/50 transition-all group">
                      <div className="h-14 w-14 rounded-full bg-secondary overflow-hidden shrink-0 border-2 border-primary/5 shadow-md transition-transform group-hover:scale-110 group-hover:rotate-3">
                        <img src={student.photoUrl || 'https://placehold.co/100'} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-base font-black text-primary group-hover:text-blue-600 transition-colors line-clamp-1">{student.fullName}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2 py-0.5 bg-muted rounded-md">{student.class}</span>
                          <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest truncate max-w-[80px]">{student.admissionNumber}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground/60 text-[9px] font-bold">
                           <Clock className="h-3 w-3" />
                           <FormattedDate date={student.createdAt} />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-muted-foreground text-center">
                    <Users className="h-12 w-12 opacity-10 mb-4" />
                    <p className="uppercase text-[10px] font-black tracking-[0.3em]">No Recent Records Found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}