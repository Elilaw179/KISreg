
"use client";

import React, { useState, useMemo } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  Eye, 
  Edit, 
  Trash2,
  FileDown,
  Loader2
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
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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

  const { data: students, loading } = useCollection(studentsQuery);

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

  const handleDelete = (id: string) => {
    if (!db || !confirm('Are you sure you want to PERMANENTLY delete this student record?')) return;
    const docRef = doc(db, 'students', id);
    deleteDoc(docRef).catch(async (error) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-headline font-bold text-primary">Student Directory</h2>
            <p className="text-muted-foreground">Manage and view all student records in the system.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" asChild>
              <Link href="/dashboard/students/new">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Student
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or admission number..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {CLASSES.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[80px]">Photo</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Adm. Number</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Adm. Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="h-10 w-10 rounded-full bg-secondary overflow-hidden border">
                          <img 
                            src={student.photoUrl || 'https://placehold.co/100'} 
                            alt="" 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{student.fullName}</TableCell>
                      <TableCell className="text-muted-foreground">{student.admissionNumber}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>
                        <Badge variant={student.status === 'Active' ? 'default' : 'secondary'} className={student.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-none' : ''}>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {student.dateOfAdmission ? new Date(student.dateOfAdmission).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/students/${student.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/students/${student.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Record
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(student.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No students found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
