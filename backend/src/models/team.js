const db=require("../db")

exports.createTeamsData=async (orgId,name,description)=>{

        const insertTeam="INSERT INTO teams (organisation_id,name,description) VALUES (?,?,?)"
        const [insertTeamResult]=await db.query(insertTeam,[orgId,name,description])
        return {
            insertTeamResult
        }
}

exports.checkDuplicateTeam=async (orgId,name)=>{
     const checkDuplicateQuery = "SELECT * FROM teams WHERE organisation_id = ? AND name = ?";
        const [existingTeam] = await db.query(checkDuplicateQuery, [orgId, name]);
        return existingTeam;
}

exports.listTeamData=async (orgId)=>{
    const getTeamQuery="SELECT * FROM teams where organisation_id=?"
    const [getTeamResult]=await db.query(getTeamQuery,[orgId])
    return getTeamResult
}

exports.updateTeamsData=async (name, description, id, orgId)=>{
    const oldQuery="select * from teams where id=? and organisation_id=?"
    const [oldQueryResult]=await db.query(oldQuery,[id,orgId])
       

    const updateQuery = "UPDATE teams SET name=?, description=? WHERE id=? AND organisation_id=?";
    await db.query(updateQuery, [name, description, id, orgId]);
    return oldQueryResult
}

exports.deleteTeamData=async (id, orgId)=>{
    const oldQuery="select * from teams where id=? and organisation_id=?"
    const [oldQueryResult]=await db.query(oldQuery,[id,orgId])
       
    const deleteQuery="DELETE FROM teams where id=? and organisation_id=?"
    await db.query(deleteQuery,[id,orgId])
    return oldQueryResult
}
