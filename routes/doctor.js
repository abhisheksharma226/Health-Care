const { Router } = require("express");
const Doctor = require("../models/doctor");

const router = Router();

router.get("/login" , (req , res) => {
    return res.render("drLogin"); 
})

router.get("/signup" , (req , res) => {
    return res.render("drSignup");
})

router.get("/drHome" , (req , res) => {
    return res.render("drHome");
})

router.post("/login" , async(req , res) => {
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


router.post("/signup" , async(req , res) => {
    const { drname , dremail , drpassword } = req.body;
    
    await Doctor.create({
        drname , 
        dremail , 
        drpassword, 
    })
    return res.redirect("drHome");
})


module.exports = router;