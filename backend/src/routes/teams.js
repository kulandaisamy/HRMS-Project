const express=require("express")
const router=express.Router()
const {authMiddleware}=require("../middlewares/authMiddleware")
const {createTeams,listTeam,oldQueryResult}=require("../controllers/teamController")

router.post("/",authMiddleware,createTeams)
router.get("/",authMiddleware,listTeam)
router.put(":id",authMiddleware,oldQueryResult)

module.exports=router