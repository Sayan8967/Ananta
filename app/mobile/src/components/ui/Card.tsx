import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../../lib/theme';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  style?: ViewStyle;
  headerRight?: React.ReactNode;
}

export function Card({ children, title, subtitle, onPress, style, headerRight }: CardProps) {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={[styles.container, style]}
      {...(onPress ? { onPress, activeOpacity: 0.7 } : {})}
    >
      {(title || subtitle || headerRight) && (
        <View style={styles.header}>
          <View style={styles.headerText}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {headerRight}
        </View>
      )}
      {children}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.neutral[100],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.neutral[900],
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.neutral[500],
    marginTop: 2,
  },
});
