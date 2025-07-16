import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';

const mockNotams = {
  "Bucharest Otopeni": [
    { id: 1, text: "NOTAM A - Piste fermée entre 10h et 14h." },
    { id: 2, text: "NOTAM B - Travaux sur taxiway B." }
  ],
  "Cluj Napoca": [
    { id: 3, text: "NOTAM C - Limite de vitesse réduite sur aérodrome." }
  ],
  "Timisoara": [
    { id: 4, text: "NOTAM D - Balises hors service." }
  ]
};

export default function NotamScreen() {
  return (
    <ScrollView style={styles.container}>
      {Object.entries(mockNotams).map(([airport, notams]) => (
        <View key={airport} style={styles.airportSection}>
          <Text style={styles.airportTitle}>{airport}</Text>
          {notams.map(notam => (
            <Text key={notam.id} style={styles.notamText}>• {notam.text}</Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  airportSection: { marginBottom: 20 },
  airportTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#007aff' },
  notamText: { fontSize: 14, marginLeft: 8, marginBottom: 4 }
});
