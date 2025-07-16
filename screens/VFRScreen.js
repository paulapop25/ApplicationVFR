import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { airports } from '../data/charts';

export default function VFRScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleOpenPDF = async (pdfUrl, airportName) => {
    try {
      if (!pdfUrl) {
        Alert.alert('Erreur', `Pas de PDF disponible pour ${airportName}`);
        return;
      }

      // Nettoyage de l'URL
      const cleanUrl = pdfUrl.trim();

      // Nom du fichier local
      const filename = cleanUrl.split('/').pop();
      const localUri = FileSystem.documentDirectory + filename;

      // Vérifie si le fichier est déjà présent localement
      const fileInfo = await FileSystem.getInfoAsync(localUri);

      if (!fileInfo.exists) {
        console.log('Téléchargement en cours...');
        await FileSystem.downloadAsync(cleanUrl, localUri);
        console.log('Fichier téléchargé à :', localUri);
      } else {
        console.log('Fichier déjà présent localement :', localUri);
      }

      // Ouverture avec une app externe
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(localUri);
      } else {
        Alert.alert("Aucune application disponible", "Installe une application pour lire les PDF.");
      }
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du PDF :', error);
      Alert.alert("Erreur", "Impossible d'ouvrir le fichier PDF.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBanner}>
        <Text style={styles.logoText}>MyVFR</Text>
      </View>

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={airports}
        keyExtractor={(item) => item.icao}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleOpenPDF(item.chart, item.name)}
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>{item.icao}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
  item: {
    backgroundColor: '#e6f0ff',
    padding: 16,
    borderRadius: 10,
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#666' },
});
