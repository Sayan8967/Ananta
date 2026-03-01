'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function EmergencyCardViewPage({ params }: { params: { code: string } }) {
  // In production, this would fetch from the API using the access code
  // Emergency endpoint does NOT require authentication
  const emergencyCard = {
    accessCode: params.code,
    patientName: 'Rahul Sharma',
    bloodType: 'B+',
    age: 34,
    gender: 'Male',
    allergies: [
      { name: 'Penicillin', criticality: 'high', reaction: 'Anaphylaxis' },
      { name: 'Sulfa drugs', criticality: 'low', reaction: 'Skin rash' },
      { name: 'Peanuts', criticality: 'high', reaction: 'Severe swelling' },
    ],
    medications: [
      { name: 'Metformin 500mg', dosage: 'Twice daily after meals' },
      { name: 'Amlodipine 5mg', dosage: 'Once daily morning' },
      { name: 'Atorvastatin 10mg', dosage: 'Once daily at night' },
    ],
    conditions: [
      { name: 'Type 2 Diabetes Mellitus', code: 'E11.9' },
      { name: 'Essential Hypertension', code: 'I10' },
    ],
    emergencyContact: {
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      relationship: 'Spouse',
    },
    generatedAt: '2026-02-28T10:00:00Z',
    expiresAt: '2026-08-28T10:00:00Z',
  };

  return (
    <div className="space-y-6">
      {/* Emergency Card */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-red-200">
        {/* Card Header */}
        <div className="bg-red-600 text-white p-6 text-center">
          <p className="text-lg font-extrabold tracking-[0.2em]">♾️ ANANTA</p>
          <p className="text-xs font-bold text-red-200 tracking-widest mt-1">EMERGENCY MEDICAL INFORMATION</p>
        </div>

        {/* Patient Info */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoBlock label="Patient Name" value={emergencyCard.patientName} />
            <InfoBlock label="Age / Gender" value={`${emergencyCard.age}y / ${emergencyCard.gender}`} />
            <InfoBlock label="Blood Type" value={emergencyCard.bloodType} large />
            <InfoBlock label="Access Code" value={emergencyCard.accessCode} mono />
          </div>

          {/* CRITICAL: Allergies */}
          <section>
            <h3 className="text-xs font-bold text-red-700 tracking-wider mb-3 flex items-center gap-2">
              ⚠️ ALLERGIES (CRITICAL)
            </h3>
            <div className="space-y-2">
              {emergencyCard.allergies.map((a, i) => (
                <div key={i} className="flex items-center justify-between bg-red-50 rounded-lg p-3 border border-red-100">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{a.name}</p>
                    <p className="text-xs text-gray-500">Reaction: {a.reaction}</p>
                  </div>
                  <Badge variant={a.criticality === 'high' ? 'destructive' : 'secondary'}>
                    {a.criticality === 'high' ? 'HIGH RISK' : 'Low risk'}
                  </Badge>
                </div>
              ))}
            </div>
          </section>

          {/* Medications */}
          <section>
            <h3 className="text-xs font-bold text-gray-600 tracking-wider mb-3 flex items-center gap-2">
              💊 CURRENT MEDICATIONS
            </h3>
            <div className="space-y-2">
              {emergencyCard.medications.map((m, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3">
                  <p className="font-semibold text-gray-900 text-sm">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.dosage}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Conditions */}
          <section>
            <h3 className="text-xs font-bold text-gray-600 tracking-wider mb-3 flex items-center gap-2">
              🩺 ACTIVE CONDITIONS
            </h3>
            <div className="flex flex-wrap gap-2">
              {emergencyCard.conditions.map((c, i) => (
                <div key={i} className="bg-blue-50 rounded-lg px-4 py-2 border border-blue-100">
                  <p className="font-medium text-blue-900 text-sm">{c.name}</p>
                  <p className="text-xs text-blue-600">ICD-10: {c.code}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Emergency Contact */}
          <section className="border-t pt-4">
            <h3 className="text-xs font-bold text-gray-600 tracking-wider mb-3 flex items-center gap-2">
              📞 EMERGENCY CONTACT
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-gray-900">{emergencyCard.emergencyContact.name}</p>
              <p className="text-sm text-blue-600 font-medium">{emergencyCard.emergencyContact.phone}</p>
              <p className="text-xs text-gray-500 mt-1">{emergencyCard.emergencyContact.relationship}</p>
            </div>
          </section>
        </div>

        {/* Card Footer */}
        <div className="bg-red-50 px-6 py-4 text-center border-t border-red-100">
          <p className="text-xs text-gray-500">
            Generated: {new Date(emergencyCard.generatedAt).toLocaleDateString()} |
            Valid until: {new Date(emergencyCard.expiresAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-red-600 font-medium mt-1">
            For emergency medical use only. Data provided by Ananta Health Platform.
          </p>
        </div>
      </div>

      {/* Emergency Services */}
      <Card className="border-red-200">
        <CardContent className="pt-6 text-center space-y-2">
          <p className="font-bold text-red-800">Need Immediate Help?</p>
          <div className="flex justify-center gap-6 text-sm">
            <div>
              <p className="font-bold text-red-600 text-lg">112</p>
              <p className="text-gray-500">India Emergency</p>
            </div>
            <div className="border-l border-red-200" />
            <div>
              <p className="font-bold text-red-600 text-lg">911</p>
              <p className="text-gray-500">US Emergency</p>
            </div>
            <div className="border-l border-red-200" />
            <div>
              <p className="font-bold text-red-600 text-lg">108</p>
              <p className="text-gray-500">India Ambulance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoBlock({ label, value, large, mono }: { label: string; value: string; large?: boolean; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p
        className={`font-bold text-gray-900 mt-1 ${large ? 'text-2xl text-red-600' : 'text-sm'} ${
          mono ? 'font-mono tracking-wider' : ''
        }`}
      >
        {value}
      </p>
    </div>
  );
}
