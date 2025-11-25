const {addEmployee,showEmployees,updateEmployeeData,deleteEmployeeData,specificEmployeeData}= require("../models/employee.js")
const { addLog }=require("../models/log.js")
const {dashboard} = require("../models/user")

exports.createEmployees=async (request,response)=>{
    const {firstName,lastName,email,phone}=request.body
    const {orgId,userId}=request.user
     if (!firstName || !lastName || !email) {
        return response.status(400).send({ message: "Missing required fields" });
    }
    const result=await addEmployee(orgId,firstName,lastName,email,phone)
    const employeeId=result.insertId
    const action="employee_created"
    const meta={
        employee_id:employeeId,
        first_name:firstName
    }
    await addLog(orgId,userId,action,meta) 
    response.send({message:"Employee created successfully",employee_id:employeeId})
}

exports.listEmployee=async (request,response)=>{
    const {orgId}=request.user
    const employees=showEmployees(orgId)
    response.send({employees:employees})
}

exports.getDashboardData=async (request,response)=>{
    try{
        const {orgId,userId}=request.user;
        const result=await dashboard(orgId,userId)
        const getUserDetails=result.user
        const getOrgDetails=result.org
       response.send({
            userId: userId,
            email: getUserDetails[0].email,
            userName: getUserDetails[0].name,
            orgId: orgId,
            orgName: getOrgDetails[0].name
        });
    }
    catch(error){
          console.error("Fetch user info error:", error);
        response.status(500).send("Internal Server Error");
    }
    
}


exports.updateEmployee=async (request,response)=>{
    const {id}=request.params
    const {firstName,lastName,email,phone}=request.body
    const {orgId,userId}=request.user
    
    const oldDataResult=await updateEmployeeData(firstName,lastName,email,phone,orgId,id)
    const org_id=orgId
    const user_id=userId
    const action="employee_updated"
    const meta={
        employee_id:id,
        old_data:{
            first_name:oldDataResult[0].first_name,
            last_name:oldDataResult[0].last_name,
            email:oldDataResult[0].email,
            phone:oldDataResult[0].phone
        },
        new_data:{
            first_name:firstName,
            last_name:lastName,
            email:email,
            phone:phone
        }
    }
    await addLog(org_id,user_id,action,meta)
    response.send({message: "Employee updated successfully"})
}

exports.deleteEmployee=async (request,response)=>{
    const {id}=request.params
    const {orgId,userId}=request.user
    const oldQueryResult=await deleteEmployeeData(id,orgId)
    if (oldQueryResult.length === 0) {
        return response.status(404).send({ message: "Employee not found" });
    }
    const org_id=orgId
    const user_id=userId
    const action="employee_deleted"
    const meta={
        employee_id:id,
        old_data:{
             first_name:oldQueryResult[0].first_name,
            last_name:oldQueryResult[0].last_name,
            email:oldQueryResult[0].email,
            phone:oldQueryResult[0].phone
        }
    }
    await addLog(org_id,user_id,action,meta)
    response.send({
        message:"Employee deleted successfully"
    })
    
}

exports.specificEmployee=async (request,response)=>{
    const {id}=request.params
    const {orgId}=request.user
    const getQueryResult=await specificEmployeeData(id,orgId)
      if (getQueryResult.length === 0) {
        return response.status(404).send({ message: "Employee not found" });
    }
    response.send({
        employee:getQueryResult[0]
    })
}