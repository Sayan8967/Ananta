"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import {
  mockConditions,
  mockMedications,
  mockAllergies,
  mockImmunizations,
} from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Separator } from "@/components/ui/separator";
import { HeartPulse, Pill, AlertTriangle, Syringe } from "lucide-react";

// =============================================================================
// Health Records Page - Tabs for conditions, medications, allergies, immunizations
// =============================================================================

type Tab = "conditions" | "medications" | "allergies" | "immunizations";

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "conditions", label: "Conditions", icon: HeartPulse },
  { key: "medications", label: "Medications", icon: Pill },
  { key: "allergies", label: "Allergies", icon: AlertTriangle },
  { key: "immunizations", label: "Immunizations", icon: Syringe },
];

export default function RecordsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("conditions");

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Health Records</h1>
        <p className="text-muted-foreground mt-1">
          Your complete medical records organized by category.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <Separator />

      {/* Tab Content */}
      {activeTab === "conditions" && <ConditionsTab />}
      {activeTab === "medications" && <MedicationsTab />}
      {activeTab === "allergies" && <AllergiesTab />}
      {activeTab === "immunizations" && <ImmunizationsTab />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Conditions Tab
// ---------------------------------------------------------------------------

function ConditionsTab() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {mockConditions.map((condition) => (
        <Card key={condition.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base">{condition.name}</CardTitle>
              <StatusBadge status={condition.clinicalStatus} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Code:</span>{" "}
                <span className="font-medium">
                  {condition.codeSystem} {condition.codeValue}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Severity:</span>{" "}
                <StatusBadge status={condition.severity} />
              </div>
              <div>
                <span className="text-muted-foreground">Onset:</span>{" "}
                <span className="font-medium">
                  {formatDate(condition.onsetDate)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Verification:</span>{" "}
                <StatusBadge status={condition.verificationStatus} />
              </div>
              {condition.abatementDate && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Resolved:</span>{" "}
                  <span className="font-medium">
                    {formatDate(condition.abatementDate)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Medications Tab
// ---------------------------------------------------------------------------

function MedicationsTab() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {mockMedications.map((med) => (
        <Card key={med.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base">{med.name}</CardTitle>
              <StatusBadge status={med.status} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Dosage:</span>{" "}
                <span className="font-medium">{med.dosage}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Route:</span>{" "}
                <span className="font-medium capitalize">{med.route}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Frequency:</span>{" "}
                <span className="font-medium">{med.frequency}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Start:</span>{" "}
                <span className="font-medium">
                  {formatDate(med.startDate)}
                </span>
              </div>
              {med.endDate && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">End:</span>{" "}
                  <span className="font-medium">
                    {formatDate(med.endDate)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Allergies Tab
// ---------------------------------------------------------------------------

function AllergiesTab() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {mockAllergies.map((allergy) => (
        <Card
          key={allergy.id}
          className={cn(
            allergy.criticality === "high" && "border-red-200 dark:border-red-900"
          )}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base">{allergy.substance}</CardTitle>
              <StatusBadge status={allergy.criticality} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Type:</span>{" "}
                <span className="font-medium capitalize">{allergy.type}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Category:</span>{" "}
                <span className="font-medium capitalize">
                  {allergy.category}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Reaction:</span>{" "}
                <span className="font-medium">{allergy.reaction}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>{" "}
                <StatusBadge status={allergy.clinicalStatus} />
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Manifestation:</span>{" "}
                <span className="font-medium">{allergy.manifestation}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Immunizations Tab
// ---------------------------------------------------------------------------

function ImmunizationsTab() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {mockImmunizations.map((imm) => (
        <Card key={imm.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base">{imm.vaccineName}</CardTitle>
              <StatusBadge status={imm.status} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Date:</span>{" "}
                <span className="font-medium">{formatDate(imm.date)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Lot:</span>{" "}
                <span className="font-mono text-xs">{imm.lotNumber}</span>
              </div>
              {imm.site && (
                <div>
                  <span className="text-muted-foreground">Site:</span>{" "}
                  <span className="font-medium">{imm.site}</span>
                </div>
              )}
              {imm.performer && (
                <div>
                  <span className="text-muted-foreground">By:</span>{" "}
                  <span className="font-medium">{imm.performer}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
