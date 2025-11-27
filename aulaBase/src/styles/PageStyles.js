import { StyleSheet } from 'react-native';
import { colors, typography, spacing } from './SharedStyles';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.xl,
        backgroundColor: colors.background,
        justifyContent: 'flex-start',
    },
    title: {
        ...typography.title,
        color: colors.primary,
        marginBottom: spacing.md,
    },
});

export default styles;
