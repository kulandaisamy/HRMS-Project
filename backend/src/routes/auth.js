const express=require("express")
const router=express.Router()
const {register,login}=require("../controllers/authController")
const {authMiddleware}=require("../middlewares/authMiddleware")
const {getDashboardData}=require("../controllers/employeeController")

router.post("/register",register)
router.post("/login",login)
router.get("/me",authMiddleware,getDashboardData)

module.exports=router