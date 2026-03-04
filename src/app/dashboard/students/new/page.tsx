"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { 
  ArrowLeft, 
  Upload, 
  Save, 
  X,
  User,
  School,
  Calendar as CalendarIcon,
  Phone,
  Home,
  Globe,
  Stethoscope,
  Droplet,
  Mail,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { CLASSES } from '@/lib/mock-data';
import Link from 'next/link';

export default function NewStudentPage() {
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard/students');
  };

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/students">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h2 className="text-3xl font-headline font-bold text-primary">New Admission Record</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Photo Upload */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="shadow-sm border">
                <CardHeader>
                  <CardTitle className="text-lg">Passport Photo</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="w-full aspect-square max-w-[240px] rounded-2xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center bg-muted/30 overflow-hidden relative">
                    {photoPreview ? (
                      <>
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => setPhotoPreview(null)}
                          className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:scale-110 transition-transform"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground p-6 text-center">
                        <Upload className="h-10 w-10 opacity-50 mb-2" />
                        <span className="text-sm font-medium">Click to upload photo</span>
                        <span className="text-xs opacity-60">or drag & drop here</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Required for student ID card generation.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border overflow-hidden">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    Medical Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Droplet className="h-3 w-3 text-red-500" />
                      Blood Group
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Blood Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                          <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicalInfo">Allergies / Special Conditions</Label>
                    <Textarea 
                      id="medicalInfo" 
                      placeholder="e.g., Peanut allergy, Asthmatic, etc." 
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Main Info */}
            <div className="lg:col-span-8 space-y-6">
              <Card className="shadow-sm border">
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="fullName">Full Name (as in Birth Certificate)</Label>
                    <Input id="fullName" placeholder="Surname First, Middle Name, First Name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admNo">Admission Number</Label>
                    <Input id="admNo" placeholder="KIS/2024/..." required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="nationality" className="pl-10" placeholder="e.g. Nigerian" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="dob" type="date" className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border">
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <School className="h-5 w-5 text-primary" />
                    Academic Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="class">Assigned Class/Grade</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLASSES.map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admDate">Admission Date</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="admDate" type="date" className="pl-10" required />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="prevSchool">Former School Attended</Label>
                    <Input id="prevSchool" placeholder="Name and address of former school" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border">
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Guardian / Home Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Guardian's Full Name</Label>
                    <Input id="parentName" placeholder="e.g., Mr. & Mrs. Okeke" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentContact">Emergency Contact (Phone)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="parentContact" className="pl-10" placeholder="+234 ..." required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentEmail">Guardian's Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="parentEmail" type="email" className="pl-10" placeholder="parent@example.com" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentOccupation">Guardian's Occupation</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="parentOccupation" className="pl-10" placeholder="e.g. Civil Servant" required />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address">Residential Address</Label>
                    <div className="relative">
                      <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="address" className="pl-10" placeholder="Flat, Street, Area, City" required />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t bg-background/80 backdrop-blur sticky bottom-0 z-10 p-4 rounded-xl shadow-lg border">
            <Button variant="outline" type="button" className="px-8" asChild>
              <Link href="/dashboard/students">Discard</Link>
            </Button>
            <Button type="submit" className="h-10 px-10 font-bold shadow-md">
              <Save className="mr-2 h-4 w-4" />
              Finalize Record
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
