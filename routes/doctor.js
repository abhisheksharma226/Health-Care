const { Router } = require("express");
const Doctor = require("../models/doctor");
const doctorData = require("../models/doctorDetails");
const patientappointment = require("../models/patientAppointment");


const router = Router();

router.get("/drLogin" , (req , res) => {
    return res.render("drLogin"); 
})

router.get("/drSignup" , (req , res) => {
    return res.render("drSignup");
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
            
        const loggedInDoctor = await doctorData.findOne({});
        const patientappoint = await patientappointment.findOne({});
       
        return res.render("drHome", { 
            doctorName: loggedInDoctor.fullName , 
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
        doctorName : updateData.fullName , 
        doctorEmail : updateData.email ,
        doctorDOB : updateData.dob.toDateString() , 
        doctorNumber : updateData.mobile ,
        doctorGender : updateData.gender ,
       
    })
})


router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/"); 
  });


router.get("/drCollection" , async (req , res) => {
    const loggedIndoctor = await Doctor.findOne({});
    if (!loggedIndoctor) {
        return res.render("drLogin", { error: "No Doctor found" });
    }
    return res.render("drCollection")
})

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


router.post("/drSignup" , async(req , res) => {
    const { drname , dremail , drpassword } = req.body;

    try {
        const existingDoctor = await Doctor.findOne({ dremail });
        if (existingDoctor) {
            return res.render("drSignup", {
                error: "Email Already Exist!"
            });
            
        }
    await Doctor.create({
        drname , 
        dremail , 
        drpassword , 
    })
    return res.redirect("drCollection");
    
} catch (error) {
    return res.render("drSignup" , {
        error : "Error creating doctor account!"
    })
}
})



router.post("/drCollection", async (req, res) => {
    try {
        const { fullName, dob, email, mobile, gender} = req.body;

        // Create a new instance of Patient model with both registration and Doctor form data
        const newDoctor = new doctorData({
            fullName,
            dob,
            email,
            mobile,
            gender,
           
            
        });

        await newDoctor.validate();
        await newDoctor.save();

        return res.redirect("drHome");
    } catch (error) {
        console.error("Error creating Doctor:", error);
        return res.status(500).json({ error: "Error creating Doctor. Please try again." });
    }
});



router.post("/updateDocotorData", async (req, res) => {
    try {
        const { fullName, dob, email, mobile, gender, occupation } = req.body;

        // Construct the update object with the new data
        const updateData = {
            fullName,
            dob,
            mobile,
            gender,
            occupation,
           
        };

        // Find the existing patient record by email and update it
        const updatedDoctor = await doctorData.findOneAndUpdate(
            { email: email }, // Filter
            updateData, // Update
            { new: true } // Options: return the updated document
        );

        if (!updatedDoctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        return res.redirect("drHome");
        
    } catch (error) {
        console.error('Error updating Doctor data:', error);
        return res.status(500).json({ error: 'Error updating Doctor data. Please try again.' });
    }
});








module.exports = router;