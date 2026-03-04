
"use client";

import React from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { 
  Users, 
  UserCheck, 
  UserX, 
  School,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_STUDENTS, CLASSES } from '@/lib/mock-data';
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

export default function DashboardPage() {
  const totalStudents = MOCK_STUDENTS.length;
  const activeStudents = MOCK_STUDENTS.filter(s => s.status === 'Active').length;
  const withdrawnStudents = MOCK_STUDENTS.filter(s => s.status === 'Withdrawn').length;

  // Generate distribution for all major classes to ensure the diagram is full
  const classData = CLASSES.map(className => {
    return {
      name: className,
      count: MOCK_STUDENTS.filter(s => s.class === className).length
    };
  });

  const recentStudents = MOCK_STUDENTS.slice(-3).reverse();

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-headline font-bold tracking-tight text-primary">Overview</h2>
          <p className="text-muted-foreground">Welcome back, Admin. Here is what's happening at Kourrklys today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500 font-medium inline-flex items-center">
                  +2.5% <TrendingUp className="ml-1 h-3 w-3" />
                </span> from last month
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently enrolled in classes
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Withdrawn</CardTitle>
              <UserX className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{withdrawnStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Alumni or transfers
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Class Attendance</CardTitle>
              <School className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Average weekly attendance
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Student Distribution</CardTitle>
              <CardDescription>Number of students per class level (All Grades & Secondary)</CardDescription>
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
                {recentStudents.map((student) => (
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
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
