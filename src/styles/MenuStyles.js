import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: 300,
        backgroundColor: '#ffffff',
        paddingVertical: 28,
        paddingHorizontal: 16,
        borderRightWidth: 0,
        justifyContent: 'flex-start',
        // subtle card shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 6,
    },
    logoContainer: {
        height: 72,
        marginBottom: 22,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 6,
    },
    menuItem: {
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderRadius: 10,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    menuItemPressed: {
        backgroundColor: '#eef6ff',
        position: 'relative',
    },
    menuItemPressedBar: {
        position: 'absolute',
        right: -15,
        top: 0,
        bottom: 0,
        width: 20,
        backgroundColor: '#e9f1fb',
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },
    menuItemActive: {
        backgroundColor: '#07305a',
        position: 'relative',
        // slightly stronger elevation for active
        shadowColor: '#07305a',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
    },
    menuItemActiveBar: {
        position: 'absolute',
        right: -15,
        top: 0,
        bottom: 0,
        width: 20,
        backgroundColor: '#07305a',
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
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
