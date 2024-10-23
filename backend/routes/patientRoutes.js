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
  
  export default router;

