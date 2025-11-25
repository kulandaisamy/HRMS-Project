const addLog=require("../models/log")
const {createTeamsData,listTeamData,updateTeamsData}=require("../models/team")

exports.createTeams=async (request,response)=>{
    const {orgId,userId}=request.user
    const {name,description}=request.body
    if (!name || name.trim() === "") {
    return response.status(400).send({ message: "Team name is required" });
}
        const result=await createTeamsData(orgId, name,description)
        const existingTeam=result.existingTeam
        const insertTeamResult=result.insertTeamResult
       if (existingTeam.length > 0) {
            return response.status(400).send({ message: "Team name already exists" });
        }
    const action="team_created"
    const org_id=orgId
    const user_id=userId
    const meta={
        team_id:insertTeamResult.insertId,
        name,
        description
    }
    addLog(org_id,user_id,action,meta)
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

//deleting team.
app.delete("/api/teams/:id",authMiddleware,async (request,response)=>{
    const {id}=request.params
    const {orgId,userId}=request.user
    const oldQuery="select * from teams where id=? and organisation_id=?"
    const [oldQueryResult]=await db.query(oldQuery,[id,orgId])
        if (oldQueryResult.length === 0) {
        return response.status(404).send({ message: "Team not found" });
    }
    const deleteQuery="DELETE FROM teams where id=? and organisation_id=?"
    await db.query(deleteQuery,[id,orgId])


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
})