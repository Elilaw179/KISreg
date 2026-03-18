
"use client";

import React, { useState, useMemo } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { 
  Search, 
  UserPlus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Mail,
  Phone,
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
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const db = useFirestore();
  const { user } = useUser();

  const teachersQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    // Aligning collection name with backend.json and firestore.rules
    return collection(db, 'staffs');
  }, [db, user]);

  const { data: teachers, loading } = useCollection(teachersQuery);

  const filteredTeachers = useMemo(() => {
    if (!teachers) return [];
    return teachers.filter(teacher => {
      return (
        teacher.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.staffId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [teachers, searchTerm]);

  const handleDelete = (id: string) => {
    if (!db || !confirm('Are you sure you want to deactivate this staff member?')) return;
    const docRef = doc(db, 'staffs', id);
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
            <h2 className="text-3xl font-headline font-bold text-primary">Staff Management</h2>
            <p className="text-muted-foreground">Manage teaching and non-teaching staff records in real-time.</p>
          </div>
          <Button size="sm" asChild>
            <Link href="/dashboard/teachers/new">
              <UserPlus className="mr-2 h-4 w-4" />
              Register Staff
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID or department..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                  <TableHead>Staff ID</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>
                        <div className="h-10 w-10 rounded-full bg-secondary overflow-hidden border">
                          <img 
                            src={teacher.photoUrl || 'https://picsum.photos/seed/admin/200/200'} 
                            alt="" 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{teacher.fullName}</TableCell>
                      <TableCell className="text-xs font-mono">{teacher.staffId}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                          {teacher.designation}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{teacher.department}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs flex items-center gap-1"><Mail className="h-3 w-3" /> {teacher.email}</span>
                          <span className="text-xs flex items-center gap-1"><Phone className="h-3 w-3" /> {teacher.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Manage Staff</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/teachers/${teacher.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Bio-Data
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/teachers/${teacher.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Update Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(teacher.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No staff records found in the live database.
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
