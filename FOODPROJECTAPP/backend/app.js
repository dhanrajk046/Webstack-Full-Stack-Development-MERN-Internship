//configure express and Middleware

//import packages
//create express app
//             Client => app => route => response
//configure middleware
//middleware is the function that runs between the request and response
//Req => Middleware => Route => res
//export the app

const express = require("express");
const app = express()
// const express = require("express");
// const app = express();

const cors = require("cors")

app.use(cors());
app.use(express.json())

module.exports=app



