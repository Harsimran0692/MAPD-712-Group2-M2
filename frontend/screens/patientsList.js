import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput, Image, FlatList, TouchableOpacity, ActivityIndicator, Modal, Button } from "react-native";
import { useNavigation } from '@react-navigation/native';

export default function PatientsList({ route }) {
  const navigation = useNavigation();
  const { userName } = route.params || "";
  const currentUser = {
    name: userName,
    profilePic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  };

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHealthStatus, setSelectedHealthStatus] = useState('All');
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/patient');
        if (!response.ok) throw new Error('Failed to fetch patients');
        const data = await response.json();
        setPatients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [patients]);

  const filteredPatients = patients.filter(patient =>
    (selectedHealthStatus === 'All' || patient.healthStatus === selectedHealthStatus) &&
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'Critical':
        return '#FF3B30'; // Red for critical
      case 'Stable':
        return '#4CAF50'; // Green for stable
      case 'Under Observation':
        return '#FFC107'; // Yellow for under observation
      default:
        return '#007AFF'; // Default blue color
    }
  };

  const renderPatientCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("PatientDetail", { patient: item })}>
      <Image source={{ uri: item.image || 'https://www.shutterstock.com/shutterstock/photos/162433460/display_1500/stock-vector-vector-user-icon-162433460.jpg' }}
        style={styles.patientImage} />
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.name}</Text>
        <Text style={[styles.healthStatus, { backgroundColor: getHealthStatusColor(item.healthStatus) }]}>
          Health Status: {item.healthStatus}
        </Text>
        <Text style={styles.dob}>Date of Birth: {item.dob}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image source={{ uri: currentUser.profilePic }} style={styles.profilePic} />
        <Text style={styles.userName}>Welcome, {currentUser.name}!</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search patients..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Filter Button - Shows Modal on Tap */}
      <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
        <Text style={styles.filterButtonText}>Filter by Health Status</Text>
      </TouchableOpacity>

      {/* Modal for selecting filter */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Health Status</Text>
            {['All', 'Stable', 'Critical', 'Under Observation'].map(status => (
              <TouchableOpacity
                key={status}
                style={[styles.filterOption, selectedHealthStatus === status && styles.selectedOption]}
                onPress={() => {
                  setSelectedHealthStatus(status);
                  setShowFilterModal(false);
                }}
              >
                <Text style={styles.filterOptionText}>{status}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setShowFilterModal(false)}>
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <Text style={styles.label}>Patient List</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddPatient")}>
          <Text style={styles.addButtonText}>+ Add New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPatients}
        renderItem={renderPatientCard}
        keyExtractor={(item) => item.id}
        style={styles.patientList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  topSection: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  profilePic: { width: 60, height: 60, borderRadius: 30, marginRight: 10 },
  userName: { fontSize: 20, fontWeight: "bold", color: "#333" },
  searchBar: {
    borderColor: "#ddd", borderWidth: 1, borderRadius: 10, paddingHorizontal: 10,
    paddingVertical: 8, marginBottom: 10, backgroundColor: "#fff", shadowColor: "#000",
    shadowOpacity: 0.1, elevation: 2,
  },
  filterButton: {
    backgroundColor: "#007AFF", paddingVertical: 12, borderRadius: 10, marginBottom: 15,
    alignItems: "center",
  },
  filterButtonText: {
    color: "#fff", fontSize: 16, fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300, backgroundColor: "#fff", borderRadius: 10, padding: 20, alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  filterOption: {
    paddingVertical: 10, paddingHorizontal: 15, width: '100%', alignItems: "center",
  },
  filterOptionText: { fontSize: 16, color: "#333" },
  selectedOption: { backgroundColor: "#007AFF", borderRadius: 10 },
  filterOptionTextSelected: { color: "#fff" },
  closeModalButton: {
    marginTop: 20, backgroundColor: "#FF3B30", paddingVertical: 10, borderRadius: 10, width: "25%", alignItems: "center"
  },
  closeModalText: { color: "#fff", fontSize: 14, fontWeight: "bold", padding: "auto", textTransform: "uppercase" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 24, fontWeight: "bold", color: "#333" },
  addButton: { backgroundColor: "#007AFF", paddingHorizontal: 20, paddingVertical: 8, borderRadius: 10 },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  patientList: { marginTop: 10 },
  card: {
    flexDirection: "row", backgroundColor: "#fff", borderRadius: 10, padding: 15, marginVertical: 8,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3, alignItems: "center",
  },
  patientImage: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  patientInfo: { flex: 1 },
  patientName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  healthStatus: { color: "#fff", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, marginVertical: 5 },
  dob: { color: "#777" },
  errorText: { color: "red", textAlign: "center", marginTop: 20 },
});

