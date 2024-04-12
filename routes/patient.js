const { Router } = require("express");
const patient = require("../models/patient");
const patientData = require("../models/patientData");

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

router.get("/patientHome" , (req , res) => {
    return res.render("patientHome");
})

router.post("/login" , async(req , res) => {
    const { email , password } = req.body;

    try {
        const token = await patient.matchPasswordAndGenerateToken(email , password);

    return res.cookie("token" , token).redirect("patientHome"); 
    } catch (error) {
        return res.render("login" , {
            error : "Incorrect Email or Password" ,
        })
    }  
})

router.post("/signup" , async(req , res) => {
    const { name , email , password } = req.body;
    await patient.create({
        name , 
        email , 
        password, 
    })
    return res.redirect("patientCollection");
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

module.exports = router;