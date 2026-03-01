'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function ProfilePage() {
  // Mock profile data
  const profile = {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91 98765 43210',
    birthDate: '1991-05-14',
    gender: 'male',
    anantaId: 'ANT-2025-001234',
    abhaNumber: '12-3456-7890-1234',
    address: {
      line: ['42, MG Road'],
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
    },
  };

  const consents = [
    { id: '1', category: 'Emergency Access', scope: 'Allow emergency responders to view critical data', status: 'active' },
    { id: '2', category: 'Doctor Data Sharing', scope: 'Share records with verified doctors', status: 'active' },
    { id: '3', category: 'Research Data', scope: 'Anonymous data for medical research', status: 'inactive' },
    { id: '4', category: 'ABDM Health Locker', scope: 'Sync with Ayushman Bharat Digital Mission', status: 'active' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
        <Button variant="outline">Edit Profile</Button>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0">
              RS
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">Patient</Badge>
                <Badge variant="outline">India (ABDM)</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoField label="Full Name" value={profile.name} />
            <InfoField label="Date of Birth" value={new Date(profile.birthDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })} />
            <InfoField label="Gender" value={profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)} />
            <InfoField label="Phone" value={profile.phone} />
            <InfoField label="Email" value={profile.email} />
            <InfoField
              label="Address"
              value={`${profile.address.line.join(', ')}, ${profile.address.city}, ${profile.address.state} ${profile.address.postalCode}`}
            />
          </CardContent>
        </Card>

        {/* Health Identifiers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Health Identifiers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoField label="Ananta ID" value={profile.anantaId} mono />
            <InfoField label="ABHA Number" value={profile.abhaNumber} mono />
            <div className="bg-blue-50 rounded-lg p-4 mt-4">
              <p className="text-xs text-blue-700">
                Your ABHA (Ayushman Bharat Health Account) number connects your Ananta records with India's national health network.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data & Privacy Consents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {consents.map((consent) => (
              <div key={consent.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{consent.category}</p>
                  <p className="text-xs text-gray-500 mt-1">{consent.scope}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={consent.status === 'active' ? 'default' : 'secondary'}>
                    {consent.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button size="sm" variant="outline">
                    {consent.status === 'active' ? 'Revoke' : 'Enable'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">App Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <span>🌐</span>
                <div>
                  <p className="font-medium text-gray-800 text-sm">Region</p>
                  <p className="text-xs text-gray-500">Data residency and regulatory compliance</p>
                </div>
              </div>
              <span className="text-sm text-gray-600 font-medium">India (ap-south-1)</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <span>🔔</span>
                <div>
                  <p className="font-medium text-gray-800 text-sm">Notifications</p>
                  <p className="text-xs text-gray-500">Medication reminders and health alerts</p>
                </div>
              </div>
              <span className="text-sm text-green-600 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <span>🔐</span>
                <div>
                  <p className="font-medium text-gray-800 text-sm">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Extra security for your account</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">Export All Data</p>
            <p className="text-xs text-gray-500">Download your complete FHIR R4 health records bundle</p>
          </div>
          <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
            Export Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-medium text-gray-800 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}
