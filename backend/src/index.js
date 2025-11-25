require("dotenv").config();
const express=require("express")
const app=express()
const db=require("./db")
app.use(express.json())
const cors = require("cors");
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));
const authRouter=require("./routes/auth")
const empRouter=require("./routes/employees")
const teamRouter=require("./controllers/teamController")
app.use("/api/auth",authRouter)
app.use("/api/employees",empRouter)

app.use("/api",teamRouter)


const initialize=()=>{
    try{
        console.log("DB connected successfully")
        app.listen(process.env.PORT,()=>{
        console.log("Server Starts to run",process.env.PORT)
})
    }catch(e){
        console.log("DB connection error",e)
    }
}

initialize()

module.exports=app