import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const EditPatient = ({ route, navigation }) => {
  const { patient } = route.params;

  console.log("patient.healthStatus", patient.healthStatus);
  
  const [formData, setFormData] = useState({
    name: patient.name,
    dob: new Date(patient.dob),
    healthStatus: patient.healthStatus,
    lastVisit: new Date(patient.lastVisit),
    visitDateTime: new Date(patient.visitDateTime),
    bloodPressure: String(patient.bloodPressure),
    respiratoryRate: String(patient.respiratoryRate),
    oxygenLevel: String(patient.oxygenLevel),
    heartbeatRate: String(patient.heartbeatRate),
    image: patient.image,
    
  });
  const [loading, setLoading] = useState(false);
  const [picker, setPicker] = useState({
    visible: false,
    mode: 'date',
    field: null,
  });

  const updateHealthStatus = () => {
    const { bloodPressure, respiratoryRate, oxygenLevel, heartbeatRate } = formData;

    console.log("bloodPressure", bloodPressure);
    
    
    // Simple health status logic based on vitals data
    let status = 'Stable';

    // Critical conditions (just examples, modify as needed)
    if (parseInt(bloodPressure) > 180 || parseInt(heartbeatRate) > 120 || parseInt(oxygenLevel) < 90) {
      status = 'Critical';
    }
    // Under observation conditions
    else if (parseInt(bloodPressure) > 140 || parseInt(oxygenLevel) < 95) {
      status = 'Under Observation';
    }

    setFormData((prevData) => ({
      ...prevData,
      healthStatus: status,
    }));
  };
  
  
  const handleInputChange = (name, value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
  
      // Update health status only when relevant fields are changed
      if (['bloodPressure', 'respiratoryRate', 'oxygenLevel', 'heartbeatRate'].includes(name)) {
        updateHealthStatus();
      }
  
      console.log('Form Data Updated:', updatedData);
      return updatedData;
    });
  };
  

  const handlePickerConfirm = (date) => {
    setPicker({ visible: false, mode: 'date', field: null });
    if (picker.field) {
      setFormData((prevData) => ({ ...prevData, [picker.field]: date }));
    }
  };

  const handlePickerCancel = () => {
    setPicker({ visible: false, mode: 'date', field: null });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/patient/${patient._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update patient details');
      }
      Alert.alert('Success', 'Patient details updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this patient?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`http://localhost:3000/api/patient/${patient._id}`, {
                method: 'DELETE',
              });
              if (!response.ok) {
                throw new Error('Failed to delete patient');
              }
              Alert.alert('Success', 'Patient deleted successfully!', [
                { text: 'OK', onPress: () => navigation.navigate('PatientsList') },
              ]);
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Edit Patient Details</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
        />

        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setPicker({ visible: true, mode: 'date', field: 'dob' })}
        >
          <Text>{formData.dob.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Last Visit</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setPicker({ visible: true, mode: 'date', field: 'lastVisit' })}
        >
          <Text>{formData.lastVisit.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Visit Date & Time</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setPicker({ visible: true, mode: 'datetime', field: 'visitDateTime' })}
        >
          <Text>{formData.visitDateTime.toISOString().replace('T', ' ').slice(0, 16)}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Vitals</Text>

        <Text style={styles.label}>Blood Pressure</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.bloodPressure}
          onChangeText={(text) => handleInputChange('bloodPressure', text)}
        />

        <Text style={styles.label}>Respiratory Rate</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.respiratoryRate}
          onChangeText={(text) => handleInputChange('respiratoryRate', text)}
        />

        <Text style={styles.label}>Oxygen Level</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.oxygenLevel}
          onChangeText={(text) => handleInputChange('oxygenLevel', text)}
        />

        <Text style={styles.label}>Heartbeat Rate</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.heartbeatRate}
          onChangeText={(text) => handleInputChange('heartbeatRate', text)}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Update Details</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete Patient</Text>
        </TouchableOpacity>
      </ScrollView>

      <DateTimePickerModal
        isVisible={picker.visible}
        mode={picker.mode}
        date={picker.mode === 'datetime' ? formData[picker.field] : new Date()}
        onConfirm={handlePickerConfirm}
        onCancel={handlePickerCancel}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 5 },
  input: { height: 40, borderWidth: 1, borderColor: '#ddd', marginBottom: 15, paddingHorizontal: 10 },
  submitButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 5 },
  submitText: { color: '#fff', textAlign: 'center' },
  deleteButton: { marginTop: 10, backgroundColor: '#FF3B30', padding: 10, borderRadius: 5 },
  deleteText: { color: '#fff', textAlign: 'center' },
});

export default EditPatient;
