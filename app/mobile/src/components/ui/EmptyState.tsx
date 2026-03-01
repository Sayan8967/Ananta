import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, spacing } from '../../lib/theme';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} variant="outline" size="sm" style={{ marginTop: spacing.lg }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['3xl'],
  },
  icon: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.neutral[800],
    textAlign: 'center',
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.neutral[500],
    textAlign: 'center',
    marginTop: spacing.sm,
    maxWidth: 280,
  },
});
