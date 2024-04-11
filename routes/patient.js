const { Router } = require("express");
const patient = require("../models/patient");
const Patient = require("../models/patient");

const router = Router();

router.get("/login" , (req , res) => {
    return res.render("login"); 
})

router.get("/signup" , (req , res) => {
    return res.render("signup");
})

router.post("/login" , async(req , res) => {
    const { email , password } = req.body;

    try {
        const token = await Patient.matchPasswordAndGenerateToken(email , password);

    return res.cookie("token" , token).redirect("/"); 
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
    return res.redirect("/");
})

module.exports = router;