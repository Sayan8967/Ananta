import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { emergencyApi } from '../../lib/api-client';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { colors, spacing, fontSize, borderRadius } from '../../lib/theme';

export function EmergencyAccessScreen() {
  const [accessCode, setAccessCode] = useState('');
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const { data: card, isLoading, error } = useQuery({
    queryKey: ['emergency-card-public', submittedCode],
    queryFn: () => emergencyApi.getCardByCode(submittedCode!),
    enabled: !!submittedCode,
    retry: false,
  });

  const handleLookup = () => {
    const code = accessCode.trim().toUpperCase();
    if (!code || code.length < 6) {
      Alert.alert('Invalid Code', 'Please enter a valid 8-character emergency access code.');
      return;
    }
    setSubmittedCode(code);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🆘</Text>
          <Text style={styles.title}>Emergency Access</Text>
          <Text style={styles.subtitle}>
            Enter the patient's emergency access code to view their critical medical information.
            No login required.
          </Text>
        </View>

        {/* Code Input */}
        <Card>
          <Text style={styles.inputLabel}>Emergency Access Code</Text>
          <TextInput
            style={styles.codeInput}
            value={accessCode}
            onChangeText={setAccessCode}
            placeholder="Enter 8-character code"
            placeholderTextColor={colors.neutral[400]}
            autoCapitalize="characters"
            maxLength={12}
            autoCorrect={false}
          />
          <Button title="View Emergency Card" variant="danger" onPress={handleLookup} size="lg" />
        </Card>

        {/* Loading State */}
        {isLoading && <LoadingScreen message="Retrieving emergency card..." />}

        {/* Error State */}
        {error && submittedCode && (
          <Card>
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>❌</Text>
              <Text style={styles.errorTitle}>Card Not Found</Text>
              <Text style={styles.errorText}>
                No emergency card found for this access code. Please check the code and try again.
              </Text>
            </View>
          </Card>
        )}

        {/* Emergency Card Display */}
        {card && (
          <View style={styles.emergencyCardWrapper}>
            <View style={styles.emergencyCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLogo}>♾️ ANANTA</Text>
                <Text style={styles.cardType}>EMERGENCY MEDICAL INFORMATION</Text>
              </View>

              <View style={styles.cardBody}>
                <InfoRow label="Patient" value={card.patientName || 'N/A'} />
                <InfoRow label="Blood Type" value={card.bloodType || 'Unknown'} />
                <InfoRow label="Age" value={card.age ? `${card.age} years` : 'Unknown'} />

                {card.allergies?.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚠️ ALLERGIES (CRITICAL)</Text>
                    <View style={styles.chipRow}>
                      {card.allergies.map((a: string, i: number) => (
                        <Badge key={i} label={a} variant="danger" size="md" />
                      ))}
                    </View>
                  </View>
                )}

                {card.medications?.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>💊 CURRENT MEDICATIONS</Text>
                    {card.medications.map((m: string, i: number) => (
                      <Text key={i} style={styles.medText}>• {m}</Text>
                    ))}
                  </View>
                )}

                {card.conditions?.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🩺 ACTIVE CONDITIONS</Text>
                    <View style={styles.chipRow}>
                      {card.conditions.map((c: string, i: number) => (
                        <Badge key={i} label={c} variant="info" size="md" />
                      ))}
                    </View>
                  </View>
                )}

                {card.emergencyContact && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📞 EMERGENCY CONTACT</Text>
                    <Text style={styles.contactName}>{card.emergencyContact.name}</Text>
                    <Text style={styles.contactPhone}>{card.emergencyContact.phone}</Text>
                    {card.emergencyContact.relationship && (
                      <Text style={styles.contactRelation}>{card.emergencyContact.relationship}</Text>
                    )}
                  </View>
                )}
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.footerText}>
                  This information is provided for emergency medical purposes only.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.emergency[50] },
  scroll: { padding: spacing.lg, gap: spacing.lg },
  header: { alignItems: 'center', paddingVertical: spacing.xl },
  headerIcon: { fontSize: 48, marginBottom: spacing.md },
  title: { fontSize: fontSize['2xl'], fontWeight: '800', color: colors.emergency[700] },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.neutral[600],
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  inputLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.neutral[700], marginBottom: spacing.sm },
  codeInput: {
    backgroundColor: colors.neutral[50],
    borderWidth: 2,
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    fontSize: fontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 3,
    color: colors.neutral[800],
    marginBottom: spacing.lg,
  },
  errorContainer: { alignItems: 'center', padding: spacing.lg },
  errorIcon: { fontSize: 40 },
  errorTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.emergency[600], marginTop: spacing.sm },
  errorText: { fontSize: fontSize.sm, color: colors.neutral[500], textAlign: 'center', marginTop: spacing.xs },
  emergencyCardWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  emergencyCard: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.emergency[300],
  },
  cardHeader: {
    backgroundColor: colors.emergency[600],
    padding: spacing.lg,
    alignItems: 'center',
  },
  cardLogo: { fontSize: fontSize.lg, fontWeight: '800', color: colors.neutral[0], letterSpacing: 2 },
  cardType: { fontSize: fontSize.xs, fontWeight: '700', color: colors.emergency[100], marginTop: 4 },
  cardBody: { padding: spacing.lg, gap: spacing.md },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  infoLabel: { fontSize: fontSize.sm, color: colors.neutral[500] },
  infoValue: { fontSize: fontSize.base, fontWeight: '700', color: colors.neutral[800] },
  section: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.neutral[600],
    marginBottom: spacing.sm,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  medText: { fontSize: fontSize.sm, color: colors.neutral[700], marginTop: 2 },
  contactName: { fontSize: fontSize.base, fontWeight: '600', color: colors.neutral[800] },
  contactPhone: { fontSize: fontSize.sm, color: colors.primary[600], marginTop: 2 },
  contactRelation: { fontSize: fontSize.xs, color: colors.neutral[400], marginTop: 2 },
  cardFooter: {
    backgroundColor: colors.emergency[50],
    padding: spacing.md,
    alignItems: 'center',
  },
  footerText: { fontSize: fontSize.xs, color: colors.neutral[500], textAlign: 'center' },
});
