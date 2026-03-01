"use client";

import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type {
  PatientData,
  Condition,
  Medication,
  Allergy,
  EmergencyContact,
} from "@/lib/mock-data";
import {
  AlertTriangle,
  Phone,
  Droplets,
  HeartPulse,
  Pill,
  ShieldAlert,
} from "lucide-react";

// =============================================================================
// EmergencyCardDisplay - Beautiful emergency card component
// =============================================================================

interface EmergencyCardDisplayProps {
  patient: PatientData;
  conditions: Condition[];
  medications: Medication[];
  allergies: Allergy[];
  emergencyContacts: EmergencyContact[];
  accessCode?: string;
  expiryDate?: string;
  className?: string;
}

export function EmergencyCardDisplay({
  patient,
  conditions,
  medications,
  allergies,
  emergencyContacts,
  accessCode,
  expiryDate,
  className,
}: EmergencyCardDisplayProps) {
  const activeConditions = conditions.filter(
    (c) => c.clinicalStatus === "active"
  );
  const activeMedications = medications.filter((m) => m.status === "active");
  const activeAllergies = allergies.filter(
    (a) => a.clinicalStatus === "active"
  );
  const highCriticalityAllergies = activeAllergies.filter(
    (a) => a.criticality === "high"
  );

  return (
    <div
      className={cn(
        "max-w-lg mx-auto rounded-2xl overflow-hidden shadow-xl border-2 border-red-200 emergency-pulse",
        className
      )}
    >
      {/* Header */}
      <div
        className="px-6 py-4 text-white"
        style={{ background: "var(--ananta-gradient-emergency)" }}
      >
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-8 w-8" />
          <div>
            <h2 className="text-lg font-bold tracking-wide">
              EMERGENCY MEDICAL CARD
            </h2>
            <p className="text-sm text-white/80">Ananta Health Platform</p>
          </div>
        </div>
      </div>

      {/* Patient Info */}
      <div className="px-6 py-4 bg-red-50 dark:bg-red-950/30 border-b border-red-100">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Patient Name
            </p>
            <p className="text-sm font-semibold text-foreground">
              {patient.givenName} {patient.familyName}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Date of Birth
            </p>
            <p className="text-sm font-semibold text-foreground">
              {formatDate(patient.birthDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Gender
            </p>
            <p className="text-sm font-semibold text-foreground capitalize">
              {patient.gender}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Droplets className="h-4 w-4 text-red-500" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Blood Type
              </p>
              <p className="text-lg font-bold text-red-600">
                {patient.bloodType}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Allergies */}
      {highCriticalityAllergies.length > 0 && (
        <div className="px-6 py-3 bg-red-100 dark:bg-red-950/50 border-b border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
              Critical Allergies
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {highCriticalityAllergies.map((a) => (
              <span
                key={a.id}
                className="px-2.5 py-1 rounded-full bg-red-200 text-red-800 text-xs font-semibold"
              >
                {a.substance} - {a.reaction}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="px-6 py-4 space-y-4 bg-card">
        {/* All Allergies */}
        {activeAllergies.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Allergies / Intolerances
              </span>
            </div>
            <ul className="space-y-1">
              {activeAllergies.map((a) => (
                <li key={a.id} className="text-sm text-foreground">
                  <span className="font-medium">{a.substance}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    - {a.manifestation}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Active Conditions */}
        {activeConditions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <HeartPulse className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Active Conditions
              </span>
            </div>
            <ul className="space-y-1">
              {activeConditions.map((c) => (
                <li key={c.id} className="text-sm text-foreground">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-muted-foreground capitalize">
                    {" "}
                    ({c.severity})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Active Medications */}
        {activeMedications.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Pill className="h-4 w-4 text-teal-500" />
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Current Medications
              </span>
            </div>
            <ul className="space-y-1">
              {activeMedications.map((m) => (
                <li key={m.id} className="text-sm text-foreground">
                  <span className="font-medium">{m.name}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    - {m.dosage}, {m.frequency}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Emergency Contacts */}
        {emergencyContacts.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4 text-green-500" />
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Emergency Contacts
              </span>
            </div>
            <ul className="space-y-1">
              {emergencyContacts.map((ec) => (
                <li key={ec.id} className="text-sm text-foreground">
                  <span className="font-medium">{ec.name}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    ({ec.relationship}) -{" "}
                  </span>
                  <a
                    href={`tel:${ec.phone}`}
                    className="text-primary hover:underline"
                  >
                    {ec.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-muted/50 border-t flex items-center justify-between">
        {accessCode && (
          <div>
            <p className="text-xs text-muted-foreground">Access Code</p>
            <p className="text-sm font-mono font-bold text-foreground">
              {accessCode}
            </p>
          </div>
        )}
        {expiryDate && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Valid Until</p>
            <p className="text-sm font-medium text-foreground">
              {formatDate(expiryDate)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
