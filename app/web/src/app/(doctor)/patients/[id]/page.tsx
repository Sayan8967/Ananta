'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function PatientSummaryPage({ params }: { params: { id: string } }) {
  // Mock patient summary
  const patient = {
    id: params.id,
    name: 'Rahul Sharma',
    age: 34,
    gender: 'Male',
    bloodType: 'B+',
    phone: '+91 98765 43210',
    abhaNumber: '12-3456-7890-1234',
    conditions: [
      { name: 'Type 2 Diabetes Mellitus', status: 'active', onset: '2022-03-15', code: 'E11.9' },
      { name: 'Essential Hypertension', status: 'active', onset: '2023-01-10', code: 'I10' },
    ],
    medications: [
      { name: 'Metformin 500mg', dosage: 'Twice daily after meals', status: 'active' },
      { name: 'Amlodipine 5mg', dosage: 'Once daily morning', status: 'active' },
      { name: 'Atorvastatin 10mg', dosage: 'Once daily at night', status: 'active' },
    ],
    allergies: [
      { name: 'Penicillin', criticality: 'high', reaction: 'Anaphylaxis' },
      { name: 'Sulfa drugs', criticality: 'low', reaction: 'Skin rash' },
    ],
    immunizations: [
      { name: 'COVID-19 (Covishield)', date: '2021-06-15', status: 'completed' },
      { name: 'Influenza', date: '2025-10-01', status: 'completed' },
      { name: 'Hepatitis B', date: '2020-01-20', status: 'completed' },
    ],
    recentNotes: [
      { date: '2026-02-25', doctor: 'Dr. Anil Mehta', summary: 'Routine follow-up. HbA1c improved to 6.8%. Continue current medications.' },
      { date: '2026-01-15', doctor: 'Dr. Anil Mehta', summary: 'BP slightly elevated. Increased Amlodipine from 2.5mg to 5mg.' },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            RS
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
              <span>{patient.age}y {patient.gender}</span>
              <span>|</span>
              <span>Blood: {patient.bloodType}</span>
              <span>|</span>
              <span className="font-mono text-xs">{patient.abhaNumber}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Add Note</Button>
          <Button>Write Prescription</Button>
        </div>
      </div>

      {/* Critical Info Bar */}
      {patient.allergies.some((a) => a.criticality === 'high') && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold text-red-800 text-sm">High-Risk Allergies</p>
            <p className="text-sm text-red-700">
              {patient.allergies.filter((a) => a.criticality === 'high').map((a) => `${a.name} (${a.reaction})`).join(', ')}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">🩺 Active Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patient.conditions.map((c, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{c.name}</p>
                  <p className="text-xs text-gray-500">ICD-10: {c.code} | Since {new Date(c.onset).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
                </div>
                <Badge variant={c.status === 'active' ? 'destructive' : 'secondary'}>{c.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Current Medications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">💊 Current Medications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patient.medications.map((m, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.dosage}</p>
                </div>
                <Badge variant="default">{m.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Allergies */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">⚠️ Allergies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patient.allergies.map((a, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{a.name}</p>
                  <p className="text-xs text-gray-500">Reaction: {a.reaction}</p>
                </div>
                <Badge variant={a.criticality === 'high' ? 'destructive' : 'secondary'}>
                  {a.criticality} risk
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Immunizations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">💉 Immunizations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patient.immunizations.map((v, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{v.name}</p>
                  <p className="text-xs text-gray-500">{new Date(v.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
                <Badge variant="outline">{v.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Clinical Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">📝 Recent Clinical Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {patient.recentNotes.map((note, i) => (
            <div key={i} className="border-l-4 border-teal-400 pl-4 py-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-800">{note.doctor}</span>
                <span className="text-xs text-gray-400">
                  {new Date(note.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="text-sm text-gray-600">{note.summary}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
