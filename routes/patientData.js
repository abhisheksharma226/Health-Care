// const { Router } = require("express");
// const PatientData = require("../models/patient");


// const router = Router();

// router.get("/patientCollection" , (req , res) => {
//     return res.render("patientCollection"); 
// });


// router.post('/patientCollection', async (req, res) => {
//     try {
//         const { fullName, dateOfBirth, email, mobileNumber, gender, occupation, walkingData, heartRate, respiratoryRate, bloodPressure, calories, sleepQuality, temperature, earlyDiagnosticReports, ecgInformation } = req.body;

       
//         await PatientData.create({
//             fullName,
//             dateOfBirth,
//             email,
//             mobileNumber,
//             gender,
//             occupation,
//             walkingData,
//             heartRate,
//             respiratoryRate,
//             bloodPressure,
//             calories,
//             sleepQuality,
//             temperature,
//             earlyDiagnosticReports,
//             ecgInformation
//         });

//         res.redirect('patientHome');
//     } catch (error) {
//         console.error('Error creating patient data:', error);
//         res.status(500).json({ error: 'Error creating patient data. Please try again.' });
//     }
// });



// module.exports = router;