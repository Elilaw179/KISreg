
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
  Loader2,
  UserCheck,
  UserX
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
import { collection, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const db = useFirestore();
  const { user } = useUser();

  const teachersQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
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

  const toggleStatus = (id: string, currentStatus: string) => {
    if (!db) return;
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const docRef = doc(db, 'staffs', id);
    
    updateDoc(docRef, { 
      status: newStatus,
      updatedAt: serverTimestamp() 
    }).catch(async (error) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  const handleDelete = (id: string) => {
    if (!db || !confirm('Are you sure you want to PERMANENTLY delete this staff record? This action cannot be undone.')) return;
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
          <div className="space-y-1">
            <h2 className="text-3xl font-headline font-black text-primary tracking-tight">Staff Management</h2>
            <p className="text-muted-foreground font-medium text-sm">Oversee teaching and administrative personnel records.</p>
          </div>
          <Button size="sm" className="font-bold rounded-xl shadow-lg shadow-primary/10" asChild>
            <Link href="/dashboard/teachers/new">
              <UserPlus className="mr-2 h-4 w-4" />
              Register New Staff
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID or department..."
              className="pl-9 h-10 rounded-lg bg-muted/20 border-transparent focus:bg-white focus:border-primary/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary opacity-50" />
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Accessing Records...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-[80px] font-black text-[10px] uppercase tracking-widest py-4">Photo</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Full Name</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Staff ID</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Designation</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Contact</TableHead>
                  <TableHead className="text-right font-black text-[10px] uppercase tracking-widest pr-6">Manage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id} className="group transition-colors hover:bg-muted/10">
                      <TableCell className="py-4">
                        <div className="h-10 w-10 rounded-xl bg-secondary overflow-hidden border border-primary/5 shadow-sm group-hover:scale-105 transition-transform">
                          <img 
                            src={teacher.photoUrl || 'https://picsum.photos/seed/admin/200/200'} 
                            alt="" 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-primary">{teacher.fullName}</TableCell>
                      <TableCell className="text-[11px] font-black text-muted-foreground uppercase">{teacher.staffId}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 font-bold px-3">
                          {teacher.designation || 'Staff'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={teacher.status === 'Active' ? 'default' : 'secondary'} 
                          className={teacher.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-none' : 'opacity-60'}
                        >
                          {teacher.status || 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-medium flex items-center gap-1"><Mail className="h-3 w-3 opacity-50" /> {teacher.email}</span>
                          <span className="text-[10px] font-medium flex items-center gap-1"><Phone className="h-3 w-3 opacity-50" /> {teacher.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-none p-2">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2 py-1">Record Management</DropdownMenuLabel>
                            <DropdownMenuSeparator className="my-1 opacity-50" />
                            <DropdownMenuItem asChild className="rounded-lg">
                              <Link href={`/dashboard/teachers/${teacher.id}`}>
                                <Eye className="mr-2 h-4 w-4 opacity-70" />
                                View Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-lg">
                              <Link href={`/dashboard/teachers/${teacher.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4 opacity-70" />
                                Edit Record
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="rounded-lg"
                              onClick={() => toggleStatus(teacher.id, teacher.status || 'Active')}
                            >
                              {teacher.status === 'Inactive' ? (
                                <><UserCheck className="mr-2 h-4 w-4 text-green-600" /> Activate Staff</>
                              ) : (
                                <><UserX className="mr-2 h-4 w-4 text-amber-600" /> Deactivate Staff</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1 opacity-50" />
                            <DropdownMenuItem 
                              className="text-destructive font-bold rounded-lg focus:bg-destructive focus:text-white"
                              onClick={() => handleDelete(teacher.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Permanent
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-2">
                          <Search className="h-6 w-6 opacity-20" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest">No matching records found</p>
                        <p className="text-[10px] font-medium">Verify your search term or register a new staff member.</p>
                      </div>
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
