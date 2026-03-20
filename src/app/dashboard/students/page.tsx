"use client";

import React, { useState, useMemo } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  Eye, 
  Edit, 
  FileDown,
  Loader2,
  UserX,
  Award,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { CLASSES } from '@/lib/mock-data';
import Link from 'next/link';
import Image from 'next/image';
import { useFirestore, useCollection, useMemoFirebase, useUser, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const db = useFirestore();
  const { user } = useUser();

  const studentsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'students');
  }, [db, user]);

  const { data: students, isLoading: loading } = useCollection(studentsQuery);

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    return students.filter(student => {
      const matchesSearch = 
        student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClass = classFilter === 'all' || student.class === classFilter;
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [students, searchTerm, classFilter, statusFilter]);

  const setStatus = (id: string, newStatus: string) => {
    if (!db) return;
    const docRef = doc(db, 'students', id);
    updateDocumentNonBlocking(docRef, { 
      status: newStatus,
      updatedAt: serverTimestamp() 
    });
  };

  const handleExport = () => {
    if (!filteredStudents || filteredStudents.length === 0) return;

    const headers = [
      'Full Name', 
      'Admission Number', 
      'Class', 
      'Status', 
      'Admission Date', 
      'Gender', 
      'Nationality',
      'Guardian Name', 
      'Guardian Contact',
      'Guardian Email',
      'Guardian Occupation',
      'Residential Address',
      'Blood Group',
      'Medical Info'
    ];
    
    const escapeCsv = (val: any, forceText = false) => {
      if (val === null || val === undefined) return '""';
      let str = String(val).replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
      if (forceText) {
        return `="${str}"`;
      }
      return `"${str}"`;
    };

    const csvRows = [
      headers.join(','),
      ...filteredStudents.map(s => [
        escapeCsv(s.fullName),
        escapeCsv(s.admissionNumber, true),
        escapeCsv(s.class),
        escapeCsv(s.status),
        escapeCsv(s.dateOfAdmission || 'N/A'),
        escapeCsv(s.gender),
        escapeCsv(s.nationality),
        escapeCsv(s.parentName),
        escapeCsv(s.parentContact, true),
        escapeCsv(s.parentEmail),
        escapeCsv(s.parentOccupation),
        escapeCsv(s.address),
        escapeCsv(s.bloodGroup),
        escapeCsv(s.medicalInfo)
      ].join(','))
    ];

    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `kourklys_students_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-4xl font-headline font-black text-primary tracking-tight">Student Directory</h2>
            <p className="text-muted-foreground font-medium">Manage and view all student records in the KOURKLYS registry.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl font-bold border-2" onClick={handleExport} disabled={!filteredStudents.length}>
              <FileDown className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button className="rounded-xl font-bold shadow-lg shadow-primary/20" asChild>
              <Link href="/dashboard/students/new">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Student
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 glass-card p-6 rounded-3xl shadow-sm border-none">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or admission number..."
              className="pl-12 h-12 rounded-2xl bg-muted/30 border-transparent focus:bg-background transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-[160px] h-12 rounded-2xl bg-muted/30 border-transparent">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Classes</SelectItem>
                {CLASSES.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] h-12 rounded-2xl bg-muted/30 border-transparent">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                <SelectItem value="Graduated">Graduated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-card rounded-3xl shadow-2xl shadow-muted/50 border-none overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-80 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Syncing Directory</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30 border-none">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[100px] font-black text-[10px] uppercase tracking-widest pl-8 py-5">Photo</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Full Name</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Adm. Number</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Class</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-8">Manage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id} className="group hover:bg-muted/5 transition-colors border-b-muted/20">
                        <TableCell className="pl-8 py-5">
                          <div className="h-12 w-12 rounded-full bg-secondary overflow-hidden border-2 border-primary/5 shadow-sm group-hover:scale-110 transition-transform relative">
                            <Image 
                              src={student.photoUrl || 'https://picsum.photos/seed/student/100/100'} 
                              alt="" 
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-black text-primary text-base whitespace-nowrap">{student.fullName}</TableCell>
                        <TableCell className="text-muted-foreground font-bold text-xs whitespace-nowrap">{student.admissionNumber}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 font-bold px-3">
                            {student.class}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge 
                            variant={student.status === 'Active' ? 'default' : student.status === 'Graduated' ? 'outline' : 'secondary'} 
                            className={student.status === 'Active' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-4' : student.status === 'Graduated' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-none px-4' : 'px-4'}
                          >
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-8 whitespace-nowrap">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5">
                                <MoreHorizontal className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-2xl border-none p-2">
                              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground p-2">Registry Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="opacity-50" />
                              <DropdownMenuItem asChild className="rounded-xl">
                                <Link href={`/dashboard/students/${student.id}`}>
                                  <Eye className="mr-2 h-4 w-4 opacity-70" />
                                  View Profile
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild className="rounded-xl">
                                <Link href={`/dashboard/students/${student.id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4 opacity-70" />
                                  Edit Record
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="rounded-xl cursor-pointer"
                                onClick={() => setStatus(student.id, 'Active')}
                                disabled={student.status === 'Active'}
                              >
                                <UserCheck className="mr-2 h-4 w-4 opacity-70" />
                                Re-Activate
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="rounded-xl cursor-pointer text-amber-600 focus:text-amber-600"
                                onClick={() => setStatus(student.id, 'Withdrawn')}
                                disabled={student.status === 'Withdrawn'}
                              >
                                <UserX className="mr-2 h-4 w-4 opacity-70" />
                                Withdraw
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="rounded-xl cursor-pointer text-green-600 focus:text-green-600"
                                onClick={() => setStatus(student.id, 'Graduated')}
                                disabled={student.status === 'Graduated'}
                              >
                                <Award className="mr-2 h-4 w-4 opacity-70" />
                                Graduate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                          <Search className="h-12 w-12 opacity-10" />
                          <p className="text-[10px] font-black uppercase tracking-[0.3em]">No matching student records found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
