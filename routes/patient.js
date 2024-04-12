const { Router } = require("express");
const patient = require("../models/patient");

const router = Router();

router.get("/login" , (req , res) => {
    return res.render("login"); 
})

router.get("/signup" , (req , res) => {
    return res.render("signup");
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
    return res.redirect("patientHome");
})

module.exports = router;