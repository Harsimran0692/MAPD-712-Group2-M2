import React, { useState, useEffect } from 'react';
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

  const convertDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const [formData, setFormData] = useState({
    name: patient.name,
    dob: patient.dob ? convertDate(patient.dob) : new Date(),
    healthStatus: patient.healthStatus,
    lastVisit: patient.lastVisit ? convertDate(patient.lastVisit) : new Date(),
    visitDateTime: patient.visitDateTime ? convertDate(patient.visitDateTime) : new Date(),
    systolic: '',
    diastolic: '',
    respiratoryRate: String(patient.respiratoryRate),
    oxygenLevel: String(patient.oxygenLevel),
    heartbeatRate: String(patient.heartbeatRate),
    image: patient.image,
  });

  useEffect(() => {
    if (patient.bloodPressure) {
      const [systolic, diastolic] = patient.bloodPressure.split('/');
      setFormData((prevData) => ({
        ...prevData,
        systolic: systolic || '',
        diastolic: diastolic || '',
      }));
    }
  }, [patient.bloodPressure]);

  const [loading, setLoading] = useState(false);
  const [picker, setPicker] = useState({
    visible: false,
    mode: 'date',
    field: null,
  });

  const updateHealthStatus = () => {
    const { systolic, diastolic, respiratoryRate, oxygenLevel, heartbeatRate } = formData;
    const systolicValue = parseFloat(systolic);
    const diastolicValue = parseFloat(diastolic);

    let status = 'Stable'; // Default status

    if (!isNaN(systolicValue) && !isNaN(diastolicValue)) {
      if (
        systolicValue > 180 || diastolicValue > 120 ||
        parseInt(heartbeatRate) > 120 || parseInt(oxygenLevel) < 90
      ) {
        status = 'Critical';
      } else if (
        systolicValue > 140 || diastolicValue > 90 ||
        parseInt(oxygenLevel) < 95
      ) {
        status = 'At Risk';
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      healthStatus: status,
    }));
  };

  useEffect(() => {
    updateHealthStatus();
  }, [formData.systolic, formData.diastolic, formData.respiratoryRate, formData.oxygenLevel, formData.heartbeatRate]);

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handlePickerConfirm = (date) => {
    if (isNaN(date.getTime())) {
      console.error("Invalid date value passed:", date);
      return;
    }
    setPicker({ visible: false, mode: 'date', field: null });
    if (picker.field) {
      setFormData((prevData) => ({ ...prevData, [picker.field]: date }));
    }
  };

  const handlePickerCancel = () => {
    setPicker({ visible: false, mode: 'date', field: null });
  };

  const validateBloodPressure = (input) => {
    const regex = /^\d{2,3}\/\d{2,3}$/;
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
    if (isNaN(rate) || rate < 5 || rate > 40) {
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
    if (isNaN(rate) || rate < 30 || rate > 200) {
      Alert.alert("Validation Error", "Heartbeat rate must be between 30 and 200.");
      return false;
    }
    return true;
  };

  const validateInputs = () => {
    const { name, systolic, diastolic, respiratoryRate, oxygenLevel, heartbeatRate, dob, lastVisit } = formData;

    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty.');
      return false;
    }

    if (dob > new Date() || lastVisit > new Date()) {
      Alert.alert('Validation Error', 'Date of birth and last visit cannot be in the future.');
      return false;
    }

    if (!validateBloodPressure(`${systolic}/${diastolic}`)) return false;
    if (!validateRespiratoryRate(respiratoryRate)) return false;
    if (!validateOxygenLevel(oxygenLevel)) return false;
    if (!validateHeartbeatRate(heartbeatRate)) return false;

    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formattedBloodPressure = `${formData.systolic}/${formData.diastolic}`;

    if (!validateInputs()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/patient/${patient._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          bloodPressure: formattedBloodPressure,
        }),
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

        <Text style={styles.label}>Systolic BP</Text>
        <TextInput
          style={styles.input}
          value={formData.systolic}
          onChangeText={(text) => handleInputChange('systolic', text)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Diastolic BP</Text>
        <TextInput
          style={styles.input}
          value={formData.diastolic}
          onChangeText={(text) => handleInputChange('diastolic', text)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Respiratory Rate</Text>
        <TextInput
          style={styles.input}
          value={formData.respiratoryRate}
          onChangeText={(text) => handleInputChange('respiratoryRate', text)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Oxygen Level</Text>
        <TextInput
          style={styles.input}
          value={formData.oxygenLevel}
          onChangeText={(text) => handleInputChange('oxygenLevel', text)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Heartbeat Rate</Text>
        <TextInput
          style={styles.input}
          value={formData.heartbeatRate}
          onChangeText={(text) => handleInputChange('heartbeatRate', text)}
          keyboardType="numeric"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete Patient</Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={picker.visible}
          mode={picker.mode}
          date={formData[picker.field]}
          onConfirm={handlePickerConfirm}
          onCancel={handlePickerCancel}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EditPatient;
