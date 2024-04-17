const { Router } = require("express");
const Doctor = require("../models/doctor");
const doctorData = require("../models/doctorDetails");
const patientappointment = require("../models/patientAppointment");


const router = Router();

router.get("/drLogin" , (req , res) => {
    return res.render("drLogin"); 
})



router.get("/drHome" ,async (req , res) => {
    try {
       
        const loggedIndoctor = await Doctor.findOne({});
        if (!loggedIndoctor) {
            return res.render("drLogin", { error: "No Doctor found" });
        }
        // if (!loggedInPatient) {
            //     console.error("No patient found");
            //     return res.render("login", { error: "No patient found" });
            // }
            
        const doctor = await Doctor.findOne({});
        const loggedInDoctor = await doctorData.findOne({});
        const patientappoint = await patientappointment.findOne({});
       
        return res.render("drHome", { 
            doctorNAME: doctor.drname , 
            patientName : patientappoint.name ,
            patientEmail : patientappoint.email ,
            patientNumber : patientappoint.number ,
            patientDate : patientappoint.date ,
            patientTime : patientappoint.time ,
        });
    } catch (error) {
        console.error("Error fetching patient name:", error);
        return res.render("drHome");
    }
})





router.get("/drProfile" , async (req ,res) => {

    const loggedIndoctor = await Doctor.findOne({});
    if (!loggedIndoctor) {
        return res.render("drLogin", { error: "No Doctor found" });
    }

    const updateData = await doctorData.findOne({});

    return res.render("drProfile" , {
        doctorName : loggedIndoctor.drname , 
        doctorEmail : loggedIndoctor.dremail ,
       
       
    })
})


router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/"); 
  });




router.post("/drLogin" , async(req , res) => {
    const { dremail , drpassword } = req.body;

    try {
        const token = await Doctor.matchPasswordAndGenerateTokenDr(dremail , drpassword);

    return res.cookie("token" , token).redirect("drHome"); 
    } catch (error) {
        return res.render("drLogin" , {
            error : "Incorrect Email or Password" ,
        })
    }  
})






module.exports = router;