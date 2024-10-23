import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import PatientHistory from './PatientHistory';

const PatientDetail = ({ route, navigation }) => {
  const { patient } = route.params;

  const handleHistoryPress = () => {
    // Navigation logic or action for viewing history
    navigation.navigate('PatientHistory', { history: patient.history, name: patient.name, dob: patient.dob });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Patient Info Section */}
      <View style={styles.infoContainer}>
        <Image source={{ uri: patient.image || 'https://www.shutterstock.com/shutterstock/photos/162433460/display_1500/stock-vector-vector-user-icon-162433460.jpg' }} 
        style={styles.patientImage} />
        <View style={styles.infoTextContainer}>
          <Text style={styles.patientName}>{patient.name}</Text>
          <Text style={styles.patientAge}>Age: {new Date().getFullYear() - new Date(patient.dob).getFullYear()}</Text>
        </View>
      </View>

      {/* Patient Notes */}
      <Text style={styles.note}>
        Notes about diseases and any remarks about the patient.
      </Text>

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
    padding: 20,
    backgroundColor: '#f4f6fc',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  patientImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  patientName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  patientAge: {
    fontSize: 18,
    color: '#777',
    marginTop: 4,
  },
  note: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginVertical: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  clinicalContainer: {
    width: '100%',
  },
  clinicalDataTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  clinicalDataContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  clinicalData: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
  },
  vitalsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  vitalsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  vitalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  vitalCard: {
    width: '48%',
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  vitalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  vitalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  historyButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PatientDetail;
