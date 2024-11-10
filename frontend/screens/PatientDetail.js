import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

const PatientDetail = ({ route, navigation }) => {
  const { patient } = route.params;

  const handleHistoryPress = () => {
    // Navigation logic or action for viewing history
    navigation.navigate('PatientHistory', { history: patient.history, name: patient.name, dob: patient.dob });
  };

  const handleEditPress = () => {
    // Navigate to EditPatient screen to edit patient details
    navigation.navigate('EditPatient', { patient });
  };

  return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* Patient Info Section */}
        <View style={styles.infoContainer}>
          <Image
            source={{
              uri: patient.image || 'https://www.shutterstock.com/shutterstock/photos/162433460/display_1500/stock-vector-vector-user-icon-162433460.jpg',
            }}
            style={styles.patientImage}
          />
          <View style={styles.infoTextContainer}>
            <Text style={styles.patientName}>{patient.name}</Text>
            <Text style={styles.patientAge}>
              Age: {new Date().getFullYear() - new Date(patient.dob).getFullYear()}
            </Text>
          </View>
        </View>

        {/* Edit Button */}
        <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
          <Text style={styles.editButtonText}>Edit Details</Text>
        </TouchableOpacity>

        {/* Patient Notes */}
        <Text style={styles.note}>Notes about diseases and any remarks about the patient.</Text>

        {/* Clinical Data Section */}
        <View style={styles.clinicalContainer}>
          <Text style={styles.clinicalDataTitle}>Clinical Data</Text>

          {/* Health Info */}
          <View style={styles.clinicalDataContainer}>
            <Text style={styles.clinicalData}>Health Status: {patient.healthStatus}</Text>
            <Text style={styles.clinicalData}>Last Visit: {patient.lastVisit || 'N/A'}</Text>
            <Text style={styles.clinicalData}>Date and Time: {patient.visitDateTime || 'N/A'}</Text>
          </View>

          {/* Vitals Section */}
          <View style={styles.vitalsContainer}>
            <Text style={styles.vitalsTitle}>Vitals</Text>
            <View style={styles.vitalsRow}>
              <View style={styles.vitalCard}>
                <Text style={styles.vitalLabel}>Blood Pressure</Text>
                <Text style={styles.vitalValue}>{patient.bloodPressure || 'N/A'}</Text>
              </View>
              <View style={styles.vitalCard}>
                <Text style={styles.vitalLabel}>Respiratory Rate</Text>
                <Text style={styles.vitalValue}>{patient.respiratoryRate || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.vitalsRow}>
              <View style={styles.vitalCard}>
                <Text style={styles.vitalLabel}>Oxygen Level</Text>
                <Text style={styles.vitalValue}>{patient.oxygenLevel || 'N/A'}</Text>
              </View>
              <View style={styles.vitalCard}>
                <Text style={styles.vitalLabel}>Heartbeat Rate</Text>
                <Text style={styles.vitalValue}>{patient.heartbeatRate || 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* History Button */}
        <TouchableOpacity style={styles.historyButton} onPress={handleHistoryPress}>
          <Text style={styles.historyButtonText}>View History</Text>
        </TouchableOpacity>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  patientImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  infoTextContainer: {
    flex: 1,
  },
  patientName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  patientAge: {
    fontSize: 16,
    color: '#777',
  },
  editButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 15,
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  note: {
    marginBottom: 20,
    fontSize: 16,
    color: '#555',
  },
  clinicalContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  clinicalDataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  clinicalDataContainer: {
    marginBottom: 15,
  },
  clinicalData: {
    fontSize: 16,
    color: '#555',
  },
  vitalsContainer: {
    marginTop: 15,
  },
  vitalsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  vitalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vitalCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    margin: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  vitalLabel: {
    fontSize: 14,
    color: '#777',
  },
  vitalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  historyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PatientDetail;
