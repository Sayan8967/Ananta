import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../../lib/theme';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const variantConfig: Record<BadgeVariant, { bg: string; text: string; border?: string }> = {
  default: { bg: colors.neutral[100], text: colors.neutral[700] },
  success: { bg: '#DCFCE7', text: '#166534' },
  warning: { bg: '#FEF3C7', text: '#92400E' },
  danger: { bg: colors.emergency[100], text: colors.emergency[700] },
  info: { bg: colors.primary[100], text: colors.primary[700] },
  outline: { bg: 'transparent', text: colors.neutral[600], border: colors.neutral[300] },
};

export function Badge({ label, variant = 'default', size = 'sm' }: BadgeProps) {
  const config = variantConfig[variant];

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: config.bg },
        config.border ? { borderWidth: 1, borderColor: config.border } : undefined,
        size === 'sm' ? styles.sm : styles.md,
      ]}
    >
      <Text style={[styles.text, { color: config.text }, size === 'sm' ? styles.textSm : styles.textMd]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
  },
  sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  text: {
    fontWeight: '600',
  },
  textSm: {
    fontSize: fontSize.xs,
  },
  textMd: {
    fontSize: fontSize.sm,
  },
});
