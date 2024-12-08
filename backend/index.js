import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors"
import router from "./routes/patientRoutes.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
const mongoUrl = process.env.MONGO_URL;

// middlewares
app.use(cors())
app.use(bodyParser.json())

app.use("/api/patient", router);


app.listen(PORT, () => {
    mongoose.connect(mongoUrl)
    .then(() => console.log("MongoDB Connection Successfull"))
    .catch((err) => console.error("Issue with connection", err))
    console.log(`Connected at Port: ${PORT}`);
})