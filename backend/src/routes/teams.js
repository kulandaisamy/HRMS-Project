const express=require("express")
const router=express.Router()
const {authMiddleware}=require("../middlewares/authMiddleware")
const {createTeams,listTeam,updateTeams,deleteTeam,deleteTeamAssignment,createTeamAssignment,displayLogs}=require("../controllers/teamController")

router.post("/teams",authMiddleware,createTeams)
router.get("/teams",authMiddleware,listTeam)
router.put("/teams/:id",authMiddleware,updateTeams)
router.delete("/teams/:id",authMiddleware,deleteTeam)
router.post("/teams/:teamId/assign",authMiddleware,createTeamAssignment)
router.delete("/teams/:teamId/unassign",authMiddleware,deleteTeamAssignment)
router.get("/logs",authMiddleware,displayLogs)


module.exports=router