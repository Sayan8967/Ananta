import React from 'react';
import { View, Text, StyleSheet, ScrollView, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emergencyApi } from '../../lib/api-client';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { colors, spacing, fontSize, borderRadius } from '../../lib/theme';

export function EmergencyCardScreen() {
  const queryClient = useQueryClient();

  const { data: card, isLoading } = useQuery({
    queryKey: ['emergency-card'],
    queryFn: emergencyApi.getCard,
  });

  const generateMutation = useMutation({
    mutationFn: emergencyApi.generateCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-card'] });
    },
    onError: () => {
      Alert.alert('Error', 'Failed to generate emergency card.');
    },
  });

  const handleShare = async () => {
    if (!card?.accessCode) return;
    try {
      const url = `${process.env.EXPO_PUBLIC_WEB_URL || 'https://ananta.health'}/emergency/${card.accessCode}`;
      await Share.share({
        title: 'Ananta Emergency Card',
        message: `My Ananta Emergency Medical Card\nAccess Code: ${card.accessCode}\n\nView at: ${url}`,
      });
    } catch (err) {
      // User cancelled
    }
  };

  if (isLoading) return <LoadingScreen message="Loading emergency card..." />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>🆘 Emergency Card</Text>
          <Text style={styles.subtitle}>
            Share this card for emergency medical access — no login required
          </Text>
        </View>

        {!card ? (
          <View style={styles.generateSection}>
            <Card>
              <Text style={styles.generateTitle}>Generate Your Emergency Card</Text>
              <Text style={styles.generateDescription}>
                Your emergency card will contain your critical medical information including blood type, allergies,
                medications, and emergency contacts. It can be accessed by healthcare providers without an Ananta
                account.
              </Text>
              <Button
                title="Generate Emergency Card"
                variant="danger"
                onPress={() => generateMutation.mutate()}
                loading={generateMutation.isPending}
                style={{ marginTop: spacing.lg }}
              />
            </Card>
          </View>
        ) : (
          <>
            {/* Emergency Card Display */}
            <View style={styles.cardContainer}>
              <View style={styles.emergencyCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardLogo}>♾️ ANANTA</Text>
                  <Text style={styles.cardType}>EMERGENCY MEDICAL CARD</Text>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>Name</Text>
                    <Text style={styles.cardValue}>{card.patientName || 'N/A'}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>Blood Type</Text>
                    <Text style={styles.cardValue}>{card.bloodType || 'Unknown'}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>Access Code</Text>
                    <Text style={[styles.cardValue, styles.codeText]}>{card.accessCode}</Text>
                  </View>

                  {card.allergies?.length > 0 && (
                    <View style={styles.cardSection}>
                      <Text style={styles.cardSectionTitle}>⚠️ ALLERGIES</Text>
                      <View style={styles.chipRow}>
                        {card.allergies.map((a: string, i: number) => (
                          <Badge key={i} label={a} variant="danger" size="md" />
                        ))}
                      </View>
                    </View>
                  )}

                  {card.medications?.length > 0 && (
                    <View style={styles.cardSection}>
                      <Text style={styles.cardSectionTitle}>💊 CURRENT MEDICATIONS</Text>
                      {card.medications.map((m: string, i: number) => (
                        <Text key={i} style={styles.medText}>• {m}</Text>
                      ))}
                    </View>
                  )}

                  {card.conditions?.length > 0 && (
                    <View style={styles.cardSection}>
                      <Text style={styles.cardSectionTitle}>🩺 CONDITIONS</Text>
                      <View style={styles.chipRow}>
                        {card.conditions.map((c: string, i: number) => (
                          <Badge key={i} label={c} variant="info" size="md" />
                        ))}
                      </View>
                    </View>
                  )}

                  {card.emergencyContact && (
                    <View style={styles.cardSection}>
                      <Text style={styles.cardSectionTitle}>📞 EMERGENCY CONTACT</Text>
                      <Text style={styles.contactText}>{card.emergencyContact.name}</Text>
                      <Text style={styles.contactText}>{card.emergencyContact.phone}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.footerText}>
                    Valid until: {card.expiresAt ? new Date(card.expiresAt).toLocaleDateString() : 'N/A'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Button title="Share Emergency Card" variant="danger" onPress={handleShare} size="lg" />
              <Button
                title="Regenerate Card"
                variant="outline"
                onPress={() => generateMutation.mutate()}
                loading={generateMutation.isPending}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  scroll: { padding: spacing.lg, gap: spacing.lg },
  header: { marginBottom: spacing.sm },
  title: { fontSize: fontSize['2xl'], fontWeight: '800', color: colors.neutral[900] },
  subtitle: { fontSize: fontSize.sm, color: colors.neutral[500], marginTop: 4 },
  generateSection: { marginTop: spacing.lg },
  generateTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.neutral[800] },
  generateDescription: { fontSize: fontSize.sm, color: colors.neutral[500], marginTop: spacing.sm, lineHeight: 22 },
  cardContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  emergencyCard: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.emergency[200],
  },
  cardHeader: {
    backgroundColor: colors.emergency[600],
    padding: spacing.lg,
    alignItems: 'center',
  },
  cardLogo: { fontSize: fontSize.lg, fontWeight: '800', color: colors.neutral[0], letterSpacing: 2 },
  cardType: { fontSize: fontSize.xs, fontWeight: '700', color: colors.emergency[100], marginTop: 4, letterSpacing: 1 },
  cardBody: { padding: spacing.lg, gap: spacing.md },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontSize: fontSize.sm, color: colors.neutral[500], fontWeight: '500' },
  cardValue: { fontSize: fontSize.base, fontWeight: '700', color: colors.neutral[800] },
  codeText: { fontSize: fontSize.lg, fontFamily: 'monospace', color: colors.emergency[600], letterSpacing: 2 },
  cardSection: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  cardSectionTitle: { fontSize: fontSize.xs, fontWeight: '700', color: colors.neutral[600], marginBottom: spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  medText: { fontSize: fontSize.sm, color: colors.neutral[700], marginTop: 2 },
  contactText: { fontSize: fontSize.sm, color: colors.neutral[700] },
  cardFooter: {
    backgroundColor: colors.neutral[50],
    padding: spacing.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  footerText: { fontSize: fontSize.xs, color: colors.neutral[400] },
  actions: { gap: spacing.md },
});
