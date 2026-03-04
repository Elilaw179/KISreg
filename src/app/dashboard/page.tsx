
"use client";

import React, { useMemo } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { 
  Users, 
  UserCheck, 
  UserX, 
  School,
  TrendingUp,
  Calendar,
  Loader2
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
import { collection, query, orderBy, limit } from 'firebase/firestore';

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
      .slice(0, 3);
  }, [students]);

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
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-headline font-bold tracking-tight text-primary">Overview</h2>
          <p className="text-muted-foreground">Welcome back, Admin. Here is what's happening at Kourrklys today.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total registered students
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently enrolled
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Withdrawn</CardTitle>
              <UserX className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.withdrawn}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Alumni or transfers
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <School className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Average weekly rate
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Secondary Enrollment</CardTitle>
              <CardDescription>Number of students in JSS 1 to SS 3</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classData}>
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}`} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {classData.map((entry, index) => (
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
                  <CardTitle className="font-headline">Recent Admissions</CardTitle>
                  <CardDescription>Latest students added</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/students">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentStudents.length > 0 ? (
                  recentStudents.map((student) => (
                    <div key={student.id} className="flex items-center gap-4 group">
                      <div className="h-10 w-10 rounded-full bg-secondary overflow-hidden shrink-0 border border-muted">
                        <img src={student.photoUrl || 'https://placehold.co/100'} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-semibold leading-none group-hover:text-primary transition-colors">{student.fullName}</p>
                        <p className="text-xs text-muted-foreground">{student.class} • {student.admissionNumber}</p>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(student.dateOfAdmission).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No recent admissions found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
