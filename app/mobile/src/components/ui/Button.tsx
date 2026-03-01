import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors, borderRadius, spacing, fontSize } from '../../lib/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        isDisabled && styles.disabled,
        style as ViewStyle,
      ]}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? colors.primary[600] : colors.neutral[0]}
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              textSizeStyles[size],
              textVariantStyles[variant],
              icon ? { marginLeft: spacing.sm } : undefined,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
});

const sizeStyles: Record<string, ViewStyle> = {
  sm: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, minHeight: 36 },
  md: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, minHeight: 44 },
  lg: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, minHeight: 52 },
};

const textSizeStyles: Record<string, TextStyle> = {
  sm: { fontSize: fontSize.sm },
  md: { fontSize: fontSize.base },
  lg: { fontSize: fontSize.lg },
};

const variantStyles: Record<string, ViewStyle> = {
  primary: { backgroundColor: colors.primary[600] },
  secondary: { backgroundColor: colors.accent[600] },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary[600] },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.emergency[600] },
};

const textVariantStyles: Record<string, TextStyle> = {
  primary: { color: colors.neutral[0] },
  secondary: { color: colors.neutral[0] },
  outline: { color: colors.primary[600] },
  ghost: { color: colors.primary[600] },
  danger: { color: colors.neutral[0] },
};
