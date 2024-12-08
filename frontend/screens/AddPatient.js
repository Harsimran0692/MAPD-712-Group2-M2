import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function AddPatient() {
  const navigation = useNavigation();
  const apiUrl = "http://localhost:3000/api/patient";

  const [patient, setPatient] = useState({
    name: "",
    dob: new Date(),
    lastVisit: new Date(),
    bloodPressure: "",
    respiratoryRate: "",
    oxygenLevel: "",
    heartbeatRate: "",
  });

  const [picker, setPicker] = useState({
    visible: false,
    mode: "date",
    field: null,
  });

  const validateBloodPressure = (input) => {
    const regex = /^\d{2,3}\/\d{2,3}$/; // Format should be e.g., 120/80
    if (!regex.test(input)) {
      Alert.alert("Validation Error", "Blood pressure must be in the format '120/80'.");
      return false;
    }

    const [systolic, diastolic] = input.split("/").map(Number);
    if (systolic < 70 || systolic > 200 || diastolic < 40 || diastolic > 120) {
      Alert.alert("Validation Error", "Blood pressure values must be within reasonable medical ranges.");
      return false;
    }

    return true;
  };

  const validateRespiratoryRate = (input) => {
    const rate = parseInt(input, 10);
    if (isNaN(rate) || rate < 5 || rate > 40) { // Typical adult range is 12-20
      Alert.alert("Validation Error", "Respiratory rate must be between 5 and 40.");
      return false;
    }
    return true;
  };

  const validateOxygenLevel = (input) => {
    const level = parseInt(input, 10);
    if (isNaN(level) || level < 0 || level > 100) {
      Alert.alert("Validation Error", "Oxygen level must be between 0 and 100.");
      return false;
    }
    return true;
  };

  const validateHeartbeatRate = (input) => {
    const rate = parseInt(input, 10);
    if (isNaN(rate) || rate < 30 || rate > 200) { // Typical adult range is 60-100 bpm
      Alert.alert("Validation Error", "Heartbeat rate must be between 30 and 200.");
      return false;
    }
    return true;
  };

  const calculateStatus = (bloodPressure, respiratoryRate, oxygenLevel, heartbeatRate) => {
    if (bloodPressure > 140 || respiratoryRate < 12 || oxygenLevel < 90 || heartbeatRate > 100) {
      return "Critical";
    } else if (bloodPressure > 120 || respiratoryRate > 20 || oxygenLevel < 95 || heartbeatRate > 80) {
      return "At Risk";
    }
    return "Stable";
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
      // Validate each field before proceeding
      if (!validateBloodPressure(patient.bloodPressure)) return;
      if (!validateRespiratoryRate(patient.respiratoryRate)) return;
      if (!validateOxygenLevel(patient.oxygenLevel)) return;
      if (!validateHeartbeatRate(patient.heartbeatRate)) return;

      // Split blood pressure input into systolic and diastolic
      const [systolic, diastolic] = patient.bloodPressure.split("/").map(Number);

      const status = calculateStatus(
        systolic,
        parseFloat(patient.respiratoryRate),
        parseFloat(patient.oxygenLevel),
        parseFloat(patient.heartbeatRate)
      );

      console.log("status: " + status);

      const patientData = {
        ...patient,
        dob: patient.dob.toISOString().split("T")[0],
        lastVisit: patient.lastVisit.toISOString(),
        healthStatus: status, // Include calculated status
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
      <Text style={styles.label}>Last Visit</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setPicker({ visible: true, mode: "datetime", field: "lastVisit" })}
      >
        <Text>{patient.lastVisit.toISOString().replace("T", " ").slice(0, 16)}</Text>
      </TouchableOpacity>

      {/* Blood Pressure */}
      <Text style={styles.label}>Blood Pressure (systolic/diastolic)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter blood pressure (e.g., 120/80)"
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
