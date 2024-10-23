import React from 'react';
import { StyleSheet, View, Text, FlatList, Image } from 'react-native';

const PatientHistory = ({ route }) => {
  const { history, name, image, dob } = route.params; // Destructuring the patient data from params

  // Calculate age based on the date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.eventDate}>Date: {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</Text>
      <Text style={styles.eventDetail}>Blood Pressure: {item.bloodPressure || 'N/A'}</Text>
      <Text style={styles.eventDetail}>Respiratory Rate: {item.respiratoryRate || 'N/A'} breaths/min</Text>
      <Text style={styles.eventDetail}>Oxygen Level: {item.oxygenLevel || 'N/A'}</Text>
      <Text style={styles.eventDetail}>Heartbeat Rate: {item.heartbeatRate || 'N/A'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.patientInfo}>
        <Image source={{ uri: image || 'https://www.shutterstock.com/shutterstock/photos/162433460/display_1500/stock-vector-vector-user-icon-162433460.jpg' }}
         style={styles.patientImage} />
        <Text style={styles.patientName}>{name}</Text>
        <Text style={styles.patientAge}>Age: {calculateAge(dob)} years</Text>
      </View>

      <Text style={styles.title}>Patient History</Text>
      {history && history.length > 0 ? (
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderHistoryItem}
        />
      ) : (
        <Text style={styles.noHistoryText}>No history available for this patient.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  patientInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  patientImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  patientAge: {
    fontSize: 16,
    color: 'gray',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  historyItem: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  eventDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDetail: {
    fontSize: 16,
    marginTop: 5,
  },
  noHistoryText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PatientHistory;
