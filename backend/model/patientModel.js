import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    bdate: { type: Date, required: true },
    address: { type: String },
    clinical: [{
        bph: { type: Number, required: true, default: 0 },  // Blood Pressure High (systolic)
        bpl: { type: Number, required: true, default: 0 },  // Blood Pressure Low (diastolic)
        rr: { type: Number, required: true, default: 0 },   // Respiratory Rate
        bol: { type: Number, required: true, default: 0 },  // Blood Oxygen Level
        hbr: { type: Number, required: true, default: 0 }   // Heart Beat Rate
    }]
}, { timestamps: true });
 
export default mongoose.model("patients", PatientSchema);
