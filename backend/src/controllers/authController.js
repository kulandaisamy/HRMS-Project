const db=require("../db")
const bcrypt=require("bcrypt")
const jwt = require('jsonwebtoken');
const {addLog}=require("../models/log")

const generateJwtToken=async (payload)=>{
    return jwt.sign(payload,process.env.JWT_SECRET,{ expiresIn:'8h' })
}

exports.register=async (request,response)=>{
    try{
           const {orgName, adminName, email, password}=request.body
           console.log("Request body:", request.body);
            if (!orgName || !adminName || !email || !password) {
      return res.status(400).send("All fields are required");
    }
     
    const [existingOrg] = await db.query("SELECT * FROM organisations WHERE name=?", [orgName]);
    const [existingUser] = await db.query("SELECT * FROM users WHERE email=?", [email]);

    if (existingUser.length > 0) return response.status(400).send("Email already exists");
    if (existingOrg.length > 0) return response.status(400).send("Organisation already exists");

    
      
        const hash =await bcrypt.hash(password,10)
        
        const [orgInsertResult]=await db.query("INSERT INTO organisations (name) values (?)",[orgName])
        const org_id=orgInsertResult.insertId
          
       
        const [userInsertion]=await db.query(`INSERT INTO users (organisation_id,email,password_hash,name) values (?,?,?,?)`,[org_id,email,hash,adminName])
        
console.log("Org insert result:", orgInsertResult);
console.log("User insert result:", userInsertion);

        const user_id=userInsertion.insertId
        const action="org_register"
        const meta={
            org_name:orgName,
            admin_name:adminName,
            email
        }
        const payload={
            userId:user_id,
            orgId:org_id,
        }
        const jwtToken=await generateJwtToken(payload)
        await addLog(org_id,user_id,action,meta)
        response.send({jwtToken})
          

    }catch(error){
        console.error("Register Error:", error);
        return response.status(500).send("Internal Server Error");
    }
 
}

exports.login=async (request,response)=>{

const {orgName, email, password}=request.body
const checkOrg="select * from organisations where name=?"
const [orgResult]=await db.query(checkOrg,[orgName])
if(orgResult.length===0){
    response.status(400).send("No such Organisation")
    return
}
const checkEmail="select * from users where email=? and organisation_id=?"
const [emailResult]=await db.query(checkEmail,[email,orgResult[0].id])

if(emailResult.length===0){
    response.status(400).send("Invalid Email")
    return
}
else{
    const org_id=orgResult[0].id
const user_id=emailResult[0].id
const action="user_login"
const meta={
    org_name:orgName,
    email
}
    const isPassword=await bcrypt.compare(password,emailResult[0].password_hash)
    if(isPassword){
        await addLog(org_id,user_id,action,meta) 
        const payload={
            userId:emailResult[0].id,
            orgId:orgResult[0].id
        }
        const jwtToken=await generateJwtToken(payload)
        response.send({jwtToken})
    }else{
        response.status(400).send("Invalid password")
        return
    }
}

}
