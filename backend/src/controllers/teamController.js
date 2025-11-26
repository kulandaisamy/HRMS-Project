const {addLog}=require("../models/log")
const {createTeamsData,listTeamData,updateTeamsData,deleteTeamData,checkDuplicateTeam}=require("../models/team")
const {createTeamAssignmentData,deleteTeamAssignmentData}=require("../models/employeeTeam")
const {displayLogData}=require("../models/log")

exports.createTeams=async (request,response)=>{
    const {orgId,userId}=request.user
    const {name,description}=request.body
    if (!name || name.trim() === "") {
    return response.status(400).send({ message: "Team name is required" });
}
       
        const existingTeam=await checkDuplicateTeam(orgId,name)
       
       
       if (existingTeam.length > 0) {
            return response.status(400).send({ message: "Team name already exists" });
        }
         const result=await createTeamsData(orgId, name,description)
         const insertTeamResult=result.insertTeamResult
    const action="team_created"
    const org_id=orgId
    const user_id=userId
    const meta={
        team_id:insertTeamResult.insertId,
        name,
        description
    }
    await addLog(org_id,user_id,action,meta)
    response.send({ message: "Team created successfully"})
}

exports.listTeam=async (request,response)=>{
    const {orgId}=request.user
    const getTeamResult=await listTeamData(orgId)
    response.send({
        teams:getTeamResult
    })
}

exports.updateTeams=async (request,response)=>{
    const {orgId,userId}=request.user
    const {id}=request.params
    const {name,description } = request.body;
    
    const oldQueryResult=await updateTeamsData(name, description, id, orgId)
     if (oldQueryResult.length === 0) {
        return response.status(404).send({ message: "Team not found" });
    }
       const action = "team_updated";
    const meta = {
        team_id: id,
        old_data: {
            name: oldQueryResult[0].name,
            description: oldQueryResult[0].description
        },
        new_data: {
            name,
            description
        }
    };
    await addLog(orgId, userId, action, meta);
    response.send({ message: "Team updated successfully" });
}


exports.deleteTeam=async (request,response)=>{
    const {id}=request.params
    const {orgId,userId}=request.user
    const oldQueryResult=await deleteTeamData(id, orgId)
     if (oldQueryResult.length === 0) {
        return response.status(404).send({ message: "Team not found" });
    }
    const action="team_deleted"
    const meta={
        team_id: id,
        old_data: {
            name: oldQueryResult[0].name,
            description: oldQueryResult[0].description
        },
      
    }
    await addLog(orgId,userId,action,meta)
    response.send({
        message:"Team deleted successfully"
    })
}

exports.deleteTeamAssignment=async (request,response)=>{
    const {teamId}=request.params
    const {orgId,userId}=request.user
    const {employeeId}=request.body
    
     if (!employeeId) {
      return res.status(400).send({ message: "No employee IDs provided" });
    }
   await deleteTeamAssignmentData(teamId,employeeId)
  
  const action = "unassigned_employee_from_team";
  const meta = {
    employeeId,
    teamId,
  };
    await addLog(orgId, userId, action, meta);

  response.send({
    message: "Employees unassigned from team successfully",
    unassignedEmployees:employeeId,
  });
}


exports.createTeamAssignment=async (request,response)=>{
    const {orgId,userId}=request.user
    const {teamId}=request.params
    const {employeeId}=request.body
    
       if (!employeeId) {
      return response.status(400).send({ message: "No employee ID provided" });
    }
  
    await createTeamAssignmentData(employeeId,teamId)
    const action="assigned_employee_to_team"
    const meta={
        employee_id:employeeId,
        team_id:teamId
    }
    await addLog(orgId,userId,action,meta)
      response.send({
      message: "Employees assigned to team successfully",
      assignedEmployee: employeeId,
    });
}


exports.displayLogs=async (request, response) => {
    const { orgId } = request.user;
    const { userId, action, startDate, endDate } = request.query;

    const logsResult = await displayLogData(orgId,userId, action, startDate, endDate);
    response.send({ logs: logsResult });
};

