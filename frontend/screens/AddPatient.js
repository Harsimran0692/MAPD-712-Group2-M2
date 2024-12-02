import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function AddPatient() {
  const navigation = useNavigation();
  const apiUrl = "http://localhost:3000/api/patient";

  const [patient, setPatient] = useState({
    name: "",
    dob: new Date(),
    lastVisit: new Date(),
    visitDateTime: new Date(),
    bloodPressure: "",
    respiratoryRate: "",
    oxygenLevel: "",
    heartbeatRate: "",
    healthStatus: "Stable", // Initial health status
  });

  const [picker, setPicker] = useState({
    visible: false,
    mode: "date", // Can be "date" or "datetime"
    field: null,
  });

  // Automatically update the health status when relevant fields change
  useEffect(() => {
    updateHealthStatus();
  }, [
    patient.bloodPressure,
    patient.respiratoryRate,
    patient.oxygenLevel,
    patient.heartbeatRate,
  ]);

  const updateHealthStatus = () => {
    const {
      bloodPressure,
      respiratoryRate,
      oxygenLevel,
      heartbeatRate,
    } = patient;

    // Handle empty inputs to avoid NaN
    const bp = parseInt(bloodPressure) || 0;
    const hr = parseInt(heartbeatRate) || 0;
    const oxygen = parseInt(oxygenLevel) || 0;

    let status = "Stable";

    // Critical conditions (modify as needed)
    if (bp > 180 || hr > 120 || oxygen < 90) {
      status = "Critical";
    }
    // Under observation conditions
    else if (bp > 140 || oxygen < 95) {
      status = "Under Observation";
    }

    setPatient((prevData) => ({
      ...prevData,
      healthStatus: status,
    }));
  };

  const handlePickerConfirm = (date) => {
    setPicker({ visible: false, mode: "date", field: null });
    if (picker.field) {
      setPatient((prev) => ({ ...prev, [picker.field]: date }));
    }
  };

  const handlePickerCancel = () => {
    setPicker({ visible: false, mode: "date", field: null });
  };

  const handleAddPatient = async () => {
    try {
      const patientData = {
        ...patient,
        dob: patient.dob.toISOString().split("T")[0],
        lastVisit: patient.lastVisit.toISOString().split("T")[0],
        visitDateTime: patient.visitDateTime.toISOString(),
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        throw new Error("Failed to add patient");
      }

      Alert.alert("Success", "Patient added successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Patient</Text>

      {/* Name Field */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter patient name"
        value={patient.name}
        onChangeText={(text) => setPatient({ ...patient, name: text })}
      />

      {/* DOB Picker */}
      <Text style={styles.label}>Date of Birth</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setPicker({ visible: true, mode: "date", field: "dob" })}
      >
        <Text>{patient.dob.toISOString().split("T")[0]}</Text>
      </TouchableOpacity>

      {/* Last Visit Date Picker */}
      <Text style={styles.label}>Last Visit Date</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setPicker({ visible: true, mode: "date", field: "lastVisit" })}
      >
        <Text>{patient.lastVisit.toISOString().split("T")[0]}</Text>
      </TouchableOpacity>

      {/* Visit Date & Time Picker */}
      <Text style={styles.label}>Visit Date & Time</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setPicker({ visible: true, mode: "datetime", field: "visitDateTime" })}
      >
        <Text>{patient.visitDateTime.toISOString().replace("T", " ").slice(0, 16)}</Text>
      </TouchableOpacity>

      {/* Blood Pressure */}
      <Text style={styles.label}>Blood Pressure</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter blood pressure (systolic only)"
        keyboardType="numeric"
        value={patient.bloodPressure}
        onChangeText={(text) => setPatient({ ...patient, bloodPressure: text })}
      />

      {/* Respiratory Rate */}
      <Text style={styles.label}>Respiratory Rate</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter respiratory rate (breaths/min)"
        keyboardType="numeric"
        value={patient.respiratoryRate}
        onChangeText={(text) => setPatient({ ...patient, respiratoryRate: text })}
      />

      {/* Oxygen Level */}
      <Text style={styles.label}>Oxygen Level</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter oxygen level (%)"
        keyboardType="numeric"
        value={patient.oxygenLevel}
        onChangeText={(text) => setPatient({ ...patient, oxygenLevel: text })}
      />

      {/* Heartbeat Rate */}
      <Text style={styles.label}>Heartbeat Rate</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter heartbeat rate (bpm)"
        keyboardType="numeric"
        value={patient.heartbeatRate}
        onChangeText={(text) => setPatient({ ...patient, heartbeatRate: text })}
      />

      {/* Health Status Display */}
      <Text style={styles.label}>Health Status: {patient.healthStatus}</Text>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleAddPatient}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {/* DateTime Picker Modal */}
      <DateTimePickerModal
        isVisible={picker.visible}
        mode={picker.mode}
        onConfirm={handlePickerConfirm}
        onCancel={handlePickerCancel}
      />
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
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    justifyContent: "center",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
