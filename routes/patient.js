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

router.get("/patientCollection" , (req , res) => {
    return res.render("patientCollection");
})


router.get("/patientHome", async (req, res) => {
    try {
       
        const loggedInPatient = await patient.findOne({});
        
        return res.render("patientHome", { patientName: loggedInPatient.name });
    } catch (error) {
        console.error("Error fetching patient name:", error);
        return res.render("patientHome");
    }
});


router.get("/patientProfile" , (req , res) => {
    return res.render("patientProfile")
})


router.get("/patientAppointments", async (req, res) => {
    try {
        const loggedInPatient = await patient.findOne({});
        if (!loggedInPatient) {
            console.error("No patient found");
            return res.render("patientHome", { error: "No patient found" });
        }
        
        // Corrected property name
        const patientAppointments = loggedInPatient.patientAppointments || [];
        
        return res.render("patientAppointments", { patientName: loggedInPatient.name, patientAppointments });
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




module.exports = router;