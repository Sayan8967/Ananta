import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../lib/stores/auth-store';
import { patientApi, consentApi } from '../../lib/api-client';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { colors, spacing, fontSize, borderRadius } from '../../lib/theme';

export function ProfileScreen() {
  const { user, logout, isLoading: logoutLoading } = useAuthStore();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['patient', 'profile'],
    queryFn: patientApi.getProfile,
  });

  const { data: consents } = useQuery({
    queryKey: ['consents'],
    queryFn: consentApi.getConsents,
  });

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.given_name?.[0] || 'P').toUpperCase()}
              {(user?.family_name?.[0] || '').toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Patient'}</Text>
          <Text style={styles.email}>{user?.email || ''}</Text>
          {user?.realm_access?.roles?.includes('patient') && (
            <Badge label="Patient" variant="info" size="md" />
          )}
        </View>

        {/* Personal Information */}
        <Card title="Personal Information">
          <View style={styles.fieldList}>
            <ProfileField label="Date of Birth" value={profile?.birthDate || 'Not set'} />
            <ProfileField label="Gender" value={profile?.gender || 'Not set'} />
            <ProfileField label="Phone" value={profile?.telecom?.[0]?.value || 'Not set'} />
            <ProfileField label="Address" value={formatAddress(profile?.address?.[0]) || 'Not set'} />
          </View>
        </Card>

        {/* Identifiers */}
        <Card title="Health Identifiers">
          <View style={styles.fieldList}>
            <ProfileField label="Ananta ID" value={profile?.id || 'Generating...'} />
            {profile?.identifier?.map((id: any, i: number) => {
              const system = id.system || '';
              let label = 'Identifier';
              if (system.includes('abha')) label = 'ABHA Number';
              else if (system.includes('ananta')) label = 'Ananta ID';
              return <ProfileField key={i} label={label} value={id.value || 'N/A'} />;
            })}
          </View>
        </Card>

        {/* Data Consents */}
        <Card title="Data & Privacy">
          <View style={styles.fieldList}>
            {consents?.entry?.length ? (
              consents.entry.map((entry: any, i: number) => (
                <View key={i} style={styles.consentRow}>
                  <View style={styles.consentInfo}>
                    <Text style={styles.consentCategory}>{entry.resource?.category?.[0]?.text || 'Consent'}</Text>
                    <Text style={styles.consentScope}>{entry.resource?.scope?.text || ''}</Text>
                  </View>
                  <Badge
                    label={entry.resource?.status === 'active' ? 'Active' : 'Inactive'}
                    variant={entry.resource?.status === 'active' ? 'success' : 'default'}
                  />
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No consent records found</Text>
            )}
          </View>
        </Card>

        {/* App Settings */}
        <Card title="Settings">
          <View style={styles.settingsList}>
            <SettingItem icon="🌐" label="Region" value="India (ABDM)" />
            <SettingItem icon="🔔" label="Notifications" value="Enabled" />
            <SettingItem icon="🌙" label="Dark Mode" value="System" />
            <SettingItem icon="📱" label="App Version" value="1.0.0" />
          </View>
        </Card>

        {/* Logout */}
        <Button
          title="Sign Out"
          variant="outline"
          onPress={handleLogout}
          loading={logoutLoading}
          size="lg"
          style={{ marginTop: spacing.sm }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

function SettingItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingIcon}>{icon}</Text>
      <Text style={styles.settingLabel}>{label}</Text>
      <Text style={styles.settingValue}>{value}</Text>
    </View>
  );
}

function formatAddress(address: any): string | null {
  if (!address) return null;
  const parts = [address.line?.join(', '), address.city, address.state, address.postalCode, address.country];
  return parts.filter(Boolean).join(', ') || null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  scroll: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing['5xl'] },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: { fontSize: fontSize['2xl'], fontWeight: '700', color: colors.neutral[0] },
  name: { fontSize: fontSize.xl, fontWeight: '800', color: colors.neutral[900] },
  email: { fontSize: fontSize.sm, color: colors.neutral[500] },
  fieldList: { gap: spacing.md },
  field: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  fieldLabel: { fontSize: fontSize.sm, color: colors.neutral[500] },
  fieldValue: { fontSize: fontSize.sm, fontWeight: '600', color: colors.neutral[800] },
  consentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  consentInfo: { flex: 1 },
  consentCategory: { fontSize: fontSize.sm, fontWeight: '600', color: colors.neutral[700] },
  consentScope: { fontSize: fontSize.xs, color: colors.neutral[400] },
  emptyText: { fontSize: fontSize.sm, color: colors.neutral[400], fontStyle: 'italic' },
  settingsList: { gap: spacing.md },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingIcon: { fontSize: 20 },
  settingLabel: { fontSize: fontSize.sm, color: colors.neutral[700], flex: 1 },
  settingValue: { fontSize: fontSize.sm, color: colors.neutral[500] },
});
