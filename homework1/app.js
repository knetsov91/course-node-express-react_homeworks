const express = require("express");
const routesUser = require("./routes/routesUser.js");
const routeRecipe = require("./routes/routesRecipe");
const bodyParser = require('body-parser')
const port = 4000;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use("/api/users", routesUser );
app.use("/", routeRecipe);
app.listen(port, () => {
    console.log("Listen")
});