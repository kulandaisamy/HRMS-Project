const express=require("express")
const router=express.Router()
const {createEmployees,listEmployee,updateEmployee,deleteEmployee,specificEmployee}=require("../controllers/employeeController") 
const {authMiddleware}=require("../middlewares/authMiddleware")


router.post("/",authMiddleware,createEmployees)
router.get("/",authMiddleware,listEmployee)
router.put("/:id",authMiddleware,updateEmployee)
router.delete("/:id",authMiddleware,deleteEmployee)
router.get("/:id",authMiddleware,specificEmployee)

module.exports=router
