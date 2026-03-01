'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmergencyCardDisplay } from '@/components/patient/EmergencyCardDisplay';
import { mockPatient, mockConditions, mockMedications, mockAllergies, mockEmergencyContacts } from '@/lib/mock-data';

const accessCode = 'ANT8K2M5';

export default function EmergencyCardPage() {
  const handleShare = async () => {
    const url = `${window.location.origin}/emergency/card/${accessCode}`;
    if (navigator.share) {
      await navigator.share({ title: 'Ananta Emergency Card', text: `Access Code: ${accessCode}`, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Emergency Card</h1>
        <p className="text-sm text-gray-500 mt-1">Share this card for emergency medical access — no login required</p>
      </div>

      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🆘</span>
            <div>
              <h3 className="font-semibold text-red-900">What is an Emergency Card?</h3>
              <p className="text-sm text-red-700 mt-1">
                Your emergency card contains critical medical information accessible via access code — no Ananta account needed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <EmergencyCardDisplay
        patient={mockPatient}
        conditions={mockConditions}
        medications={mockMedications}
        allergies={mockAllergies}
        emergencyContacts={mockEmergencyContacts}
        accessCode={accessCode}
        expiryDate="2026-06-28"
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="bg-red-600 hover:bg-red-700 flex-1" size="lg" onClick={handleShare}>Share Emergency Card</Button>
        <Button variant="outline" className="flex-1">Regenerate Card</Button>
        <Button variant="outline" className="flex-1">Print Card</Button>
      </div>

      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Your Emergency Access Code</p>
          <p className="text-4xl font-mono font-bold text-red-600 tracking-[0.3em]">{accessCode}</p>
          <p className="text-xs text-gray-400 mt-3">Anyone with this code can view your emergency medical data</p>
        </CardContent>
      </Card>
    </div>
  );
}
