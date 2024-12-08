import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

const AddPatientHistory = ({ route, navigation }) => {
  const { patientId, history, name, dob } = route.params;

  const [date, setDate] = useState(new Date()); // Default to the current date and time
  const [bloodPressure, setBloodPressure] = useState("120/80");
  const [respiratoryRate, setRespiratoryRate] = useState("18");
  const [oxygenLevel, setOxygenLevel] = useState("98");
  const [heartbeatRate, setHeartbeatRate] = useState("72");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (selectedDate) => {
    if (selectedDate > new Date()) {
      Alert.alert("Date Error", "You cannot select a future date.");
    } else {
      setDate(selectedDate);
      hideDatePicker();
    }
  };

  // Validation functions for each input field
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

  const determineHealthStatus = () => {
    // Sample logic to determine health status
    const systolic = parseInt(bloodPressure.split("/")[0], 10);
    const diastolic = parseInt(bloodPressure.split("/")[1], 10);
    const respRate = parseInt(respiratoryRate, 10);
    const oxyLevel = parseInt(oxygenLevel, 10);
    const heartRate = parseInt(heartbeatRate, 10);

    if (systolic > 140 || diastolic > 90 || heartRate > 100 || respRate > 20 || oxyLevel < 95) {
      return "At Risk";
    } else if (systolic < 90 || diastolic < 60 || heartRate < 60 || respRate < 12 || oxyLevel > 100) {
      return "Abnormal";
    } else {
      return "Normal";
    }
  };

  const handleAddHistory = async () => {
    if (!date || !bloodPressure || !respiratoryRate || !oxygenLevel || !heartbeatRate) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    if (
      !validateBloodPressure(bloodPressure) ||
      !validateRespiratoryRate(respiratoryRate) ||
      !validateOxygenLevel(oxygenLevel) ||
      !validateHeartbeatRate(heartbeatRate)
    ) {
      return; // Stop if any validation fails
    }

    // Determine health status based on input
    const newStatus = determineHealthStatus();

    try {
      const response = await fetch(`http://localhost:3000/api/patient/${patientId}/history`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: date.toISOString(),
          bloodPressure,
          respiratoryRate: parseInt(respiratoryRate, 10),
          oxygenLevel,
          heartbeatRate,
          healthStatus: newStatus,
        }),
      });

      if (response.ok) {
        const updatedPatient = await response.json();
        Alert.alert("Success", "Patient history added successfully!");
        navigation.goBack();
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to add history.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while adding history.");
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add Patient History</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date and Time</Text>
        <TouchableOpacity style={styles.input} onPress={showDatePicker}>
          <Text style={styles.dateText}>
            {moment(date).format("YYYY-MM-DD HH:mm:ss")}
          </Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        date={date}
        minimumDate={new Date(0)}
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Blood Pressure</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 120/80"
          value={bloodPressure}
          onChangeText={setBloodPressure}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Respiratory Rate</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 16"
          value={respiratoryRate}
          keyboardType="numeric"
          onChangeText={setRespiratoryRate}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Oxygen Level</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 98"
          value={oxygenLevel}
          onChangeText={setOxygenLevel}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Heartbeat Rate</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 72"
          value={heartbeatRate}
          onChangeText={setHeartbeatRate}
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddHistory}>
        <Text style={styles.buttonText}>Add History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AddPatientHistory;
