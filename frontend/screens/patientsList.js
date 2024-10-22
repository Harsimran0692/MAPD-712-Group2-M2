import React from "react";
import { StyleSheet, View, Text, TextInput, Button, Image, FlatList, TouchableOpacity } from "react-native";

const patients = [
    {
      id: '1',
      name: 'John Doe',
      healthStatus: 'Healthy',
      dob: '1990-01-15',
      image: 'https://via.placeholder.com/100', // Placeholder image URL
    },
    {
      id: '2',
      name: 'Jane Smith',
      healthStatus: 'Critical',
      dob: '1985-07-20',
      image: 'https://via.placeholder.com/100', // Placeholder image URL
    },
  ];



  export default function PatientsList() {
    const currentUser = {
      name: "Harsimran",
      profilePic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg", // Placeholder profile pic URL
    };
  
    const renderPatientCard = ({ item }) => (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.patientImage} />
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.name}</Text>
          <Text>Health Status: {item.healthStatus}</Text>
          <Text>Date of Birth: {item.dob}</Text>
        </View>
      </View>
    );
  
    return (
      <View style={styles.container}>
        {/* Top Section with User Name and Profile Pic */}
        <View style={styles.topSection}>
            <Text style={styles.userName}>{currentUser.name}</Text>
            <Image source={{ uri: currentUser.profilePic }} style={styles.profilePic} />
        </View>
  
        {/* Search Bar */}
        <TextInput style={styles.searchBar} placeholder="Search patients..." />
  
        {/* Label and Add New Button */}
        <View style={styles.header}>
          <Text style={styles.label}>Patient List</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add New</Text>
          </TouchableOpacity>
        </View>
  
        {/* Patient List */}
        <FlatList
          data={patients}
          renderItem={renderPatientCard}
          keyExtractor={(item) => item.id}
          style={styles.patientList}
        />
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
      textAlign: "center",
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
      marginBottom: 4,
    },
  });