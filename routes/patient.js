const { Router } = require("express");
const patient = require("../models/patient");
const patientData = require("../models/patientData");
const PatientAppointment = require("../models/patientAppointment");






const router = Router();

router.get("/login" , (req , res) => {
    return res.render("login"); 
})

router.get("/signup" , (req , res) => {
    return res.render("signup");
})

router.get("/patientCollection" , async (req , res) => {
    const loggedInPatient = await patient.findOne({});
        if (!loggedInPatient) {
            return res.render("login", { error: "No patient found" });
        }
    return res.render("patientCollection");
})




router.get("/patientHome", async (req, res) => {
    try {
        
        const loggedInPatientData = await patientData.findOne({});
        
        const Patient = await patient.findOne({});
        if (!Patient) {
            
            return res.render("login", { error: "No patient found" });
        }


        return res.render("patientHome", { 
            patientId : loggedInPatientData._id , 
            patientNAME: loggedInPatientData.fullName , 
            
            patientEmail : loggedInPatientData.email });
    } catch (error) {
        console.error("Error fetching patient name:", error);
        return res.render("patientHome");
    }
});


router.get("/patientProfile" , async (req , res) => {
    
    try {
       
        const loggedInPatientData = await patientData.findOne({});
        const appointedPatient = await PatientAppointment.findOne({});
        const loggedInPatient = await patient.findOne({});
        
        // if (!loggedInPatient) {
        //     console.error("No patient found");
        //     return res.render("login", { error: "No patient found" });
        // }

        return res.render("patientProfile", { 
            patientNAME: loggedInPatientData.fullName ,
            patientDOB : loggedInPatientData.dob , 
            patientEMAIL : loggedInPatientData.email , 
            patientNUMBER : loggedInPatientData.mobile ,
            patientGENDER : loggedInPatientData.gender ,
            patientOCCUPATION : loggedInPatientData.occupation , 
            patientwd : loggedInPatientData.walkingData , 
            patienthr : loggedInPatientData.heartRate , 
            patientrr : loggedInPatientData.respiratoryRate , 
            patientcl : loggedInPatientData.calories , 
            patientbp : loggedInPatientData.bloodPressure , 
            patientsq : loggedInPatientData.sleepQuality , 
            patienttmp : loggedInPatientData.temperature , 
            patientecg : loggedInPatientData.ecgInformation , 

            patientname : loggedInPatient.name,
            patientName: appointedPatient.name, 
            patientNumber : appointedPatient.number , 
            patientEmail : appointedPatient.email , 
            patientDate : appointedPatient.date.toDateString() , 
            patientTime : appointedPatient.time ,
            
        });
    } catch (error) {
        console.error("Error fetching patient name:", error);
        return res.render("patientProfile");
    }

    
})


router.get("/patientAppointments", async (req, res) => {
    try {
        const loggedInPatientData = await patientData.findOne({});
        if (!loggedInPatientData) {
            console.error("No patient found");
            return res.render("login", { error: "No patient found" });
        }
        
        // Corrected property name
        const appointedPatient = await PatientAppointment.findOne({});
        
        

        return res.render("patientAppointments", { 
          
            patientname : loggedInPatientData.fullName,
            patientName: appointedPatient.name, 
            patientNumber : appointedPatient.number , 
            patientEmail : appointedPatient.email , 
            patientDate : appointedPatient.date.toDateString() , 
            patientTime : appointedPatient.time ,
        });
    } catch (error) {
        console.error("Error fetching patient name:", error);
        return res.render("patientHome", { error: "Error fetching patient name" });
    }
});




router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/"); 
  });


router.post("/login" , async(req , res) => {
    const { email , password } = req.body;

    try {
        const token = await patient.matchPasswordAndGenerateToken(email , password);
        
        const loggedInPatient = await patient.findOne({ email });
        return res.cookie("token" , token).redirect("patientHome"); 

    } catch (error) {
        return res.render("login" , {
            error : "Incorrect Email or Password" ,
        })
    }  
})


router.post("/signup" , async(req , res) => {
    const { name , email , password } = req.body;

    try {
        const existingPatient = await patient.findOne({ email });
        if (existingPatient) {
            return res.render("signup", {
                error: "Email Already Exist!"
            });
        }
        await patient.create({
            name , 
            email , 
            password, 
        })
        return res.redirect("patientCollection");

    } catch (error) {
        return res.render("signup" , {
            error : "Email Already Exist!"
        })
    }

    
})


router.post("/patientCollection", async (req, res) => {
    try {
        const { fullName, dob, email, mobile, gender, occupation, walkingData, heartRate, respiratoryRate, bloodPressure, calories, sleepQuality, temperature,  ecgInformation } = req.body;

        // Create a new instance of Patient model with both registration and patientData form data
        const newPatient = new patientData({
            fullName,
            dob,
            email,
            mobile,
            gender,
            occupation,
            walkingData,
            heartRate,
            respiratoryRate,
            bloodPressure,
            calories,
            sleepQuality,
            temperature,
            ecgInformation,
        });

        await newPatient.validate();
        await newPatient.save();

        return res.redirect("patientHome");
    } catch (error) {
        console.error("Error creating patient:", error);
        return res.status(500).json({ error: "Error creating patient. Please try again." });
    }
});


router.post('/patientAppointments', async (req, res) => {
    try {
        const { name, number, email, date, time } = req.body;

        const newAppointment = new PatientAppointment({
            name,
            number,
            email,
            date,
            time
        });

       
        await newAppointment.validate();
        await newAppointment.save();

       
        return res.redirect("patientAppointments");
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: 'An error occurred while creating the appointment' });
    }
});


router.post("/updatePatientData", async (req, res) => {
    try {
        const { fullName, dob, email, mobile, gender, occupation, walkingData, heartRate, respiratoryRate, bloodPressure, calories, sleepQuality, temperature, ecgInformation } = req.body;

        // Construct the update object with the new data
        const updateData = {
            fullName,
            dob,
            mobile,
            gender,
            occupation,
            walkingData,
            heartRate,
            respiratoryRate,
            bloodPressure,
            calories,
            sleepQuality,
            temperature,
            ecgInformation
        };

        // Find the existing patient record by email and update it
        const updatedPatient = await patientData.findOneAndUpdate(
            { email: email }, // Filter
            updateData, // Update
            { new: true } // Options: return the updated document
        );


        

        if (!updatedPatient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        


        return res.redirect("patientHome");
        
    } catch (error) {
        console.error('Error updating patient data:', error);
        return res.status(500).json({ error: 'Error updating patient data. Please try again.' });
    }
});







module.exports = router;