const express = require('express');
const { check } = require('express-validator');
const router = express.Router()
const {newHistory,searchPatients,createPatient,getAllPatients, getPatientById, deletePatient, updatePatient, getHistoryOfPatient} = require('../../controllers/v1/patients/PatientController')
const uploadFile = require("../../middlewares/upload");



router.get('/', getAllPatients);
router.get('/search', searchPatients);
router.get('/:id', getPatientById);
router.delete('/:id', deletePatient);
router.put('/:id', updatePatient);
router.get('/:id/history', getHistoryOfPatient);
router.post(`/`, createPatient);
router.post(`/:id/history`, newHistory);
router.post(`/:id/history`,[
    uploadFile,
    check('file').custom((value, { req }) => {
    if (!req.file) throw new Error("File is required");
     return true;
    }
)],newHistory);

module.exports = router;