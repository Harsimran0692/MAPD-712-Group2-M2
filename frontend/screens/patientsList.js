import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput, Button, Image, FlatList, TouchableOpacity, ActivityIndicator, Modal, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';

export default function PatientsList({ route }) {
  const navigation = useNavigation(); // Initialize useNavigation
  const { userName } = route.params; // Get userName from route parameters
  const currentUser = {
    name: userName, // Access userName directly
    profilePic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  };

  const [patients, setPatients] = useState([]); // State to hold patient data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [newPatient, setNewPatient] = useState({ // State for new patient data
    fullName: '',
    gender: '',
    dob: '',
    healthStatus: '',
    bloodPressure: '',
    respiratoryRate: '',
    oxygenLevel: '',
    heartbeat: ''
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/patient', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch patients');
        }
        const data = await response.json();
        setPatients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPatientCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("PatientDetail", { patient: item })}>
      <Image source={{ uri: item.image || 'https://www.shutterstock.com/shutterstock/photos/162433460/display_1500/stock-vector-vector-user-icon-162433460.jpg' }}
        style={styles.patientImage} />
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.name}</Text>
        <Text style={styles.healthStatus}>Health Status: {item.healthStatus}</Text>
        <Text style={styles.dob}>Date of Birth: {item.dob}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleAddPatient = () => {
    // Logic to handle adding a new patient
    // For now, we just log the new patient data to the console
    console.log(newPatient);
    setModalVisible(false); // Close the modal after submission
    // Here, you would typically send the data to your API to save it
    setNewPatient({ // Reset the form
      fullName: '',
      gender: '',
      dob: '',
      healthStatus: '',
      bloodPressure: '',
      respiratoryRate: '',
      oxygenLevel: '',
      heartbeat: ''
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.userName}>{currentUser.name}</Text>
        <Image source={{ uri: currentUser.profilePic }} style={styles.profilePic} />
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search patients..."
        value={searchQuery}
        onChangeText={setSearchQuery} // Update search query state
      />

      <View style={styles.header}>
        <Text style={styles.label}>Patient List</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>Add New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPatients}
        renderItem={renderPatientCard}
        keyExtractor={(item) => item.id}
        style={styles.patientList}
      />

      {/* Modal for adding a new patient */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Patient</Text>
            <ScrollView>
              <TextInput
                placeholder="Full Name"
                style={styles.input}
                value={newPatient.fullName}
                onChangeText={(text) => setNewPatient({ ...newPatient, fullName: text })}
              />
              <TextInput
                placeholder="Gender"
                style={styles.input}
                value={newPatient.gender}
                onChangeText={(text) => setNewPatient({ ...newPatient, gender: text })}
              />
              <TextInput
                placeholder="Date of Birth"
                style={styles.input}
                value={newPatient.dob}
                onChangeText={(text) => setNewPatient({ ...newPatient, dob: text })}
              />
              <TextInput
                placeholder="Health Status"
                style={styles.input}
                value={newPatient.healthStatus}
                onChangeText={(text) => setNewPatient({ ...newPatient, healthStatus: text })}
              />
              <TextInput
                placeholder="Blood Pressure"
                style={styles.input}
                value={newPatient.bloodPressure}
                onChangeText={(text) => setNewPatient({ ...newPatient, bloodPressure: text })}
              />
              <TextInput
                placeholder="Respiratory Rate"
                style={styles.input}
                value={newPatient.respiratoryRate}
                onChangeText={(text) => setNewPatient({ ...newPatient, respiratoryRate: text })}
              />
              <TextInput
                placeholder="Oxygen Level"
                style={styles.input}
                value={newPatient.oxygenLevel}
                onChangeText={(text) => setNewPatient({ ...newPatient, oxygenLevel: text })}
              />
              <TextInput
                placeholder="Heartbeat"
                style={styles.input}
                value={newPatient.heartbeat}
                onChangeText={(text) => setNewPatient({ ...newPatient, heartbeat: text })}
              />
            </ScrollView>
            <Button title="Submit" onPress={handleAddPatient} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 56,
    justifyContent: "space-between"
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 22,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  patientList: {
    flex: 1,
  },
  card: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  patientImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 9,
    color: "#007bff"
  },
  healthStatus: {
    marginBottom: 8
  },
  dob: {
    marginBottom: 8
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: "red",
    marginTop: 20,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
});
