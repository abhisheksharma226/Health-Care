const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const cookieParser = require("cookie-parser");


const app = express();
const PORT = 3000;


const patientRoute = require("./routes/patient");
const doctorRoute = require("./routes/doctor");


//DataBase Connection
mongoose.connect('mongodb://127.0.0.1:27017/HealthCare').then((e) => console.log("MongoDB Connected"));

//for Css
app.use(express.static(path.join(__dirname, "public")));


//for Ejs
app.set("view engine" , "ejs");
app.set("views" , path.resolve("./views"));


//MiddleWares
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));


app.get("/" , (req , res) => {
    res.render("home");
})


app.use("/patient" , patientRoute);
app.use("/doctor" , doctorRoute);




app.listen(PORT  , ()=> {
    console.log(`Server Started at ${PORT}`);
})