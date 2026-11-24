import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { isApiConfigured } from './src/config/env';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>CampusLab</Text>
      <Text style={styles.title}>Base del proyecto Mobile</Text>
      <Text style={styles.text}>Sistema de Control de Laboratorios de Cómputo</Text>
      <Text style={styles.status}>React Native + Expo</Text>
      <Text style={styles.note}>{isApiConfigured ? 'Variables de la API configuradas.' : 'API pendiente de los datos del docente.'}</Text>
      <StatusBar style="dark" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC', justifyContent: 'center', padding: 28 },
  brand: { color: '#6D8196', fontSize: 20, fontWeight: '700', marginBottom: 24 },
  title: { color: '#1D1D1F', fontSize: 28, fontWeight: '700', marginBottom: 16 },
  text: { fontSize: 16, lineHeight: 25, color: '#4A4A4A' },
  status: { color: '#6D8196', fontSize: 16, fontWeight: '600', marginTop: 24 },
  note: { color: '#86868B', fontSize: 14, lineHeight: 22, marginTop: 16 },
});
