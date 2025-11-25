const db=require("../db.js")

exports.dashboard=async (orgId,userId)=>{
        const [getOrgDetails]=await db.query("select * from organisations where id=?",[orgId])
        const [getUserDetails]=await db.query("select * from users where organisation_id=? and id=?",[orgId,userId])
        return {
            org:getOrgDetails,
            user:getUserDetails
        }
}