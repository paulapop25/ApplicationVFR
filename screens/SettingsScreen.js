// screens/NouvellePage.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NotamScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenue sur la nouvelle page NOTAM !</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
