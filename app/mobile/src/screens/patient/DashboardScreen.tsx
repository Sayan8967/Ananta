import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../lib/stores/auth-store';
import { patientApi } from '../../lib/api-client';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { colors, spacing, fontSize, borderRadius } from '../../lib/theme';

export function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();

  const { data: profile, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['patient', 'profile'],
    queryFn: patientApi.getProfile,
  });

  const patientId = profile?.id || user?.ananta_patient_id;

  const { data: conditions } = useQuery({
    queryKey: ['conditions', patientId],
    queryFn: () => patientApi.getConditions(patientId!),
    enabled: !!patientId,
  });

  const { data: medications } = useQuery({
    queryKey: ['medications', patientId],
    queryFn: () => patientApi.getMedications(patientId!),
    enabled: !!patientId,
  });

  const { data: allergies } = useQuery({
    queryKey: ['allergies', patientId],
    queryFn: () => patientApi.getAllergies(patientId!),
    enabled: !!patientId,
  });

  if (isLoading) return <LoadingScreen />;

  const greeting = getGreeting();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.userName}>{user?.given_name || 'Patient'}</Text>
          </View>
          <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.avatarText}>
              {(user?.given_name?.[0] || 'P').toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <QuickActionButton icon="📸" label="Scan Rx" onPress={() => navigation.navigate('Prescriptions')} />
          <QuickActionButton icon="🆘" label="Emergency" onPress={() => navigation.navigate('EmergencyCard')} />
          <QuickActionButton icon="📊" label="Timeline" onPress={() => navigation.navigate('Timeline')} />
          <QuickActionButton icon="📋" label="Records" onPress={() => navigation.navigate('Records')} />
        </View>

        {/* Active Conditions */}
        <Card
          title="Active Conditions"
          subtitle={`${conditions?.entry?.length || 0} conditions`}
          onPress={() => navigation.navigate('Records', { tab: 'conditions' })}
        >
          {conditions?.entry?.length ? (
            <View style={styles.chipContainer}>
              {conditions.entry.slice(0, 5).map((entry: any, i: number) => (
                <Badge
                  key={i}
                  label={entry.resource?.code?.coding?.[0]?.display || 'Unknown'}
                  variant="info"
                  size="md"
                />
              ))}
              {conditions.entry.length > 5 && (
                <Badge label={`+${conditions.entry.length - 5} more`} variant="outline" />
              )}
            </View>
          ) : (
            <Text style={styles.emptyText}>No active conditions recorded</Text>
          )}
        </Card>

        {/* Current Medications */}
        <Card
          title="Current Medications"
          subtitle={`${medications?.entry?.length || 0} medications`}
          onPress={() => navigation.navigate('Records', { tab: 'medications' })}
        >
          {medications?.entry?.length ? (
            <View style={styles.listContainer}>
              {medications.entry.slice(0, 4).map((entry: any, i: number) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.listIcon}>💊</Text>
                  <View style={styles.listContent}>
                    <Text style={styles.listTitle}>
                      {entry.resource?.medicationCodeableConcept?.coding?.[0]?.display || 'Unknown'}
                    </Text>
                    {entry.resource?.dosage?.[0]?.text && (
                      <Text style={styles.listSubtext}>{entry.resource.dosage[0].text}</Text>
                    )}
                  </View>
                  <Badge
                    label={entry.resource?.status || 'active'}
                    variant={entry.resource?.status === 'active' ? 'success' : 'default'}
                  />
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No medications recorded</Text>
          )}
        </Card>

        {/* Allergies Alert */}
        <Card
          title="Allergies & Intolerances"
          subtitle={`${allergies?.entry?.length || 0} recorded`}
          onPress={() => navigation.navigate('Records', { tab: 'allergies' })}
        >
          {allergies?.entry?.length ? (
            <View style={styles.chipContainer}>
              {allergies.entry.map((entry: any, i: number) => (
                <Badge
                  key={i}
                  label={entry.resource?.code?.coding?.[0]?.display || 'Unknown'}
                  variant={entry.resource?.criticality === 'high' ? 'danger' : 'warning'}
                  size="md"
                />
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No allergies recorded</Text>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickActionButton({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={quickActionStyles.button} onPress={onPress} activeOpacity={0.7}>
      <Text style={quickActionStyles.icon}>{icon}</Text>
      <Text style={quickActionStyles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning,';
  if (hour < 17) return 'Good afternoon,';
  return 'Good evening,';
}

const quickActionStyles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  icon: { fontSize: 24 },
  label: { fontSize: fontSize.xs, fontWeight: '600', color: colors.primary[700] },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, gap: spacing.lg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { fontSize: fontSize.sm, color: colors.neutral[500] },
  userName: { fontSize: fontSize['2xl'], fontWeight: '800', color: colors.neutral[900] },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: fontSize.lg, fontWeight: '700', color: colors.neutral[0] },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  listContainer: { gap: spacing.md },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  listIcon: { fontSize: 20 },
  listContent: { flex: 1 },
  listTitle: { fontSize: fontSize.sm, fontWeight: '600', color: colors.neutral[800] },
  listSubtext: { fontSize: fontSize.xs, color: colors.neutral[500], marginTop: 2 },
  emptyText: { fontSize: fontSize.sm, color: colors.neutral[400], fontStyle: 'italic' },
});
