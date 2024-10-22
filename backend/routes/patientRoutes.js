import express from 'express';
import { create, fetch, fetchById, update, deletePatient, addClinicalData, deleteClinicalData, fetchClinicalDataByIndex, updateClinicalData, findCriticalPatients } from '../controller/patientController.js';

const router = express.Router();

/**
 * @swagger
 * /api/patient/patients:
 *   get:
 *     summary: Fetch all patients
 *     description: Retrieves all patients from the database.
 *     responses:
 *       200:
 *         description: A list of patients.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   bdate:
 *                     type: string
 *                     format: date
 *                   address:
 *                     type: string
 *                   clinical:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         bp:
 *                           type: number
 *                         rr:
 *                           type: number
 *                         bol:
 *                           type: number
 *                         hbr:
 *                           type: number
 *       400:
 *         description: No patients found.
 *       500:
 *         description: Internal server error.
 */
router.get("/patients", fetch);

/**
 * @swagger
 * /api/patient/patients/{id}:
 *   get:
 *     summary: Fetch a patient by ID
 *     description: Retrieves a patient by their ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the patient to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 bdate:
 *                   type: string
 *                   format: date
 *                 address:
 *                   type: string
 *                 clinical:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       bp:
 *                         type: number
 *                       rr:
 *                         type: number
 *                       bol:
 *                         type: number
 *                       hbr:
 *                         type: number
 *       404:
 *         description: Patient not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/patients/:id", fetchById);

/**
 * @swagger
 * /api/patient/patients:
 *   post:
 *     summary: Create a new patient
 *     description: Adds a new patient to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               bdate:
 *                 type: string
 *                 format: date
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient created successfully.
 *       400:
 *         description: Patient already exists.
 *       500:
 *         description: Internal server error.
 */
router.post("/patients", create);

/**
 * @swagger
 * /api/patient/patients/{id}:
 *   put:
 *     summary: Update a patient's details
 *     description: Updates an existing patient's information.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the patient to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               bdate:
 *                 type: string
 *                 format: date
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient updated successfully.
 *       404:
 *         description: Patient not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/patients/:id", update);

/**
 * @swagger
 * /api/patient/patients/{id}:
 *   delete:
 *     summary: Delete a patient
 *     description: Deletes a patient from the database.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the patient to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient deleted successfully.
 *       404:
 *         description: Patient not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/patients/:id", deletePatient);

/**
 * @swagger
 * /api/patients/{id}/clinical:
 *   post:
 *     summary: Add clinical data to a patient
 *     description: Adds new clinical data to an existing patient.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the patient.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bp:
 *                 type: number
 *               rr:
 *                 type: number
 *               bol:
 *                 type: number
 *               hbr:
 *                 type: number
 *     responses:
 *       200:
 *         description: Clinical data added successfully.
 *       404:
 *         description: Patient not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/patients/:id/clinical", addClinicalData);

export default router;
