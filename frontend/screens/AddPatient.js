import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';

export default function AddPatient() {
  const navigation = useNavigation();
  const apiUrl = "http://localhost:3000/api/patient"; // URL of the API

  // State for patient fields
  const [patient, setPatient] = useState({
    name: 'Jim Carry',
    dob: '1985-06-15', // Format: YYYY-MM-DD
    healthStatus: 'Stable',
    lastVisit: '2023-10-01', // Format: YYYY-MM-DD
    visitDateTime: '2023-10-15T10:30:00', // Format: YYYY-MM-DDTHH:MM:SS
    bloodPressure: '120/80 mmHg',
    respiratoryRate: "18", // breaths per minute
    oxygenLevel: '98%',
    heartbeatRate: '72 bpm',
  });

  const handleAddPatient = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patient),
      });

      if (!response.ok) {
        throw new Error("Failed to add patient");
      }

      // Display success message
      Alert.alert("Success", "Patient added successfully!");
      navigation.goBack(); // Navigate back to the previous screen

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Patient</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={patient.name}
        onChangeText={(text) => setPatient({ ...patient, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={patient.dob}
        onChangeText={(text) => setPatient({ ...patient, dob: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Health Status"
        value={patient.healthStatus}
        onChangeText={(text) => setPatient({ ...patient, healthStatus: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Visit Date (YYYY-MM-DD)"
        value={patient.lastVisit}
        onChangeText={(text) => setPatient({ ...patient, lastVisit: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Visit DateTime (YYYY-MM-DDTHH:MM:SS)"
        value={patient.visitDateTime}
        onChangeText={(text) => setPatient({ ...patient, visitDateTime: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Blood Pressure"
        value={patient.bloodPressure}
        onChangeText={(text) => setPatient({ ...patient, bloodPressure: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Respiratory Rate"
        value={patient.respiratoryRate}
        keyboardType="numeric"
        onChangeText={(text) => setPatient({ ...patient, respiratoryRate: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Oxygen Level"
        value={patient.oxygenLevel}
        onChangeText={(text) => setPatient({ ...patient, oxygenLevel: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Heartbeat Rate"
        value={patient.heartbeatRate}
        onChangeText={(text) => setPatient({ ...patient, heartbeatRate: text })}
      />
      
      <TouchableOpacity style={styles.submitButton} onPress={handleAddPatient}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    elevation: 2,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
