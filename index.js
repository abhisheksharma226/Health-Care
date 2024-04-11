const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

const patientRoute = require("./routes/patient");
const doctorRoute = require("./routes/doctor");


//for Css
app.use(express.static(path.join(__dirname, "public")));

//for Ejs
app.set("view engine" , "ejs");
app.set("views" , path.resolve("./views"));


app.get("/" , (req , res) => {
    res.render("home");
})


app.use("/patient" , patientRoute);
app.use("/doctor" , doctorRoute);



app.listen(PORT  , ()=> {
    console.log(`Server Started at ${PORT}`);
})