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
import { Asset } from 'expo-asset';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { airports } from '../data/charts'; // Assure-toi que `chart` est un import require(...)

export default function VFRScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleOpenPDF = async (pdfModule, airportName) => {
    try {
      const asset = Asset.fromModule(pdfModule);
      await asset.downloadAsync();

      const sanitizedName = airportName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = `${sanitizedName}.pdf`;
      const destinationUri = FileSystem.documentDirectory + fileName;

      const fileInfo = await FileSystem.getInfoAsync(destinationUri);
      if (!fileInfo.exists) {
        await FileSystem.copyAsync({
          from: asset.localUri || asset.uri,
          to: destinationUri,
        });
      }
    console.log('Navigating to PDF:', destinationUri);
      navigation.navigate('PDFViewer', { uri: destinationUri });
    } catch (error) {
      console.error('Erreur ouverture PDF:', error);
      Alert.alert('Erreur', `Impossible d'ouvrir la carte de ${airportName}`);
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
