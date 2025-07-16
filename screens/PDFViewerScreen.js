import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PDFViewerScreen({ route }) {
  const { uri } = route.params;

  // Encodage de l'URL PDF dans Google Docs Viewer
  const googleViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(uri)}`;

  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: googleViewerUrl }} 
        style={{ flex: 1 }} 
        startInLoadingState={true}
        renderError={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Impossible d'afficher le PDF</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
