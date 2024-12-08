/*
Course: MAPD-712
Group: 2
Participants: Harsimran Singh (301500536), Hassanzadeh Moghaddam, Maziar (301064337)
*/
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PatientsList from './screens/patientsList';
import PatientDetail from './screens/PatientDetail';
import PatientHistory from './screens/PatientHistory';
import LoginScreen from './screens/LoginScreen';
import AddPatient from './screens/AddPatient';
import EditPatient from './screens/EditPatient';
import AddPatientHistory from './screens/AddPatientHistory'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="PatientsList" component={PatientsList} />
        <Stack.Screen name="AddPatient" component={AddPatient} />
        <Stack.Screen name="PatientDetail" component={PatientDetail} />
        <Stack.Screen name="EditPatient" component={EditPatient} />
        <Stack.Screen name="PatientHistory" component={PatientHistory} />
        <Stack.Screen name="AddPatientHistory" component={AddPatientHistory} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

