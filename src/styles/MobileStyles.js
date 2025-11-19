import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    height: 70,
    paddingTop: 12,
    backgroundColor: '#07305a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  hamburger: {
    position: 'absolute',
    left: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerLines: {
    width: 20,
    height: 2,
    backgroundColor: '#fff',
    marginVertical: 2,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f6f8',
    padding: 12,
    paddingTop: 14,
  },
  footer: {
    height: 64,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e6e6e6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 12,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
  menuOverlay: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    bottom: 64,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
  },
  menuPanel: {
    width: '72%',
    maxWidth: 320,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 12,
    height: '100%',
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  menuItemText: {
    fontSize: 16,
    color: '#072b4b',
    fontWeight: '600',
  },
});

export default styles;
