import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PDFViewerScreen({ route }) {
  const { uri } = route.params;

  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri }} 
        style={{ flex: 1 }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
