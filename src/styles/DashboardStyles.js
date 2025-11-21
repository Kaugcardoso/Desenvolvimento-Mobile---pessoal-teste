import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 2,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 8,
  },
  bannerText: {
    color: '#0b3b60',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: '#0b3b60',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  smallNote: {
    color: '#666',
    fontSize: 13,
  },
  separator: {
    height: 1,
    backgroundColor: '#bdbdbd',
    width: '110%',
    alignSelf: 'center',
    marginVertical: 16,
  },
});

export default styles;
