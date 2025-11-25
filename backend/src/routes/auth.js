const express=require("express")
const router=express.Router()
const {register,login,logout}=require("../controllers/authController")
const {authMiddleware}=require("../middlewares/authMiddleware")
const {getDashboardData}=require("../controllers/employeeController")

router.post("/register",register)
router.post("/login",login)
router.get("/me",authMiddleware,getDashboardData)
router.post("/logout",authMiddleware,logout)

module.exports=router