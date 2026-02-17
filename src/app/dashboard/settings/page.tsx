"use client";

import React from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { 
  Settings, 
  School, 
  Shield, 
  Bell, 
  Save, 
  UserCircle,
  Clock,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Admin Settings
          </h2>
          <p className="text-muted-foreground">Configure system-wide preferences and school information.</p>
        </div>

        <div className="grid gap-6">
          {/* School Information */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <School className="h-5 w-5 text-primary" />
                School Identity
              </CardTitle>
              <CardDescription>Update the official school details used on reports and ID cards.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input id="schoolName" defaultValue="Kourrklys International School" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolAbbr">Abbreviation</Label>
                  <Input id="schoolAbbr" defaultValue="KIS" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="schoolAddress">Official Address</Label>
                  <Input id="schoolAddress" defaultValue="12 Victoria Island, Lagos, Nigeria" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolEmail">Admin Email</Label>
                  <Input id="schoolEmail" type="email" defaultValue="admin@kourrklys.edu.ng" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolPhone">Official Phone</Label>
                  <Input id="schoolPhone" defaultValue="+234 801 234 5678" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Session Settings */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Academic Session
              </CardTitle>
              <CardDescription>Current term and session management.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Active Academic Session</Label>
                  <Select defaultValue="2023/2024">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Session" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023/2024">2023/2024</SelectItem>
                      <SelectItem value="2024/2025">2024/2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Current Term</Label>
                  <Select defaultValue="2nd">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st">1st Term (Autumn)</SelectItem>
                      <SelectItem value="2nd">2nd Term (Spring)</SelectItem>
                      <SelectItem value="3rd">3rd Term (Summer)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Account Settings */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" />
                Account Security
              </CardTitle>
              <CardDescription>Manage your administrative login credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPass">Current Password</Label>
                  <Input id="currentPass" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPass">New Password</Label>
                  <Input id="newPass" type="password" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-4 sticky bottom-4 z-10 bg-background/80 backdrop-blur p-4 rounded-xl border shadow-lg">
            <Button variant="outline">Reset Changes</Button>
            <Button className="font-bold px-8 shadow-md">
              <Save className="mr-2 h-4 w-4" />
              Save Configurations
            </Button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
