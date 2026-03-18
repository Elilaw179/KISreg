
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
  UserX,
  FileDown
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase, useUser, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);
  const db = useFirestore();
  const { user } = useUser();

  const teachersQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'staffs');
  }, [db, user]);

  const { data: teachers, isLoading: loading } = useCollection(teachersQuery);

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
    updateDocumentNonBlocking(docRef, { 
      status: newStatus,
      updatedAt: serverTimestamp() 
    });
  };

  const confirmDelete = () => {
    if (!db || !staffToDelete) return;
    const docRef = doc(db, 'staffs', staffToDelete);
    deleteDocumentNonBlocking(docRef);
    setStaffToDelete(null);
  };

  const handleExport = () => {
    if (!filteredTeachers || filteredTeachers.length === 0) return;

    const headers = [
      'Full Name', 
      'Staff ID', 
      'Designation', 
      'Department', 
      'Status', 
      'Email', 
      'Phone',
      'Nationality',
      'Marital Status',
      'Date of Joining',
      'Qualification',
      'Address',
      'NOK Name',
      'NOK Relationship',
      'NOK Phone'
    ];
    
    const escapeCsv = (val: any, forceText = false) => {
      if (val === null || val === undefined) return '""';
      // Strip line breaks and escape quotes to prevent truncation in Excel
      let str = String(val).replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
      if (forceText) {
        // Excel literal string formula to preserve leading zeros and prevent scientific notation
        return `="${str}"`;
      }
      return `"${str}"`;
    };

    const csvRows = [
      headers.join(','),
      ...filteredTeachers.map(t => [
        escapeCsv(t.fullName),
        escapeCsv(t.staffId, true),
        escapeCsv(t.designation),
        escapeCsv(t.department),
        escapeCsv(t.status || 'Active'),
        escapeCsv(t.email),
        escapeCsv(t.phone, true),
        escapeCsv(t.nationality),
        escapeCsv(t.maritalStatus),
        escapeCsv(t.dateOfJoining),
        escapeCsv(t.qualification),
        escapeCsv(t.address),
        escapeCsv(t.nextOfKin?.name),
        escapeCsv(t.nextOfKin?.relationship),
        escapeCsv(t.nextOfKin?.phone, true)
      ].join(','))
    ];

    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `kis_staff_report_${new Date().toISOString().split('T')[0]}.csv`);
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
            <h2 className="text-4xl font-headline font-black text-primary tracking-tight">Staff Management</h2>
            <p className="text-muted-foreground font-medium text-sm">Oversee teaching and administrative personnel records.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl font-bold border-2" onClick={handleExport} disabled={!filteredTeachers.length}>
              <FileDown className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button className="rounded-xl font-bold shadow-lg shadow-primary/20" asChild>
              <Link href="/dashboard/teachers/new">
                <UserPlus className="mr-2 h-4 w-4" />
                Register Staff
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 glass-card p-4 rounded-2xl shadow-sm border-none">
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

        <div className="bg-white rounded-3xl shadow-2xl shadow-muted/50 border-none overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary opacity-50" />
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Accessing Records...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/30 border-none">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-[80px] font-black text-[10px] uppercase tracking-widest py-5 pl-8">Photo</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Full Name</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Staff ID</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Designation</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Contact</TableHead>
                  <TableHead className="text-right font-black text-[10px] uppercase tracking-widest pr-8">Manage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id} className="group transition-colors hover:bg-muted/10 border-b-muted/20">
                      <TableCell className="py-5 pl-8">
                        <div className="h-10 w-10 rounded-xl bg-secondary overflow-hidden border border-primary/5 shadow-sm group-hover:scale-110 transition-transform">
                          <img 
                            src={teacher.photoUrl || 'https://picsum.photos/seed/admin/200/200'} 
                            alt="" 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-primary text-base">{teacher.fullName}</TableCell>
                      <TableCell className="text-[11px] font-black text-muted-foreground uppercase">{teacher.staffId}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 font-bold px-3">
                          {teacher.designation || 'Staff'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={teacher.status === 'Active' ? 'default' : 'secondary'} 
                          className={teacher.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-none px-4' : 'px-4 opacity-60'}
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
                      <TableCell className="text-right pr-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-2xl border-none p-2">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2 py-1">Record Management</DropdownMenuLabel>
                            <DropdownMenuSeparator className="my-1 opacity-50" />
                            <DropdownMenuItem asChild className="rounded-xl">
                              <Link href={`/dashboard/teachers/${teacher.id}`}>
                                <Eye className="mr-2 h-4 w-4 opacity-70" />
                                View Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-xl">
                              <Link href={`/dashboard/teachers/${teacher.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4 opacity-70" />
                                Edit Record
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="rounded-xl"
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
                              className="text-destructive font-bold rounded-xl focus:bg-destructive focus:text-white"
                              onClick={() => setStaffToDelete(teacher.id)}
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
                    <TableCell colSpan={7} className="h-64 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-4">
                        <Search className="h-12 w-12 opacity-10" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">No matching staff records found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <AlertDialog open={!!staffToDelete} onOpenChange={(open) => !open && setStaffToDelete(null)}>
        <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-primary">Permanent Registry Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium">
              Are you sure you want to delete this staff record? This action will permanently remove all professional and bio-data from the registry and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-6">
            <AlertDialogCancel className="rounded-xl font-bold">Abort</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90 rounded-xl font-bold shadow-lg shadow-destructive/20">
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  );
}
