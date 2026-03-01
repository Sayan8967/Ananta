import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../lib/stores/auth-store';
import { patientApi } from '../../lib/api-client';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { EmptyState } from '../../components/ui/EmptyState';
import { colors, spacing, fontSize, borderRadius } from '../../lib/theme';

export function PrescriptionsScreen() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['patient', 'profile'],
    queryFn: patientApi.getProfile,
  });

  const patientId = profile?.id || user?.ananta_patient_id;

  const { data: prescriptions, isLoading } = useQuery({
    queryKey: ['prescriptions', patientId],
    queryFn: () => patientApi.getPrescriptions(patientId!),
    enabled: !!patientId,
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file }: { file: { uri: string; name: string; type: string } }) =>
      patientApi.uploadPrescription(patientId!, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions', patientId] });
      Alert.alert('Success', 'Prescription uploaded! AI is extracting medication details.');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to upload prescription. Please try again.');
    },
  });

  const handleScanPrescription = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera access is needed to scan prescriptions.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      uploadMutation.mutate({
        file: {
          uri: asset.uri,
          name: `prescription_${Date.now()}.jpg`,
          type: 'image/jpeg',
        },
      });
    }
  };

  const handleUploadFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Photo library access is needed to upload prescriptions.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      uploadMutation.mutate({
        file: {
          uri: asset.uri,
          name: `prescription_${Date.now()}.jpg`,
          type: asset.mimeType || 'image/jpeg',
        },
      });
    }
  };

  if (isLoading) return <LoadingScreen />;

  const items = prescriptions?.entry || [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Prescriptions</Text>
        <Text style={styles.subtitle}>Scan or upload prescriptions for AI extraction</Text>
      </View>

      {/* Upload Actions */}
      <View style={styles.uploadActions}>
        <Button
          title="📸 Scan Prescription"
          onPress={handleScanPrescription}
          loading={uploadMutation.isPending}
          style={{ flex: 1 }}
        />
        <Button
          title="📁 Upload"
          variant="outline"
          onPress={handleUploadFromGallery}
          loading={uploadMutation.isPending}
        />
      </View>

      {items.length === 0 ? (
        <EmptyState
          title="No prescriptions yet"
          description="Scan or upload a prescription to get started. Our AI will extract medication details automatically."
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <PrescriptionItem prescription={item.resource} />}
        />
      )}
    </SafeAreaView>
  );
}

function PrescriptionItem({ prescription }: { prescription: any }) {
  const statusConfig: Record<string, { variant: 'info' | 'warning' | 'success' | 'danger'; label: string }> = {
    pending: { variant: 'warning', label: 'Processing' },
    extracted: { variant: 'info', label: 'Review Needed' },
    confirmed: { variant: 'success', label: 'Confirmed' },
    failed: { variant: 'danger', label: 'Failed' },
  };

  const status = statusConfig[prescription?.status] || statusConfig.pending;
  const date = prescription?.date ? new Date(prescription.date) : null;

  return (
    <Card>
      <View style={styles.rxHeader}>
        <View style={styles.rxInfo}>
          <Text style={styles.rxTitle}>
            {prescription?.description || 'Scanned Prescription'}
          </Text>
          {date && (
            <Text style={styles.rxDate}>
              {date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          )}
        </View>
        <Badge label={status.label} variant={status.variant} />
      </View>
      {prescription?.extractedMedications?.length > 0 && (
        <View style={styles.extractedMeds}>
          <Text style={styles.extractedLabel}>Extracted Medications:</Text>
          {prescription.extractedMedications.map((med: any, i: number) => (
            <Text key={i} style={styles.medItem}>
              • {med.name} {med.dosage ? `- ${med.dosage}` : ''}
            </Text>
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  header: { padding: spacing.lg, paddingBottom: spacing.sm },
  title: { fontSize: fontSize['2xl'], fontWeight: '800', color: colors.neutral[900] },
  subtitle: { fontSize: fontSize.sm, color: colors.neutral[500], marginTop: 2 },
  uploadActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  list: { padding: spacing.lg, gap: spacing.md },
  rxHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  rxInfo: { flex: 1, marginRight: spacing.sm },
  rxTitle: { fontSize: fontSize.base, fontWeight: '600', color: colors.neutral[800] },
  rxDate: { fontSize: fontSize.xs, color: colors.neutral[400], marginTop: 2 },
  extractedMeds: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  extractedLabel: { fontSize: fontSize.xs, fontWeight: '600', color: colors.neutral[500], marginBottom: spacing.xs },
  medItem: { fontSize: fontSize.sm, color: colors.neutral[700], marginTop: 2 },
});
