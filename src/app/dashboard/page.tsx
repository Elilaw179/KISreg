"use client";

import React, { useMemo } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { 
  Users, 
  UserCheck, 
  UserX, 
  School,
  Calendar,
  Loader2,
  TrendingUp,
  ArrowUpRight
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
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';

const SECONDARY_CLASSES = ['JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3'];

export default function DashboardPage() {
  const db = useFirestore();
  
  const studentsQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, 'students');
  }, [db]);

  const { data: students, loading } = useCollection(studentsQuery);

  const stats = useMemo(() => {
    if (!students) return { total: 0, active: 0, withdrawn: 0 };
    return {
      total: students.length,
      active: students.filter(s => s.status === 'Active').length,
      withdrawn: students.filter(s => s.status === 'Withdrawn').length,
    };
  }, [students]);

  const classData = useMemo(() => {
    if (!students) return [];
    return SECONDARY_CLASSES.map(className => ({
      name: className,
      count: students.filter(s => s.class === className).length
    }));
  }, [students]);

  const recentStudents = useMemo(() => {
    if (!students) return [];
    return [...students]
      .sort((a, b) => (b.dateOfAdmission || '').localeCompare(a.dateOfAdmission || ''))
      .slice(0, 4);
  }, [students]);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Synchronizing Data...</p>
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
            <p className="text-muted-foreground font-medium">Welcome back, Registrar. Here is the daily summary for Kourrklys.</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-10 rounded-xl font-bold text-xs uppercase tracking-wider" asChild>
              <Link href="/dashboard/students/new">Admission Form</Link>
            </Button>
            <Button size="sm" className="h-10 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20" asChild>
              <Link href="/dashboard/students">Student Registry</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover-lift border-none shadow-sm overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Students</CardTitle>
              <div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary">{stats.total}</div>
              <div className="flex items-center gap-1 mt-1 text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span className="text-[10px] font-bold">Live database count</span>
              </div>
            </CardContent>
          </Card>
          <Card className="hover-lift border-none shadow-sm overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Active Enrollment</CardTitle>
              <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                <UserCheck className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-green-700">{stats.active}</div>
              <p className="text-[10px] font-bold text-muted-foreground mt-1 tracking-tight">Currently in session</p>
            </CardContent>
          </Card>
          <Card className="hover-lift border-none shadow-sm overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Withdrawn</CardTitle>
              <div className="p-2 bg-destructive/5 rounded-lg group-hover:bg-destructive/10 transition-colors">
                <UserX className="h-4 w-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-destructive/80">{stats.withdrawn}</div>
              <p className="text-[10px] font-bold text-muted-foreground mt-1 tracking-tight">Alumni / Transferred</p>
            </CardContent>
          </Card>
          <Card className="hover-lift border-none shadow-sm overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Daily Avg</CardTitle>
              <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                <School className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-amber-700">94.8%</div>
              <p className="text-[10px] font-bold text-muted-foreground mt-1 tracking-tight">Attendance stability</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="font-headline font-black text-xl flex items-center gap-2">
                Secondary Enrollment
                <BadgeCheck className="h-5 w-5 text-primary" />
              </CardTitle>
              <CardDescription className="text-xs font-medium uppercase tracking-wider">Student distribution across JSS & SS classes</CardDescription>
            </CardHeader>
            <CardContent className="pl-2 pb-6">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classData}>
                    <XAxis 
                      dataKey="name" 
                      stroke="#94a3b8" 
                      fontSize={11} 
                      fontWeight={700}
                      tickLine={false} 
                      axisLine={false} 
                      dy={10}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={11} 
                      fontWeight={700}
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}`} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(60, 89, 155, 0.05)', radius: 8 }}
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                      {classData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3c599b' : '#5a78bd'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3 border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-headline font-black text-xl">Recent Admissions</CardTitle>
                  <CardDescription className="text-xs font-medium uppercase tracking-wider">Latest entries to the system</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-xs font-bold text-primary group" asChild>
                  <Link href="/dashboard/students">
                    View All
                    <ArrowUpRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentStudents.length > 0 ? (
                  recentStudents.map((student) => (
                    <div key={student.id} className="flex items-center gap-4 group cursor-pointer p-2 rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="h-12 w-12 rounded-xl bg-secondary overflow-hidden shrink-0 border border-muted shadow-sm transition-transform group-hover:scale-105">
                        <img src={student.photoUrl || 'https://placehold.co/100'} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <p className="text-sm font-bold leading-none text-primary/90 group-hover:text-primary transition-colors">{student.fullName}</p>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-muted-foreground uppercase">{student.class}</span>
                           <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                           <span className="text-[10px] font-medium text-muted-foreground">{student.admissionNumber}</span>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 opacity-60">
                        <Calendar className="h-3 w-3" />
                        {new Date(student.dateOfAdmission).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
                    <div className="p-3 bg-muted rounded-full">
                       <Users className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Database Empty</p>
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

function BadgeCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.74z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}