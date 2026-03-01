'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function DoctorDashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const recentPatients = [
    { id: '1', name: 'Rahul Sharma', age: 34, conditions: ['Type 2 Diabetes', 'Hypertension'], lastVisit: '2026-02-25' },
    { id: '2', name: 'Priya Patel', age: 28, conditions: ['Asthma'], lastVisit: '2026-02-24' },
    { id: '3', name: 'Amit Kumar', age: 55, conditions: ['Coronary Artery Disease', 'Hyperlipidemia'], lastVisit: '2026-02-22' },
    { id: '4', name: 'Sneha Reddy', age: 42, conditions: ['Migraine', 'Hypothyroidism'], lastVisit: '2026-02-20' },
  ];

  const stats = [
    { label: 'Patients Today', value: '12', icon: '👥', color: 'bg-blue-50 text-blue-700' },
    { label: 'Pending Notes', value: '3', icon: '📝', color: 'bg-amber-50 text-amber-700' },
    { label: 'Prescriptions Issued', value: '8', icon: '💊', color: 'bg-green-50 text-green-700' },
    { label: 'Follow-ups Due', value: '5', icon: '📅', color: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, Dr. Anil Mehta</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Patient Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Patient Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Search by name, Ananta ID, or ABHA number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Patients */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {patient.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{patient.name}</p>
                    <p className="text-xs text-gray-500">{patient.age} years old</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex gap-1 flex-wrap justify-end max-w-xs">
                    {patient.conditions.map((c, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{c}</Badge>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(patient.lastVisit).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
