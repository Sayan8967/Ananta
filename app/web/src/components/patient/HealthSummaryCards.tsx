"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { Condition, Medication, Allergy } from "@/lib/mock-data";
import { HeartPulse, Pill, AlertTriangle } from "lucide-react";

// =============================================================================
// HealthSummaryCards - Summary cards for patient dashboard
// =============================================================================

interface HealthSummaryCardsProps {
  conditions: Condition[];
  medications: Medication[];
  allergies: Allergy[];
}

export function HealthSummaryCards({
  conditions,
  medications,
  allergies,
}: HealthSummaryCardsProps) {
  const activeConditions = conditions.filter(
    (c) => c.clinicalStatus === "active"
  );
  const activeMedications = medications.filter((m) => m.status === "active");
  const activeAllergies = allergies.filter(
    (a) => a.clinicalStatus === "active"
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Conditions Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-primary" />
              Conditions
            </CardTitle>
            <Badge variant="secondary">{activeConditions.length} active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {activeConditions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No active conditions
            </p>
          ) : (
            <ul className="space-y-2.5">
              {activeConditions.map((condition) => (
                <li
                  key={condition.id}
                  className="flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {condition.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {condition.codeSystem}: {condition.codeValue}
                    </p>
                  </div>
                  <StatusBadge status={condition.severity} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Medications Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Pill className="h-5 w-5 text-[var(--ananta-accent)]" />
              Medications
            </CardTitle>
            <Badge variant="secondary">{activeMedications.length} active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {activeMedications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No active medications
            </p>
          ) : (
            <ul className="space-y-2.5">
              {activeMedications.map((med) => (
                <li key={med.id} className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {med.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {med.dosage} &middot; {med.frequency}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Allergies Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Allergies
            </CardTitle>
            <Badge variant="secondary">{activeAllergies.length} active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {activeAllergies.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No known allergies
            </p>
          ) : (
            <ul className="space-y-2.5">
              {activeAllergies.map((allergy) => (
                <li
                  key={allergy.id}
                  className="flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {allergy.substance}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {allergy.reaction}
                    </p>
                  </div>
                  <StatusBadge status={allergy.criticality} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
