const db= require("../db")
const bcrypt=require("bcrypt")

exports.createOrganisation=async (orgName, adminName, email, password)=>{
    const [existingOrg] = await db.query("SELECT * FROM organisations WHERE name=?", [orgName]);
    const [existingUser] = await db.query("SELECT * FROM users WHERE email=?", [email]);
    const [orgInsertResult]=await db.query("INSERT INTO organisations (name) values (?)",[orgName])
    const hash =await bcrypt.hash(password,10)
     const org_id=orgInsertResult.insertId
    const [userInsertion]=await db.query(`INSERT INTO users (organisation_id,email,password_hash,name) values (?,?,?,?)`,[org_id,email,hash,adminName])
    return {
        existingOrg,
        existingUser,
        orgInsertResult,
        userInsertion,
        org_id
    }
}