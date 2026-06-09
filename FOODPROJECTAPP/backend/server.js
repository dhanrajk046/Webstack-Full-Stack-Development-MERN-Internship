// start the Server

// Will load env variable
// start the Server

const app = require("./app")

const dotenv = require("dotenv")

//load env variable
dotenv.config({path:"./config/config.env"})

//start Server

app.listen(process.env.PORT, ()=>{
    console.log(`Server started on PORT: ${process.env.PORT}`)
})