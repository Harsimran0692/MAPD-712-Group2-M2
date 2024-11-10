import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

const EditPatient = ({ route, navigation }) => {
  const { patient } = route.params; // The patient data passed from PatientDetail
  
  const [formData, setFormData] = useState({
    name: patient.name,
    dob: patient.dob,
    healthStatus: patient.healthStatus,
    lastVisit: patient.lastVisit,
    visitDateTime: patient.visitDateTime,
    bloodPressure: patient.bloodPressure,
    respiratoryRate: String(patient.respiratoryRate),
    oxygenLevel: patient.oxygenLevel,
    heartbeatRate: patient.heartbeatRate,
    image: patient.image,
  });
  const [loading, setLoading] = useState(false);

  // Function to handle form input change
  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Function to submit the updated data
  const handleSubmit = async () => {
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/patient/${patient._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update patient details');
      }
      const data = await response.json();
      Alert.alert('Success', 'Patient details updated successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Edit Patient Details</Text>

        {/* Patient Name */}
        <TextInput
          style={styles.input}
          placeholder="Patient Name"
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
        />

        {/* Patient Date of Birth */}
        <TextInput
          style={styles.input}
          placeholder="Date of Birth (YYYY-MM-DD)"
          value={formData.dob}
          onChangeText={(text) => handleInputChange('dob', text)}
        />

        {/* Health Status */}
        <TextInput
          style={styles.input}
          placeholder="Health Status"
          value={formData.healthStatus}
          onChangeText={(text) => handleInputChange('healthStatus', text)}
        />

        {/* Last Visit */}
        <TextInput
          style={styles.input}
          placeholder="Last Visit"
          value={formData.lastVisit}
          onChangeText={(text) => handleInputChange('lastVisit', text)}
        />

        {/* Visit Date and Time */}
        <TextInput
          style={styles.input}
          placeholder="Visit Date and Time"
          value={formData.visitDateTime}
          onChangeText={(text) => handleInputChange('visitDateTime', text)}
        />

        {/* Vitals Section */}
        <Text style={styles.sectionTitle}>Vitals</Text>

        <TextInput
          style={styles.input}
          placeholder="Blood Pressure"
          value={formData.bloodPressure}
          onChangeText={(text) => handleInputChange('bloodPressure', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Respiratory Rate"
          value={formData.respiratoryRate}
          onChangeText={(text) => handleInputChange('respiratoryRate', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Oxygen Level"
          value={formData.oxygenLevel}
          onChangeText={(text) => handleInputChange('oxygenLevel', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Heartbeat Rate"
          value={formData.heartbeatRate}
          onChangeText={(text) => handleInputChange('heartbeatRate', text)}
        />

        {/* Image URL */}
        <TextInput
          style={styles.input}
          placeholder="Image URL"
          value={formData.image}
          onChangeText={(text) => handleInputChange('image', text)}
        />

        {/* Spacer for better spacing */}
        <View style={styles.bottomSpacer}></View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Update Details</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Ensures content can grow with the screen
    padding: 20,
    backgroundColor: '#f5f5f5',
    paddingBottom: 100, // Extra space for the button at the bottom
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
    backgroundColor: '#fff',
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10, color: '#333' },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  bottomSpacer: {
    height: 20, // Spacer to add space before the button
  },
});

export default EditPatient;
