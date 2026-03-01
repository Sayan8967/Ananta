'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export default function ClinicalNotesPage() {
  const [isComposing, setIsComposing] = useState(false);

  const notes = [
    {
      id: '1',
      patientName: 'Rahul Sharma',
      date: '2026-02-25',
      type: 'Follow-up',
      summary: 'Routine diabetic follow-up. HbA1c improved to 6.8% from 7.2%. Continue current medications. Advised dietary modifications and 30 min daily exercise.',
      status: 'signed',
    },
    {
      id: '2',
      patientName: 'Priya Patel',
      date: '2026-02-24',
      type: 'New Complaint',
      summary: 'Patient presents with acute exacerbation of asthma. Increased frequency of attacks in past week. Prescribed short-course oral prednisolone and adjusted inhaler dosage.',
      status: 'signed',
    },
    {
      id: '3',
      patientName: 'Amit Kumar',
      date: '2026-02-22',
      type: 'Lab Review',
      summary: 'Reviewing lipid panel results. LDL still elevated at 145. Increasing Atorvastatin from 10mg to 20mg. Repeat lipid panel in 3 months.',
      status: 'draft',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clinical Notes</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your clinical documentation</p>
        </div>
        <Button onClick={() => setIsComposing(!isComposing)}>
          {isComposing ? 'Cancel' : '+ New Note'}
        </Button>
      </div>

      {/* Compose Note */}
      {isComposing && (
        <Card className="border-teal-200">
          <CardHeader>
            <CardTitle className="text-lg">New Clinical Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Patient</label>
                <Input placeholder="Search patient by name or ID..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Note Type</label>
                <select className="w-full h-10 rounded-md border border-gray-200 px-3 text-sm">
                  <option>Follow-up</option>
                  <option>New Complaint</option>
                  <option>Lab Review</option>
                  <option>Procedure Note</option>
                  <option>Discharge Summary</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Clinical Note</label>
              <Textarea
                placeholder="Enter your clinical observations, diagnosis, and treatment plan..."
                className="min-h-[200px]"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsComposing(false)}>Save as Draft</Button>
              <Button>Sign & Submit</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id} className={note.status === 'draft' ? 'border-amber-200' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-sm">
                    {note.patientName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{note.patientName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(note.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{note.type}</Badge>
                  <Badge variant={note.status === 'signed' ? 'default' : 'secondary'}>
                    {note.status === 'signed' ? 'Signed' : 'Draft'}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{note.summary}</p>
              <div className="flex justify-end mt-4 gap-2">
                {note.status === 'draft' && (
                  <Button size="sm" variant="outline">Edit</Button>
                )}
                <Button size="sm" variant="outline">View Full</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
