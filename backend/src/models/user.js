const db=require("../db.js")

exports.dashboard=async (orgId,userId)=>{
        const [getOrgDetails]=await db.query("select * from organisations where id=?",[orgId])
        const [getUserDetails]=await db.query("select * from users where organisation_id=? and id=?",[orgId,userId])
        return {
            org:getOrgDetails,
            user:getUserDetails
        }
}

exports.userLogin=async (orgName, email)=>{
    const checkOrg="select * from organisations where name=?"
const [orgResult]=await db.query(checkOrg,[orgName])
const checkEmail="select * from users where email=? and organisation_id=?"
const [emailResult]=await db.query(checkEmail,[email,orgResult[0].id])
return {
    orgResult,emailResult
}
}