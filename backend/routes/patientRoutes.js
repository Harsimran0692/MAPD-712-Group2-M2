import express from "express";
import Patient from "../models/patientModel.js";
const router = express.Router();

// Create a new patient
router.post("/", async (req, res) => {
    try {
      const newPatient = new Patient(req.body);
      const savedPatient = await newPatient.save();
      res.status(201).json(savedPatient);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get all patients
  router.get("/", async (req, res) => {
    try {
      const patients = await Patient.find();
      res.status(200).json(patients);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get a patient by ID
  router.get("/:id", async (req, res) => {
    try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.status(200).json(patient);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Update a patient by ID
  router.put("/:id", async (req, res) => {
    try {
      const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!updatedPatient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.status(200).json(updatedPatient);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Delete a patient by ID
  router.delete("/:id", async (req, res) => {
    try {
      const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
      if (!deletedPatient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.status(204).send(); // No content
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Add history to a patient by ID and update main fields
router.patch("/:id/history", async (req, res) => {  
  const patientId = req.params.id;
  
  const { date, bloodPressure, respiratoryRate, oxygenLevel, heartbeatRate, healthStatus } = req.body;

  try {
    // Find the patient by ID and update the history
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Append new history entry
    patient.history.push({
      date,
      bloodPressure,
      respiratoryRate,
      oxygenLevel,
      heartbeatRate,
      healthStatus,
    });

    // Save the patient document with the new history
    await patient.save();

    res.status(200).json({ message: "Patient history updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating patient history." });
  }
});

  
  export default router;

