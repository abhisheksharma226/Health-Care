const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

//for Css
app.use(express.static(path.join(__dirname, "public")));

//for Ejs
app.set("view engine" , "ejs");
app.set("views" , path.resolve("./views"));


app.get("/" , (req , res) => {
    res.render("home");
})

app.listen(PORT  , ()=> {
    console.log(`Server Started at ${PORT}`);
})