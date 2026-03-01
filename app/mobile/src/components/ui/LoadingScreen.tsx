import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, fontSize, spacing } from '../../lib/theme';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary[600]} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral[50],
  },
  message: {
    marginTop: spacing.lg,
    fontSize: fontSize.base,
    color: colors.neutral[500],
  },
});
