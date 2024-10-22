import { response } from "express";
import Patient from "../model/patientModel.js";

// POST
// Create a new patient
export const create = async(req,res)=>{
    try{
        const patientData = new Patient(req.body);
        const {email} = patientData;
        const patientExits = await Patient.findOne({email})
        if(patientExits){
            return res.status(400).json({message:"Patient already exists"})
        }
        const savedPatient = await patientData.save();
        res.status(200).json(savedPatient);
    }catch(error){
        return res.status(500).json({error:"Internal server error"});
    }
};

// Add new clinical data to a patient
export const addClinicalData = async (req, res) => {
    try {
        const id = req.params.id;  // Patient ID
        const newClinicalData = req.body;  // Clinical data to be added

        // Find the patient by ID
        const patient = await Patient.findById(id);

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Add the new clinical data to the clinical array
        patient.clinical.push(newClinicalData);

        // Save the updated patient document
        const updatedPatient = await patient.save();

        return res.status(200).json(updatedPatient);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};


// GET
// Fetch all patients
export const fetch = async(req,res)=>{
    try{
        const patients = await Patient.find();
        if(patients.length === 0){
            return res.status(400).json({message:"Patient not found"})
        }
        return res.status(200).json(patients);
    }catch(error){
        return res.status(500).json({error:"Internal server error"});
    }   
};

// Fetch patient
export const fetchById = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from request parameters
    const patient = await Patient.findById(id); // Query 
    
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    
    return res.status(200).json(patient); // Return the patient info
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch clinical data by Index
export const fetchClinicalDataByIndex = async (req, res) => {
    try {
        const id = req.params.id;  // Patient ID
        const index = req.params.index;  // Index of the clinical data to fetch

        const patient = await Patient.findById(id);

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Check if the index is valid
        if (index < 0 || index >= patient.clinical.length) {
            return res.status(400).json({ message: "Invalid clinical data index" });
        }

        // Return the specific clinical data
        return res.status(200).json(patient.clinical[index]);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Fetch the latest clinical data of a patient
export const fetchLatestClinicalData = async (req, res) => {
    try {
        const patientId = req.params.patientId;

        // Find the patient by ID
        const patient = await Patient.findOne({ _id: patientId });

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Check if there is any clinical data
        if (patient.clinical.length === 0) {
            return res.status(404).json({ message: "No clinical data available for this patient" });
        }

        // Fetch the latest clinical data (last item in the array)
        const latestClinicalData = patient.clinical[patient.clinical.length - 1];

        // Return the latest clinical data
        return res.status(200).json(latestClinicalData);

    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Fetch patients with Critical data
export const findCriticalPatients = async (req, res) => {
    try {
        // Find patients with clinical data that meet the critical condition criteria
        const criticalPatients = await Patient.find({
            "clinical": {
                $elemMatch: {
                    $or: [
                        { bph: { $lt: 50 } },   // Blood Pressure High (systolic) less than 50
                        { bph: { $gt: 150 } },  // Blood Pressure High (systolic) greater than 150
                        { bpl: { $lt: 60 } },   // Blood Pressure Low (diastolic) less than 60
                        { bpl: { $gt: 90 } }    // Blood Pressure Low (diastolic) greater than 90
                    ]
                }
            }
        });

        if (criticalPatients.length === 0) {
            return res.status(404).json({ message: "No patients in critical condition found" });
        }

        return res.status(200).json(criticalPatients);

    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

// UPDATE
// Update a patient info
export const update = async(req,res)=>{
    try{
        const id = req.params.id;
        const patient = await Patient.findOne({_id:id});

        if(!patient)
        {
            return res.status(404).json({message:"Patient not found"});
        }

        const updatePatient = await Patient.findByIdAndUpdate(id,
            req.body,{new:true});
        res.status(201).json(updatePatient)    
    }catch(error){
        return res.status(500).json({error:"Internal server error"});
    }  
};

// Update a spesific clinical data of a patient and index
export const updateClinicalData = async (req, res) => {
    try {
        const id = req.params.id;  // Patient ID
        const index = req.params.index;  // Index of the clinical data to update
        const updatedClinicalData = req.body;  // The new clinical data from the request body

        // Find the patient by ID
        const patient = await Patient.findById(id);

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Check if the index is valid
        if (index < 0 || index >= patient.clinical.length) {
            return res.status(400).json({ message: "Invalid clinical data index" });
        }

        // Update the specific clinical data at the given index
        patient.clinical[index] = { ...patient.clinical[index], ...updatedClinicalData };

        // Save the updated patient document
        const updatedPatient = await patient.save();

        return res.status(200).json(updatedPatient);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};
  

// DELETE
// Delete a patient, if it not included clinical data.
export const deletePatient = async (req, res) => {
    try {
        const id = req.params.id;

        // Check if the patient exists
        const patientExists = await Patient.findOne({_id: id});
        if (!patientExists) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Check if the patient has clinical data
        if (patientExists.clinical && patientExists.clinical.length > 0) {
            return res.status(400).json({ message: "Cannot delete patient with clinical data" });
        }

        // Delete the patient if no clinical data
        await Patient.findByIdAndDelete(id);

        // Return a success message
        res.status(204).json({ message: "Patient deleted successfully" });
        
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Delete a Specific Clinical Entry
export const deleteClinicalData = async (req, res) => {
    try {
        const id = req.params.id;  // Patient ID
        const index = req.params.index;  // Index of the clinical data to delete

        // Find the patient by ID
        const patient = await Patient.findById(id);

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Check if the index is valid
        if (index < 0 || index >= patient.clinical.length) {
            return res.status(400).json({ message: "Invalid clinical data index" });
        }

        // Remove the clinical data at the specified index
        patient.clinical.splice(index, 1);

        // Save the updated patient document
        const updatedPatient = await patient.save();

        return res.status(200).json(updatedPatient);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

  

