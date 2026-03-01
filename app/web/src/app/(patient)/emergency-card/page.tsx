'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmergencyCardDisplay } from '@/components/patient/EmergencyCardDisplay';

export default function EmergencyCardPage() {
  // Mock data
  const emergencyCard = {
    accessCode: 'ANT8K2M5',
    patientName: 'Rahul Sharma',
    bloodType: 'B+',
    age: 34,
    allergies: ['Penicillin', 'Sulfa drugs', 'Peanuts'],
    medications: ['Metformin 500mg (twice daily)', 'Amlodipine 5mg (morning)'],
    conditions: ['Type 2 Diabetes', 'Hypertension'],
    emergencyContact: {
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      relationship: 'Spouse',
    },
    expiresAt: '2026-06-28T00:00:00Z',
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/emergency/card/${emergencyCard.accessCode}`;
    if (navigator.share) {
      await navigator.share({
        title: 'Ananta Emergency Card',
        text: `Emergency Medical Card - Access Code: ${emergencyCard.accessCode}`,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Emergency Card</h1>
        <p className="text-sm text-gray-500 mt-1">
          Share this card for emergency medical access — no login required
        </p>
      </div>

      {/* Info Banner */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🆘</span>
            <div>
              <h3 className="font-semibold text-red-900">What is an Emergency Card?</h3>
              <p className="text-sm text-red-700 mt-1">
                Your emergency card contains critical medical information that healthcare providers can access instantly
                using an access code — no Ananta account needed. Share it with family members or keep the code in your
                wallet.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Card Display */}
      <EmergencyCardDisplay card={emergencyCard} />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="bg-red-600 hover:bg-red-700 flex-1" size="lg" onClick={handleShare}>
          Share Emergency Card
        </Button>
        <Button variant="outline" className="flex-1">
          Regenerate Card
        </Button>
        <Button variant="outline" className="flex-1">
          Print Card
        </Button>
      </div>

      {/* Access Code Display */}
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Your Emergency Access Code</p>
          <p className="text-4xl font-mono font-bold text-red-600 tracking-[0.3em]">
            {emergencyCard.accessCode}
          </p>
          <p className="text-xs text-gray-400 mt-3">
            Anyone with this code can view your emergency medical data at{' '}
            <span className="font-medium">ananta.health/emergency</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
