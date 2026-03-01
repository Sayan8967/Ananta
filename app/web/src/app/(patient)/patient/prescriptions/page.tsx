'use client';

import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PrescriptionUploader } from '@/components/patient/PrescriptionUploader';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Processing', variant: 'secondary' },
  extracted: { label: 'Review Needed', variant: 'default' },
  confirmed: { label: 'Confirmed', variant: 'outline' },
  failed: { label: 'Failed', variant: 'destructive' },
};

export default function PrescriptionsPage() {
  const [showUploader, setShowUploader] = useState(false);

  // Mock data for now
  const prescriptions = [
    {
      id: '1',
      description: 'Dr. Sharma - General Checkup',
      date: '2025-12-15',
      status: 'confirmed',
      extractedMedications: [
        { name: 'Metformin 500mg', dosage: 'Twice daily after meals' },
        { name: 'Amlodipine 5mg', dosage: 'Once daily morning' },
      ],
    },
    {
      id: '2',
      description: 'Apollo Hospital - ENT Visit',
      date: '2026-01-20',
      status: 'extracted',
      extractedMedications: [
        { name: 'Amoxicillin 250mg', dosage: 'Three times daily' },
        { name: 'Cetirizine 10mg', dosage: 'Once daily at night' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-sm text-gray-500 mt-1">Scan or upload prescriptions for AI-powered medication extraction</p>
        </div>
        <Button onClick={() => setShowUploader(!showUploader)}>
          {showUploader ? 'Close' : '+ Scan Prescription'}
        </Button>
      </div>

      {/* Uploader */}
      {showUploader && (
        <Card>
          <CardContent className="pt-6">
            <PrescriptionUploader
              onUpload={(file) => {
                console.log('Uploading:', file);
                setShowUploader(false);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* How it works */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-3">How Prescription Scanning Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div className="flex gap-3">
              <span className="text-xl">1️⃣</span>
              <div>
                <p className="font-medium">Upload or Scan</p>
                <p className="text-blue-600">Take a photo or upload an image of your prescription</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-xl">2️⃣</span>
              <div>
                <p className="font-medium">AI Extraction</p>
                <p className="text-blue-600">Our OCR + AI extracts medication names, dosages, and schedules</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-xl">3️⃣</span>
              <div>
                <p className="font-medium">Review & Confirm</p>
                <p className="text-blue-600">Review extracted data and confirm to add to your records</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prescription List */}
      <div className="space-y-4">
        {prescriptions.map((rx) => {
          const status = statusConfig[rx.status] || statusConfig.pending;
          return (
            <Card key={rx.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{rx.description}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(rx.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>

                {rx.extractedMedications.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2">EXTRACTED MEDICATIONS</p>
                    <div className="space-y-2">
                      {rx.extractedMedications.map((med, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{med.name}</p>
                            <p className="text-xs text-gray-500">{med.dosage}</p>
                          </div>
                          {rx.status === 'extracted' && (
                            <Button size="sm" variant="outline">Confirm</Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
