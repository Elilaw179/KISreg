"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { 
  ArrowLeft, 
  Upload, 
  Save, 
  User, 
  Briefcase, 
  Phone, 
  Mail, 
  Home, 
  Calendar,
  Globe,
  Heart,
  Users,
  BadgeCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import Link from 'next/link';

export default function NewTeacherPage() {
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard/teachers');
  };

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/teachers">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h2 className="text-3xl font-headline font-bold text-primary">Staff Registration</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar info */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Staff Photograph</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="w-full aspect-square max-w-[200px] rounded-full border-4 border-muted overflow-hidden bg-muted/20 relative group">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                        <Upload className="h-8 w-8 mb-2" />
                        <span className="text-xs font-bold">UPLOAD PHOTO</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handlePhotoChange}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center uppercase font-bold tracking-widest">
                    Recommended: 400x400 JPG/PNG
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-sm font-black text-primary uppercase flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4" />
                    Staff Credentials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="staffId">Staff Identification No.</Label>
                    <Input id="staffId" placeholder="KIS/STAFF/..." required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doj">Date of Joining</Label>
                    <Input id="doj" type="date" required />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main form */}
            <div className="lg:col-span-8 space-y-6">
              {/* Bio Data */}
              <Card className="border-none shadow-sm">
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Bio-Data Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="Surname First, Middle, Last Name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marital">Marital Status</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input id="nationality" defaultValue="Nigerian" />
                  </div>
                </CardContent>
              </Card>

              {/* Professional Details */}
              <Card className="border-none shadow-sm">
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Professional Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation / Role</Label>
                    <Input id="designation" placeholder="e.g. Mathematics Teacher" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" placeholder="e.g. Sciences" required />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="qualification">Educational Qualification</Label>
                    <Input id="qualification" placeholder="e.g. B.Sc (Ed), M.Ed, etc." required />
                  </div>
                </CardContent>
              </Card>

              {/* Next of Kin */}
              <Card className="border-none shadow-sm">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="text-lg flex items-center gap-2 text-primary">
                    <Heart className="h-5 w-5" />
                    Next of Kin Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="nokName">Full Name</Label>
                    <Input id="nokName" placeholder="Next of kin full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nokRel">Relationship</Label>
                    <Input id="nokRel" placeholder="e.g. Spouse, Brother, etc." required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nokPhone">Phone Number</Label>
                    <Input id="nokPhone" placeholder="+234 ..." required />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="nokAddress">Residential Address</Label>
                    <Input id="nokAddress" placeholder="Full residential address" required />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="border-none shadow-sm">
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Staff Contact Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Mobile Number</Label>
                    <Input id="phone" placeholder="+234 ..." required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Official Email</Label>
                    <Input id="email" type="email" placeholder="staffname@kourrklys.edu.ng" required />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="homeAddr">Residential Address</Label>
                    <Input id="homeAddr" placeholder="Full residential address" required />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t bg-background/80 backdrop-blur sticky bottom-0 z-10 p-4 rounded-xl shadow-lg border">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard/teachers">Discard</Link>
            </Button>
            <Button type="submit" className="px-10 font-bold shadow-md">
              <Save className="mr-2 h-4 w-4" />
              Register Staff Record
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
