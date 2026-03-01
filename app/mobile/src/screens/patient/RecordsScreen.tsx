import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../lib/stores/auth-store';
import { patientApi } from '../../lib/api-client';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { EmptyState } from '../../components/ui/EmptyState';
import { colors, spacing, fontSize, borderRadius } from '../../lib/theme';

type TabKey = 'conditions' | 'medications' | 'allergies' | 'immunizations';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'conditions', label: 'Conditions', icon: '🩺' },
  { key: 'medications', label: 'Medications', icon: '💊' },
  { key: 'allergies', label: 'Allergies', icon: '⚠️' },
  { key: 'immunizations', label: 'Vaccines', icon: '💉' },
];

export function RecordsScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('conditions');
  const { user } = useAuthStore();

  const { data: profile } = useQuery({
    queryKey: ['patient', 'profile'],
    queryFn: patientApi.getProfile,
  });

  const patientId = profile?.id || user?.ananta_patient_id;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Records</Text>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      {patientId ? (
        <TabContent activeTab={activeTab} patientId={patientId} />
      ) : (
        <LoadingScreen message="Loading patient data..." />
      )}
    </SafeAreaView>
  );
}

function TabContent({ activeTab, patientId }: { activeTab: TabKey; patientId: string }) {
  const queryMap: Record<TabKey, { queryKey: string[]; queryFn: () => Promise<any> }> = {
    conditions: {
      queryKey: ['conditions', patientId],
      queryFn: () => patientApi.getConditions(patientId),
    },
    medications: {
      queryKey: ['medications', patientId],
      queryFn: () => patientApi.getMedications(patientId),
    },
    allergies: {
      queryKey: ['allergies', patientId],
      queryFn: () => patientApi.getAllergies(patientId),
    },
    immunizations: {
      queryKey: ['immunizations', patientId],
      queryFn: () => patientApi.getImmunizations(patientId),
    },
  };

  const { queryKey, queryFn } = queryMap[activeTab];
  const { data, isLoading } = useQuery({ queryKey, queryFn });

  if (isLoading) return <LoadingScreen />;

  const entries = data?.entry || [];

  if (entries.length === 0) {
    return (
      <EmptyState
        title={`No ${activeTab} recorded`}
        description={`Add your ${activeTab} to keep your medical history complete.`}
        actionLabel={`Add ${activeTab.slice(0, -1)}`}
        onAction={() => {}}
      />
    );
  }

  return (
    <FlatList
      data={entries}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <RecordItem entry={item} type={activeTab} />}
    />
  );
}

function RecordItem({ entry, type }: { entry: any; type: TabKey }) {
  const resource = entry.resource;

  const getDisplayInfo = () => {
    switch (type) {
      case 'conditions':
        return {
          title: resource?.code?.coding?.[0]?.display || 'Unknown Condition',
          subtitle: resource?.clinicalStatus?.coding?.[0]?.code || '',
          badge: resource?.clinicalStatus?.coding?.[0]?.code,
          badgeVariant: resource?.clinicalStatus?.coding?.[0]?.code === 'active' ? 'danger' as const : 'success' as const,
          date: resource?.onsetDateTime,
        };
      case 'medications':
        return {
          title: resource?.medicationCodeableConcept?.coding?.[0]?.display || 'Unknown Medication',
          subtitle: resource?.dosage?.[0]?.text || '',
          badge: resource?.status,
          badgeVariant: resource?.status === 'active' ? 'success' as const : 'default' as const,
          date: resource?.effectiveDateTime,
        };
      case 'allergies':
        return {
          title: resource?.code?.coding?.[0]?.display || 'Unknown Allergy',
          subtitle: resource?.reaction?.[0]?.manifestation?.[0]?.coding?.[0]?.display || '',
          badge: resource?.criticality,
          badgeVariant: resource?.criticality === 'high' ? 'danger' as const : 'warning' as const,
          date: resource?.onsetDateTime,
        };
      case 'immunizations':
        return {
          title: resource?.vaccineCode?.coding?.[0]?.display || 'Unknown Vaccine',
          subtitle: resource?.site?.coding?.[0]?.display || '',
          badge: resource?.status,
          badgeVariant: resource?.status === 'completed' ? 'success' as const : 'info' as const,
          date: resource?.occurrenceDateTime,
        };
    }
  };

  const info = getDisplayInfo();

  return (
    <Card style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <Text style={styles.recordTitle} numberOfLines={1}>{info.title}</Text>
        {info.badge && <Badge label={info.badge} variant={info.badgeVariant} />}
      </View>
      {info.subtitle ? <Text style={styles.recordSubtitle}>{info.subtitle}</Text> : null}
      {info.date && (
        <Text style={styles.recordDate}>
          {new Date(info.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  header: { padding: spacing.lg, paddingBottom: spacing.sm },
  title: { fontSize: fontSize['2xl'], fontWeight: '800', color: colors.neutral[900] },
  tabBar: {
    flexGrow: 0,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral[100],
    marginRight: spacing.sm,
    gap: spacing.xs,
  },
  tabActive: { backgroundColor: colors.primary[600] },
  tabIcon: { fontSize: 16 },
  tabLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.neutral[600] },
  tabLabelActive: { color: colors.neutral[0] },
  list: { padding: spacing.lg, gap: spacing.md },
  recordCard: { marginBottom: 0 },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  recordTitle: { fontSize: fontSize.base, fontWeight: '600', color: colors.neutral[800], flex: 1 },
  recordSubtitle: { fontSize: fontSize.sm, color: colors.neutral[500], marginTop: spacing.xs },
  recordDate: { fontSize: fontSize.xs, color: colors.neutral[400], marginTop: spacing.xs },
});
