// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PatientsList from './screens/patientsList';
import PatientDetail from './screens/PatientDetail';
import PatientHistory from './screens/PatientHistory';
import LoginScreen from './screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="PatientsList" component={PatientsList} />
        <Stack.Screen name="PatientDetail" component={PatientDetail} />
        <Stack.Screen name="PatientHistory" component={PatientHistory} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

