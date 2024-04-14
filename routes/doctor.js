const { Router } = require("express");
const Doctor = require("../models/doctor");

const router = Router();

router.get("/drLogin" , (req , res) => {
    return res.render("drLogin"); 
})

router.get("/drSignup" , (req , res) => {
    return res.render("drSignup");
})

router.get("/drHome" , (req , res) => {
    return res.render("drHome");
})

router.get("/drProfile" , (req ,res) => {
    return res.render("drProfile");
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
        const existingDoctor = await Doctor.findOne({ email: dremail });
        if (existingDoctor) {
            return res.render("drSignup", {
                error: "Email Already Exist!"
            });
            
        }
    await Doctor.create({
        drname , 
        email: dremail , 
        drpassword, 
    })
    return res.redirect("drHome");
    
} catch (error) {
    return res.render("drSignup" , {
        error : "Email Already !"
    })
}
})


module.exports = router;