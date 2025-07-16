import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '../context/routecontext';

// Fonction pour calculer distance en NM et cap magnétique
const toRadians = (deg) => (deg * Math.PI) / 180;
const toDegrees = (rad) => (rad * 180) / Math.PI;

const calculateDistanceAndBearing = (coord1, coord2) => {
  const R = 6371; // Rayon de la Terre en km
  const φ1 = toRadians(coord1.latitude);
  const φ2 = toRadians(coord2.latitude);
  const Δλ = toRadians(coord2.longitude - coord1.longitude);

  const dLat = φ2 - φ1;
  const dLon = Δλ;

  // Distance
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;
  const distanceNM = distanceKm * 0.539957;

  // Cap
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  let bearing = toDegrees(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;

  return {
    distanceNM: distanceNM.toFixed(1),
    bearing: Math.round(bearing),
  };
};

export default function RoutePlanner() {
  const insets = useSafeAreaInsets();
  const { routePoints, updateAltitude, updateTime } = useRoute();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Carnet de route</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {routePoints.length === 0 ? (
          <Text style={styles.empty}>Aucun point ajouté pour le moment.</Text>
        ) : (
          routePoints.map((point, index) => {
            const nextPoint = routePoints[index + 1];
            const { distanceNM, bearing } = nextPoint
              ? calculateDistanceAndBearing(point.coordinate, nextPoint.coordinate)
              : { distanceNM: '-', bearing: '-' };

            return (
              <View key={index} style={styles.card}>
                <Text style={styles.cardTitle}>
                  {index + 1}. {point.airport?.name || 'Point libre'}
                </Text>

                <Text style={styles.label}>Altitude (ft) :</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Entrer l'altitude"
                  value={point.altitude ? String(point.altitude) : ''}
                  onChangeText={(text) => updateAltitude(index, parseInt(text) || 0)}
                />

                <Text style={styles.label}>Temps estimé (min) :</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Entrer le temps"
                  value={point.time ? String(point.time) : ''}
                  onChangeText={(text) => updateTime(index, parseInt(text) || 0)}
                />

                <View style={styles.dataRow}>
                  <View style={styles.dataCol}>
                    <Text style={styles.dataLabel}>Latitude</Text>
                    <Text>{point.coordinate.latitude.toFixed(5)}</Text>
                  </View>
                  <View style={styles.dataCol}>
                    <Text style={styles.dataLabel}>Longitude</Text>
                    <Text>{point.coordinate.longitude.toFixed(5)}</Text>
                  </View>
                  <View style={styles.dataCol}>
                    <Text style={styles.dataLabel}>Dist. (NM)</Text>
                    <Text>{distanceNM}</Text>
                  </View>
                  <View style={styles.dataCol}>
                    <Text style={styles.dataLabel}>Route (°)</Text>
                    <Text>{bearing}</Text>
                  </View>
                </View>

                <Text style={styles.label}>Notes complémentaires :</Text>
                <Text style={styles.notes}>
                  Fréquence: {point.airport?.frequency || 'N/A'}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: '#999',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    marginTop: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dataCol: {
    flex: 1,
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
});
