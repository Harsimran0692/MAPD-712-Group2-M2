import mongoose from "mongoose";

// Define the schema for the patient
const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  healthStatus: {
    type: String,
    required: true
  },
  lastVisit: {
    type: Date,
    required: true
  },
  bloodPressure: {
    type: String,
    required: true
  },
  respiratoryRate: {
    type: Number,
    required: true
  },
  oxygenLevel: {
    type: String,
    required: true
  },
  heartbeatRate: {
    type: String,
    required: true
  },
  history: [
    {
      date: {
        type: Date,
        required: true
      },
      bloodPressure: {
        type: String,
        required: true
      },
      respiratoryRate: {
        type: Number,
        required: true
      },
      oxygenLevel: {
        type: String,
        required: true
      },
      heartbeatRate: {
        type: String,
        required: true
      },
      healthStatus: {
        type: String,
        required: true
      }
    }
  ]
});

// Create the Patient model
const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
