import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import VFRScreen from './screens/VFRScreen';
import NotamScreen from './screens/NotamScreen';
import MeteoScreen from './screens/MeteoScreen';
import ProfileScreen from './screens/ProfileScreen';
import PDFViewerScreen from './screens/PDFViewerScreen';
import RomatsaMapScreen from './screens/RomatsaMapScreen';
import RoutePlannerScreen from './screens/RoutePlannerScreen';
import { RouteProvider } from './context/routecontext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <RouteProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="VFR" component={VFRScreen} />
            <Stack.Screen name="Notam" component={NotamScreen} />
            <Stack.Screen name="Meteo" component={MeteoScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="PDFViewer" component={PDFViewerScreen} />
            <Stack.Screen name="RomatsaMap" component={RomatsaMapScreen} />
            <Stack.Screen name="RoutePlanner" component={RoutePlannerScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </RouteProvider>
    </SafeAreaProvider>
  );
}
