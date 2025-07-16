// screens/HomeScreen.js
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { airports } from '../data/charts';
import { useRoute } from '../context/routecontext';

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const mapRef = useRef(null);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [customPointName, setCustomPointName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [existingPointIndex, setExistingPointIndex] = useState(null);

  const { addPoint, routePoints, removePoint } = useRoute();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission localisation refusée');
      } else {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      }
      setLoadingLocation(false);
    })();
  }, []);

  const handleMapPress = (e) => {
    const coord = e.nativeEvent.coordinate;

    const found = routePoints.findIndex(
      (p) =>
        Math.abs(p.coordinate.latitude - coord.latitude) < 0.0005 &&
        Math.abs(p.coordinate.longitude - coord.longitude) < 0.0005
    );

    if (found !== -1) {
      Alert.alert(
        'Point déjà sélectionné',
        'Souhaitez-vous ajouter ce point à nouveau ou le supprimer ?',
        [
          {
            text: '➖ Supprimer',
            onPress: () => removePoint(found),
            style: 'destructive',
          },
          {
            text: '➕ Ajouter à nouveau',
            onPress: () => {
              addPoint({
                coordinate: coord,
                airport: null,
              });
            },
          },
          {
            text: 'Annuler',
            style: 'cancel',
          },
        ]
      );
    } else {
      setSelectedCoordinate(coord);
      setSelectedAirport(null);
      setExistingPointIndex(null);
    }
  };

  const handleAirportPress = (airport) => {
    const coord = {
      latitude: airport.latitude,
      longitude: airport.longitude,
    };

    const existingIndex = routePoints.findIndex(
      (p) =>
        p.airport?.icao === airport.icao &&
        Math.abs(p.coordinate.latitude - coord.latitude) < 0.0005 &&
        Math.abs(p.coordinate.longitude - coord.longitude) < 0.0005
    );

    setSelectedCoordinate(coord);
    setSelectedAirport(airport);

    if (existingIndex !== -1) {
      setExistingPointIndex(existingIndex);
    } else {
      setExistingPointIndex(null);
    }
  };

  const confirmAddCustomPoint = () => {
    addPoint({
      coordinate: selectedCoordinate,
      airport: { name: customPointName },
    });
    setCustomPointName('');
    setSelectedCoordinate(null);
    setSelectedAirport(null);
    setShowNameModal(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBanner}>
        <Text style={styles.logoText}>MyVFR</Text>
      </View>

      <View style={styles.mapContainer}>
        {loadingLocation ? (
          <ActivityIndicator size="large" color="#007aff" style={{ flex: 1 }} />
        ) : (
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude: 45.9432,
              longitude: 24.9668,
              latitudeDelta: 5,
              longitudeDelta: 5,
            }}
            showsUserLocation={true}
            onPress={handleMapPress}
          >
            {location && (
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="Moi"
              >
                <Ionicons name="airplane" size={32} color="blue" />
              </Marker>
            )}

            {airports.map((airport) => (
              <Marker
                key={airport.icao}
                coordinate={{
                  latitude: airport.latitude,
                  longitude: airport.longitude,
                }}
                title={airport.name}
                description={`Freq: ${airport.frequency || 'N/A'}`}
                onPress={() => handleAirportPress(airport)}
              />
            ))}

            {routePoints.map((point, index) => (
              <Marker
                key={`route-point-${index}`}
                coordinate={point.coordinate}
                title={point.airport?.name || `Point libre ${index + 1}`}
                pinColor="blue"
              />
            ))}

            {routePoints.length > 1 && (
              <Polyline
                coordinates={routePoints.map((p) => p.coordinate)}
                strokeColor="#007AFF"
                strokeWidth={3}
              />
            )}
          </MapView>
        )}

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RoutePlanner')}>
            <Ionicons name="compass" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RomatsaMap')}>
            <Ionicons name="map" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('VFR')}>
            <Ionicons name="map-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Meteo')}>
            <Ionicons name="cloud-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Notam')}>
            <Ionicons name="warning-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {selectedCoordinate && !selectedAirport && (
          <View style={styles.confirmBox}>
            <Text style={styles.confirmText}>Ajouter ce point libre ?</Text>
            <TouchableOpacity onPress={() => setShowNameModal(true)}>
              <Ionicons name="checkmark-circle" size={30} color="green" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedCoordinate(null)}>
              <Ionicons name="close-circle" size={30} color="red" />
            </TouchableOpacity>
          </View>
        )}

        {selectedAirport && (
          <View style={styles.airportBox}>
            <Text style={styles.confirmText}>
              {selectedAirport.name} – Freq: {selectedAirport.frequency || 'N/A'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (existingPointIndex !== null) {
                  Alert.alert(
                    'Ce point est déjà dans la route',
                    'Souhaitez-vous le rajouter à nouveau ou le supprimer ?',
                    [
                      {
                        text: '➕ Ajouter',
                        onPress: () =>
                          addPoint({
                            coordinate: selectedCoordinate,
                            airport: selectedAirport,
                          }),
                      },
                      {
                        text: '➖ Supprimer',
                        onPress: () => removePoint(existingPointIndex),
                        style: 'destructive',
                      },
                      { text: 'Annuler', style: 'cancel' },
                    ]
                  );
                } else {
                  addPoint({
                    coordinate: selectedCoordinate,
                    airport: selectedAirport,
                  });
                }

                setSelectedAirport(null);
                setSelectedCoordinate(null);
              }}
            >
              <Ionicons name="add-circle" size={30} color="green" />
            </TouchableOpacity>
          </View>
        )}

        <Modal visible={showNameModal} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
                Nom du point
              </Text>
              <TextInput
                placeholder="Entrer un nom"
                value={customPointName}
                onChangeText={setCustomPointName}
                style={styles.input}
              />
              <Text style={{ marginTop: 10 }}>
                Freq: {selectedAirport?.frequency || 'N/A'}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                <Button
                  title="Annuler"
                  color="red"
                  onPress={() => {
                    setShowNameModal(false);
                    setSelectedCoordinate(null);
                    setCustomPointName('');
                  }}
                />
                <Button title="Ajouter" onPress={confirmAddCustomPoint} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBanner: {
    backgroundColor: '#001f3f',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  mapContainer: { flex: 1 },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007aff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBox: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 6,
  },
  confirmText: { fontWeight: 'bold', fontSize: 16 },
  airportBox: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 6,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 10,
  },
  input: {
    borderBottomWidth: 1,
    padding: 8,
  },
});
