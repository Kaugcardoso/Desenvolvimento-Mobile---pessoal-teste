import { StyleSheet } from 'react-native';

// Design System Empresarial e Tecnológico - Cores Premium
export const colors = {
    // Cores Primárias - Azul Empresarial Profundo
    primary: '#0d4f8c',
    primaryDark: '#0a3d70',
    primaryLight: '#1265a3',
    primaryGradient: ['#0d4f8c', '#1265a3'],
    
    // Cores de Background - Gradientes Sutis e Modernos
    background: '#f8fafc',
    backgroundLight: '#ffffff',
    backgroundGray: '#f1f5f9',
    backgroundElevated: '#ffffff',
    
    // Cores de Texto - Hierarquia Clara
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textTertiary: '#94a3b8',
    textLight: '#ffffff',
    textMuted: '#cbd5e1',
    
    // Cores de Status - Vibrantes e Profissionais
    success: '#10b981',
    successLight: '#d1fae5',
    successDark: '#059669',
    danger: '#ef4444',
    dangerLight: '#fee2e2',
    dangerDark: '#dc2626',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    warningDark: '#d97706',
    info: '#3b82f6',
    infoLight: '#dbeafe',
    infoDark: '#2563eb',
    
    // Cores de Borda - Sutis e Elegantes
    border: '#e2e8f0',
    borderLight: '#cbd5e1',
    borderDark: '#94a3b8',
    
    // Cores Offline
    offline: '#f59e0b',
    offlineLight: '#fef3c7',
    
    // Cores de Accent - Tecnológicas
    accent: '#6366f1',
    accentLight: '#e0e7ff',
};

// Espaçamentos Padronizados
export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
};

// Tipografia Empresarial - Clean e Moderna
export const typography = {
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0f172a',
        letterSpacing: -0.5,
    },
    titleLarge: {
        fontSize: 20,
        fontWeight: '600',
        color: '#0f172a',
        letterSpacing: -0.3,
    },
    body: {
        fontSize: 16,
        fontWeight: '400',
        color: '#0f172a',
        lineHeight: 24,
    },
    bodyLarge: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
    },
    bodySmall: {
        fontSize: 14,
        fontWeight: '500',
        color: '#475569',
    },
    caption: {
        fontSize: 12,
        fontWeight: '400',
        color: '#94a3b8',
    },
    hint: {
        fontSize: 11,
        fontWeight: '400',
        color: '#94a3b8',
        fontStyle: 'italic',
    },
};

// Border Radius Moderno e Suave
export const borderRadius = {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    full: 999,
};

// Shadows Profissionais e Modernas
export const shadows = {
    card: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    cardLarge: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 5,
    },
    cardHover: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    header: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
    },
};

const sharedStyles = StyleSheet.create({
    // Container Padrão
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    
    // Loading State - Moderno
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    loadingText: {
        marginTop: spacing.lg,
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    
    // Offline Badge - Tecnológico
    offlineBadge: {
        backgroundColor: colors.warningLight,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: '#fbbf24',
        alignSelf: 'flex-start',
        marginBottom: spacing.sm,
        ...shadows.card,
    },
    offlineText: {
        color: '#92400e',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    offline: {
        color: colors.offline,
        marginBottom: spacing.sm,
        fontSize: 14,
        fontWeight: '500',
    },
    
    // Botões Empresariais - Premium
    addButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md + 2,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        marginBottom: spacing.lg,
        marginTop: spacing.sm,
        ...shadows.cardLarge,
        borderWidth: 1,
        borderColor: colors.primaryDark,
    },
    addButtonText: {
        color: colors.textLight,
        fontWeight: '600',
        fontSize: 16,
        letterSpacing: 0.3,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        marginTop: spacing.sm,
        marginBottom: spacing.sm,
        ...shadows.card,
        borderWidth: 1,
        borderColor: colors.primaryDark,
    },
    buttonText: {
        color: colors.textLight,
        fontWeight: '600',
        fontSize: 16,
        letterSpacing: 0.3,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    cancelButton: {
        paddingVertical: 14,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: colors.border,
        marginTop: spacing.sm,
        backgroundColor: colors.backgroundLight,
    },
    cancelButtonText: {
        color: colors.textSecondary,
        fontWeight: '600',
        fontSize: 16,
        letterSpacing: 0.2,
    },
    
    // Cards Empresariais - Premium com Profundidade
    card: {
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        ...shadows.cardLarge,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
        marginBottom: spacing.xs,
        letterSpacing: -0.2,
    },
    cardHint: {
        marginTop: spacing.sm,
        fontSize: 11,
        color: colors.textTertiary,
        fontStyle: 'italic',
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    
    // Badge Moderno
    badge: {
        backgroundColor: colors.backgroundGray,
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: spacing.xs + 1,
        borderRadius: borderRadius.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.textSecondary,
        letterSpacing: 0.3,
    },
    
    // Empty State Empresarial
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: spacing.xxxl,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: spacing.lg,
        opacity: 0.6,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
        textAlign: 'center',
        letterSpacing: -0.3,
    },
    emptyText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing.sm,
    },
    emptyHint: {
        fontSize: 12,
        color: colors.textTertiary,
        fontStyle: 'italic',
        marginTop: spacing.sm,
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    
    // Search Input Tecnológico
    searchContainer: {
        marginBottom: spacing.lg,
    },
    searchInput: {
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md + 2,
        fontSize: 15,
        borderWidth: 1.5,
        borderColor: colors.border,
        color: colors.textPrimary,
        ...shadows.card,
    },
    searchResults: {
        marginTop: spacing.sm,
        fontSize: 13,
        color: colors.textSecondary,
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    
    // Modal Empresarial Premium
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.backgroundLight,
        borderTopLeftRadius: borderRadius.xxl,
        borderTopRightRadius: borderRadius.xxl,
        maxHeight: '90%',
        width: '100%',
        ...shadows.cardHover,
        borderTopWidth: 2,
        borderTopColor: colors.primary,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg + 4,
        borderBottomWidth: 1.5,
        borderBottomColor: colors.border,
        backgroundColor: colors.backgroundGray,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.primary,
        letterSpacing: -0.3,
    },
    modalClose: {
        fontSize: 24,
        color: colors.textSecondary,
        fontWeight: '300',
        opacity: 0.7,
    },
    modalLoading: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalLoadingText: {
        marginTop: spacing.lg,
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    modalScrollView: {
        maxHeight: 600,
    },
    modalForm: {
        padding: spacing.lg + 4,
    },
    modalInput: {
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md + 2,
        paddingVertical: spacing.md + 2,
        marginBottom: spacing.md,
        backgroundColor: colors.backgroundLight,
        fontSize: 15,
        color: colors.textPrimary,
        ...shadows.card,
    },
    modalButton: {
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        marginTop: spacing.sm,
        marginBottom: spacing.sm,
        ...shadows.card,
        borderWidth: 1,
        borderColor: colors.primaryDark,
    },
    modalButtonText: {
        color: colors.textLight,
        fontWeight: '600',
        fontSize: 16,
        letterSpacing: 0.3,
    },
    modalCancelButton: {
        paddingVertical: 14,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: colors.border,
        backgroundColor: colors.backgroundLight,
    },
    modalCancelButtonText: {
        color: colors.textSecondary,
        fontWeight: '600',
        fontSize: 16,
        letterSpacing: 0.2,
    },
    modalInfo: {
        fontSize: 12,
        color: colors.textSecondary,
        fontStyle: 'italic',
        marginTop: -spacing.sm,
        marginBottom: spacing.md,
        paddingHorizontal: spacing.xs,
        lineHeight: 18,
    },
    
    // Error State Tecnológico
    errorContainer: {
        flexDirection: 'row',
        backgroundColor: colors.dangerLight,
        borderLeftWidth: 4,
        borderLeftColor: colors.danger,
        padding: spacing.md + 2,
        borderRadius: borderRadius.md,
        marginBottom: spacing.lg,
        alignItems: 'center',
        ...shadows.card,
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    errorIcon: {
        fontSize: 20,
        marginRight: spacing.sm,
    },
    errorText: {
        flex: 1,
        color: '#991b1b',
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    
    // Alert/Info Box Empresarial
    alertContainer: {
        flexDirection: 'row',
        backgroundColor: '#fef2f2',
        borderLeftWidth: 4,
        borderLeftColor: colors.danger,
        padding: spacing.md + 2,
        borderRadius: borderRadius.md,
        alignItems: 'flex-start',
        marginBottom: spacing.md,
        ...shadows.card,
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    alertIcon: {
        fontSize: 18,
        marginRight: spacing.sm,
    },
    alertText: {
        flex: 1,
        fontSize: 13,
        color: '#991b1b',
        fontWeight: '500',
        lineHeight: 20,
        letterSpacing: 0.1,
    },
    
    // Info Box Tecnológico
    infoBox: {
        backgroundColor: colors.infoLight,
        borderRadius: borderRadius.md,
        padding: spacing.md + 2,
        marginBottom: spacing.md,
        borderWidth: 1.5,
        borderColor: '#93c5fd',
        ...shadows.card,
    },
    infoBoxLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.info,
        marginBottom: spacing.xs,
        letterSpacing: 0.2,
    },
    infoBoxValue: {
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: -0.2,
    },
    
    // Value Colors Padronizados
    valueSuccess: {
        color: colors.success,
        fontWeight: '600',
    },
    valueDanger: {
        color: colors.danger,
        fontWeight: '600',
    },
    valueWarning: {
        color: colors.warning,
        fontWeight: '600',
    },
});

export default sharedStyles;
