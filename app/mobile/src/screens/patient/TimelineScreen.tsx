import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../lib/stores/auth-store';
import { patientApi } from '../../lib/api-client';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { EmptyState } from '../../components/ui/EmptyState';
import { colors, spacing, fontSize, borderRadius } from '../../lib/theme';

const eventTypeConfig: Record<string, { icon: string; color: string; label: string }> = {
  condition: { icon: '🩺', color: colors.primary[500], label: 'Condition' },
  medication: { icon: '💊', color: colors.accent[500], label: 'Medication' },
  allergy: { icon: '⚠️', color: colors.warning, label: 'Allergy' },
  immunization: { icon: '💉', color: colors.success, label: 'Immunization' },
  encounter: { icon: '🏥', color: '#8B5CF6', label: 'Visit' },
  prescription: { icon: '📋', color: '#EC4899', label: 'Prescription' },
  document: { icon: '📄', color: colors.neutral[500], label: 'Document' },
};

export function TimelineScreen() {
  const { user } = useAuthStore();

  const { data: profile } = useQuery({
    queryKey: ['patient', 'profile'],
    queryFn: patientApi.getProfile,
  });

  const patientId = profile?.id || user?.ananta_patient_id;

  const { data: timeline, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['timeline', patientId],
    queryFn: () => patientApi.getTimeline(patientId!, { limit: '50' }),
    enabled: !!patientId,
  });

  if (isLoading) return <LoadingScreen message="Loading timeline..." />;

  const events = timeline?.entries || [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Timeline</Text>
        <Text style={styles.subtitle}>Your complete medical history</Text>
      </View>

      {events.length === 0 ? (
        <EmptyState
          title="No timeline events"
          description="Your health events will appear here as you add records."
        />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          renderItem={({ item, index }) => (
            <TimelineEvent event={item} isLast={index === events.length - 1} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function TimelineEvent({ event, isLast }: { event: any; isLast: boolean }) {
  const config = eventTypeConfig[event.type] || eventTypeConfig.document;
  const date = event.date ? new Date(event.date) : null;

  return (
    <View style={styles.eventRow}>
      {/* Timeline line */}
      <View style={styles.timelineTrack}>
        <View style={[styles.dot, { backgroundColor: config.color }]}>
          <Text style={styles.dotIcon}>{config.icon}</Text>
        </View>
        {!isLast && <View style={styles.line} />}
      </View>

      {/* Content */}
      <Card style={styles.eventCard}>
        <View style={styles.eventHeader}>
          <Badge label={config.label} variant="info" />
          {date && (
            <Text style={styles.eventDate}>
              {date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          )}
        </View>
        <Text style={styles.eventTitle}>{event.title || event.description || 'Health Event'}</Text>
        {event.detail && <Text style={styles.eventDetail}>{event.detail}</Text>}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  header: { padding: spacing.lg, paddingBottom: spacing.sm },
  title: { fontSize: fontSize['2xl'], fontWeight: '800', color: colors.neutral[900] },
  subtitle: { fontSize: fontSize.sm, color: colors.neutral[500], marginTop: 2 },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing['3xl'] },
  eventRow: { flexDirection: 'row', gap: spacing.md },
  timelineTrack: { alignItems: 'center', width: 40 },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotIcon: { fontSize: 16 },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.neutral[200],
    marginVertical: spacing.xs,
  },
  eventCard: { flex: 1, marginBottom: spacing.md },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  eventDate: { fontSize: fontSize.xs, color: colors.neutral[400] },
  eventTitle: { fontSize: fontSize.base, fontWeight: '600', color: colors.neutral[800] },
  eventDetail: { fontSize: fontSize.sm, color: colors.neutral[500], marginTop: spacing.xs },
});
