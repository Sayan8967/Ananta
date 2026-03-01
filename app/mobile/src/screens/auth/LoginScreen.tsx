import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../lib/stores/auth-store';
import { Button } from '../../components/ui/Button';
import { colors, spacing, fontSize } from '../../lib/theme';

const { width } = Dimensions.get('window');

export function LoginScreen() {
  const { login, isLoading, error } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>♾️</Text>
            <Text style={styles.logoText}>Ananta</Text>
          </View>
          <Text style={styles.tagline}>Infinite Care, Infinite Memory</Text>
          <Text style={styles.subtitle}>
            Your complete medical history in one place. Securely manage health records, prescriptions, and emergency
            access across India and the US.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <FeatureItem icon="📋" text="FHIR R4 compliant health records" />
          <FeatureItem icon="📸" text="AI-powered prescription scanning" />
          <FeatureItem icon="🆘" text="Emergency medical card" />
          <FeatureItem icon="🔒" text="HIPAA & DPDP Act compliant" />
        </View>

        {/* Login Actions */}
        <View style={styles.actions}>
          <Button title="Sign In with Ananta" onPress={login} loading={isLoading} size="lg" />
          <Text style={styles.registerHint}>
            Don't have an account? Sign in to register automatically.
          </Text>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          By continuing, you agree to Ananta's Terms of Service and Privacy Policy.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[0],
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing['2xl'],
    justifyContent: 'space-between',
    paddingVertical: spacing['3xl'],
  },
  hero: {
    alignItems: 'center',
    marginTop: spacing['4xl'],
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoIcon: {
    fontSize: 40,
    marginRight: spacing.sm,
  },
  logoText: {
    fontSize: fontSize['4xl'],
    fontWeight: '800',
    color: colors.primary[800],
  },
  tagline: {
    fontSize: fontSize.lg,
    color: colors.accent[600],
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.neutral[500],
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: width * 0.8,
  },
  features: {
    backgroundColor: colors.neutral[50],
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  featureText: {
    fontSize: fontSize.sm,
    color: colors.neutral[700],
    flex: 1,
  },
  actions: {
    gap: spacing.md,
    alignItems: 'center',
  },
  registerHint: {
    fontSize: fontSize.xs,
    color: colors.neutral[400],
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.emergency[600],
    textAlign: 'center',
  },
  footer: {
    fontSize: fontSize.xs,
    color: colors.neutral[400],
    textAlign: 'center',
    lineHeight: 18,
  },
});
