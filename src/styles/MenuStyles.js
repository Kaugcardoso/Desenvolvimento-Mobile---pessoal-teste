import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: 260,
        backgroundColor: '#ffffff',
        paddingVertical: 20,
        paddingHorizontal: 12,
        borderRightWidth: 1,
        borderRightColor: '#e6e6e6',
        justifyContent: 'flex-start',
    },
    logoContainer: {
        height: 64,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 6,
    },
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginBottom: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemPressed: {
        backgroundColor: '#e9f1fb',
    },
    menuItemActive: {
        backgroundColor: '#07305a',
    },
    menuItemLabel: {
        marginLeft: 10,
        fontSize: 15,
        color: '#333',
    },
    profile: {
        marginTop: 'auto',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingLeft: 6,
        paddingBottom: 12,
    },
});

export default styles;
