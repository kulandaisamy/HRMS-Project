const db=require("../db")

exports.addLog=async (org_id,user_id,action,meta)=>{
    const logInsertion="INSERT INTO logs (organisation_id,user_id,action,meta) VALUES (?,?,?,?)"
    await db.query(logInsertion,[org_id,user_id,action,JSON.stringify(meta)])
}