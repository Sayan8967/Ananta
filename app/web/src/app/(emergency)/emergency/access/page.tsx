'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function EmergencyAccessPage() {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = accessCode.trim().toUpperCase();
    if (!code || code.length < 6) {
      setError('Please enter a valid emergency access code (8 characters).');
      return;
    }
    setError('');
    router.push(`/emergency/card/${code}`);
  };

  return (
    <div className="space-y-8">
      {/* Instructions */}
      <div className="text-center">
        <p className="text-lg text-red-800 font-medium mt-2">
          Enter the patient's emergency access code to view their critical medical information.
        </p>
        <p className="text-sm text-red-600 mt-2">No login or account required.</p>
      </div>

      {/* Code Input */}
      <Card className="border-red-200">
        <CardContent className="pt-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Emergency Access Code
              </label>
              <Input
                value={accessCode}
                onChange={(e) => {
                  setAccessCode(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="e.g. ANT8K2M5"
                className="text-center text-3xl font-mono font-bold tracking-[0.3em] h-16 border-2 border-red-200 focus:border-red-500"
                maxLength={12}
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 h-14 text-lg"
              size="lg"
            >
              View Emergency Medical Card
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Info */}
      <div className="bg-white rounded-xl p-6 border border-red-200">
        <h3 className="font-semibold text-gray-900 mb-4">How Emergency Access Works</h3>
        <div className="space-y-4 text-sm text-gray-600">
          <div className="flex gap-3">
            <span className="text-lg shrink-0">1️⃣</span>
            <p>The patient shares their unique emergency access code (found in their Ananta app or on a physical card).</p>
          </div>
          <div className="flex gap-3">
            <span className="text-lg shrink-0">2️⃣</span>
            <p>Enter the code above to instantly view their critical medical data: allergies, medications, conditions, and emergency contacts.</p>
          </div>
          <div className="flex gap-3">
            <span className="text-lg shrink-0">3️⃣</span>
            <p>Access is read-only and time-limited. No modifications can be made to the patient's records.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
