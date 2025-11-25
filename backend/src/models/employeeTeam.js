 const db=require("../db")

 exports.deleteTeamAssignmentData=async (teamId,employeeId)=>{
     const deleteQuery = "DELETE FROM employee_teams WHERE team_id=? AND employee_id=?";
  
    await db.query(deleteQuery, [teamId, employeeId]);
    return
 }

 exports.createTeamAssignmentData=async (employeeId,teamId)=>{
       const insertIdQuery="INSERT INTO employee_teams (employee_id,team_id) values (?,?)"
   
        await db.query(insertIdQuery,[employeeId,teamId])
        return
 }

 
