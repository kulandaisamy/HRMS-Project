const db=require("../db")
const bcrypt=require("bcrypt")
const jwt = require('jsonwebtoken');
const {addLog}=require("../models/log")
const {createOrganisation,checkOrganisation}=require("../models/organisation")
const {userLogin}=require("../models/user")

const generateJwtToken=async (payload)=>{
    return jwt.sign(payload,process.env.JWT_SECRET,{ expiresIn:'8h' })
}

exports.register=async (request,response)=>{
    try{
           const {orgName, adminName, email, password}=request.body
           console.log("Request body:", request.body);

            if (!orgName || !adminName || !email || !password) {
      return response.status(400).send("All fields are required");
    }
   const checkResult=await checkOrganisation(orgName,email)
    const existingUser=checkResult.existingUser
    const existingOrg=checkResult.existingOrg
   
    if (existingUser.length > 0) return response.status(400).send("Email already exists");
    if (existingOrg.length > 0) return response.status(400).send("Organisation already exists");
     const result=await createOrganisation(orgName, adminName, email, password)
    
    const userInsertion=result.userInsertion
    const org_id=result.org_id
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
const result=await userLogin(orgName, email)
const orgResult=result.orgResult
const emailResult=result.emailResult
if(orgResult.length===0){
    response.status(400).send("No such Organisation")
    return
}


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

exports.logout=async (request, response) => {
    const { orgId, userId } = request.user;

    const action = "user_logout";
    const meta = { user_id: userId,org_id:orgId };

    await addLog(orgId, userId, action, meta);

    response.send({ message: "User logged out successfully" });
};
