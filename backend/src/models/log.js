const db=require("../db")

exports.addLog=async (org_id,user_id,action,meta)=>{
    const logInsertion="INSERT INTO logs (organisation_id,user_id,action,meta) VALUES (?,?,?,?)"
    await db.query(logInsertion,[org_id,user_id,action,JSON.stringify(meta)])
    return
}

exports.displayLogData=async (orgId,userId, action, startDate, endDate)=>{
    let query = "SELECT * FROM logs WHERE organisation_id=?";
    const params = [orgId];
    

    if (userId) {
        query += " AND user_id=?";
        params.push(userId);
    }

    if (action) {
        query += " AND action=?";
        params.push(action);
    }

    if (startDate && endDate) {
        query += " AND timestamp BETWEEN ? AND ?";
        params.push(startDate, endDate);
    }

    query += " ORDER BY timestamp DESC";

    const [logsResult] = await db.query(query, params);
    return logsResult;
}