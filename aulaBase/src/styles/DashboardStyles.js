import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from './SharedStyles';

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.backgroundLight,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bannerText: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
    letterSpacing: -0.3,
  },
  smallNote: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  separator: {
    height: 1.5,
    backgroundColor: colors.border,
    width: '100%',
    alignSelf: 'center',
    marginVertical: spacing.lg,
  },
});

export default styles;
