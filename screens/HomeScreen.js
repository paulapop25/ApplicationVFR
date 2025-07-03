import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const mapRef = useRef(null);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      let { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      if (locStatus !== 'granted') {
        console.log('Permission localisation refusée');
      } else {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      }
      setLoadingLocation(false);
    })();
  }, []);

  const centerOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 1.5,
        longitudeDelta: 1.5,
      });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Bandeau supérieur */}
      <View style={styles.topBanner}>
        <Text style={styles.logoText}>MyVFR</Text>
      </View>

      {/* Carte */}
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
          >
            {location && (
              <Marker
                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                title="Moi"
              >
                <Ionicons name="airplane" size={32} color="blue" />
              </Marker>
            )}
          </MapView>
        )}

        {/* Conteneur des boutons en bas */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={centerOnUser}>
            <Ionicons name="locate" size={24} color="white" />
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBanner: {
    backgroundColor: '#001f3f',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007aff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});
