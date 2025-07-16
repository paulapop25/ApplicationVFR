import React from 'react';
import { StyleSheet, Platform, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

export default function RomatsaMapScreen() {
  const injectedJavaScript = `
    const meta = document.createElement('meta'); 
    meta.setAttribute('name', 'viewport'); 
    meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=3, user-scalable=yes'); 
    document.getElementsByTagName('head')[0].appendChild(meta);
    true;
  `;

  return (
    <WebView
      source={{ uri: 'https://flightplan.romatsa.ro/init/default/index' }}
      style={styles.webview}
      originWhitelist={['*']}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      injectedJavaScript={injectedJavaScript}
      scalesPageToFit={true}
      allowsFullscreenVideo={true}
      javaScriptCanOpenWindowsAutomatically={true}
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
