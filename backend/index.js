require("dotenv").config();
const express=require("express")
const app=express()
const mysql=require("mysql2")
const bcrypt=require("bcrypt")

const jwt = require('jsonwebtoken');
app.use(express.json())
const cors = require("cors");
const connection=mysql.createConnection({
host:process.env.DB_HOST,
user:process.env.DB_USER,
password:process.env.DB_PASS,
database:process.env.DB_NAME,
port:process.env.DB_PORT
})


let db

app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE"
}));

const initialize=async ()=>{
    try{
        connection.connect(err =>{
            if(err){
                console.log("DB connection error", err)
            }else{
                console.log("DB connected successfully")
            }
        })
        db=connection.promise()
        app.listen(process.env.PORT,()=>{
    console.log("Server Starts to run")
})
    }catch(e){
        console.log(e)
    }
}

initialize()

const generateJwtToken=async (payload)=>{
  
    return jwt.sign(payload,process.env.JWT_SECRET,{ expiresIn:'8h' })
  
}

const addLog=async (org_id,user_id,action,meta)=>{
    const logInsertion="INSERT INTO logs (organisation_id,user_id,action,meta) VALUES (?,?,?,?)"
    await db.query(logInsertion,[org_id,user_id,action,JSON.stringify(meta)])
}


//authentication.
const authMiddleware=(req,res,next)=>{
 
     const auth = req.headers.authorization || '';
     const token = auth.split(' ')[1];
     if (!token) return res.status(401).json({ message: 'No token' });
     const payload = jwt.verify(token, process.env.JWT_SECRET);
     req.user = { userId: payload.userId, orgId: payload.orgId };
  next();
}

//registration.
app.post("/api/auth/register",async (request,response)=>{
    try{
           const {orgName, adminName, email, password}=request.body
           console.log("Request body:", request.body);
            if (!orgName || !adminName || !email || !password) {
      return res.status(400).send("All fields are required");
    }
     // Check existing org/user
    const [existingOrg] = await db.query("SELECT * FROM organisations WHERE name=?", [orgName]);
    const [existingUser] = await db.query("SELECT * FROM users WHERE email=?", [email]);

    if (existingUser.length > 0) return res.status(400).send("Email already exists");
    if (existingOrg.length > 0) return res.status(400).send("Organisation already exists");

    
      
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
 
})

//login.
app.post("/api/auth/login",async (request,response)=>{

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

})

//create employee.
app.post("/api/employees",authMiddleware,async (request,response)=>{
    const {firstName,lastName,email,phone}=request.body
    const {orgId,userId}=request.user
     if (!firstName || !lastName || !email) {
        return response.status(400).send({ message: "Missing required fields" });
    }
    const insertEmployee="INSERT INTO employees (organisation_id,first_name,last_name,email,phone) VALUES (?,?,?,?,?)"
    const [employeeResult]=await db.query(insertEmployee,[orgId,firstName,lastName,email,phone])
    const employeeId=employeeResult.insertId
    const action="employee_created"
    const meta={
        employee_id:employeeId,
        first_name:firstName
    }
    await addLog(orgId,userId,action,meta) 
    response.send({message:"Employee created successfully",employee_id:employeeId})
})


//list employees.
app.get("/api/employees",authMiddleware,async (request,response)=>{
    const {orgId}=request.user
    const listEmployee="select * from employees where organisation_id =?"
    const [resultAllEmployee]=await db.query(listEmployee,[orgId])
    response.send({employees:resultAllEmployee})
})

//update employees.
app.put("/api/employees/:id",authMiddleware,async (request,response)=>{
    const {id}=request.params
    const {firstName,lastName,email,phone}=request.body
    const {orgId,userId}=request.user
    const oldDataQuery="select * from employees where id=? and organisation_id=?"
    const [oldDataResult]=await db.query(oldDataQuery,[id,orgId])
    const updateQuery="UPDATE employees SET first_name=?,last_name=?,email=?,phone=? where id=? and organisation_id=?"
    await db.query(updateQuery,[firstName,lastName,email,phone,id,orgId])
    
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
})


//delete employee.
app.delete("/api/employees/:id",authMiddleware,async (request,response)=>{
    const {id}=request.params
    const {orgId,userId}=request.user
    const oldQuery="select * from employees where id=? and organisation_id=?"
    const [oldQueryResult]=await db.query(oldQuery,[id,orgId])
        if (oldQueryResult.length === 0) {
        return response.status(404).send({ message: "Employee not found" });
    }
    const deleteQuery="DELETE FROM employees where id=? and organisation_id=?"
    await db.query(deleteQuery,[id,orgId])

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
    
})

//get specific employee.
app.get("/api/employees/:id",authMiddleware,async (request,response)=>{
    const {id}=request.params
    const {orgId}=request.user
    const getQuery=`
        SELECT 
            employees.id,employees.organisation_id, employees.first_name, employees.last_name, employees.email, employees.phone, employees.created_at,
            teams.id as team_id,
            teams.name
        FROM employees
        LEFT JOIN teams ON employees.organisation_id = teams.organisation_id
        WHERE employees.id = ? AND employees.organisation_id = ?
    `;
    const [getQueryResult]=await db.query(getQuery,[id,orgId])
      if (getQueryResult.length === 0) {
        return response.status(404).send({ message: "Employee not found" });
    }
    response.send({
        employee:getQueryResult[0]
    })
})

//create team.
app.post("/api/teams",authMiddleware,async (request,response)=>{
    const {orgId,userId}=request.user
    const {name,description}=request.body
    if (!name || name.trim() === "") {
    return response.status(400).send({ message: "Team name is required" });
}
 const checkDuplicateQuery = "SELECT * FROM teams WHERE organisation_id = ? AND name = ?";
    const [existingTeam] = await db.query(checkDuplicateQuery, [orgId, name]);
    
    if (existingTeam.length > 0) {
        return response.status(400).send({ message: "Team name already exists" });
    }
    const insertTeam="INSERT INTO teams (organisation_id,name,description) VALUES (?,?,?)"
    const [insertTeamResult]=await db.query(insertTeam,[orgId,name,description])
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
})

//get list team.
app.get("/api/teams",authMiddleware,async (request,response)=>{
    const {orgId}=request.user
    const getTeamQuery="SELECT * FROM teams where organisation_id=?"
    const [getTeamResult]=await db.query(getTeamQuery,[orgId])
    response.send({
        teams:getTeamResult
    })
})

//updating team
app.put("/api/teams/:id",authMiddleware,async (request,response)=>{
    const {orgId,userId}=request.user
    const {id}=request.params
    const {name,description } = request.body;
    const oldQuery="select * from teams where id=? and organisation_id=?"
    const [oldQueryResult]=await db.query(oldQuery,[id,orgId])
        if (oldQueryResult.length === 0) {
        return response.status(404).send({ message: "Team not found" });
    }

    const updateQuery = "UPDATE teams SET name=?, description=? WHERE id=? AND organisation_id=?";
    await db.query(updateQuery, [name, description, id, orgId]);

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
})

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

//team assignment.
app.post("/api/teams/:teamId/assign",authMiddleware,async (request,response)=>{
    const {orgId,userId}=request.user
    const {teamId}=request.params
    const {employeeId}=request.body
    
       if (!employeeId) {
      return response.status(400).send({ message: "No employee ID provided" });
    }
    const insertIdQuery="INSERT INTO employee_teams (employee_id,team_id) values (?,?)"
   
        await db.query(insertIdQuery,[employeeId,teamId])
    
    const action="assigned_employee_to_team"
    const meta={
        employee_id:employeeId,
        team_id:teamId
    }
    await addLog(orgId,userId,action,meta)
      response.send({
      message: "Employees assigned to team successfully",
      assignedEmployee: employeeId,
    });
})

//delete team assignment
app.delete("/api/teams/:teamId/unassign",authMiddleware,async (request,response)=>{
    const {teamId}=request.params
    const {orgId,userId}=request.user
    const {employeeIds,employeeId}=request.body
    const ids = employeeIds || (employeeId ? [employeeId] : []);
     if (ids.length === 0) {
      return res.status(400).send({ message: "No employee IDs provided" });
    }
    const deleteQuery = "DELETE FROM employee_teams WHERE team_id=? AND employee_id=?";
     for (const empId of ids) {
    await db.query(deleteQuery, [teamId, empId]);
  }
  const action = "unassigned_employee_from_team";
  const meta = {
    employeeId: ids,
    teamId,
  };
    await addLog(orgId, userId, action, meta);

  response.send({
    message: "Employees unassigned from team successfully",
    unassignedEmployees: ids,
  });
})

//display logs.
app.get("/api/logs", authMiddleware, async (request, response) => {
    const { orgId } = request.user;
    const { userId, action, startDate, endDate } = request.query;

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
    response.send({ logs: logsResult });
});

// logout
app.post("/api/auth/logout", authMiddleware, async (request, response) => {
    const { orgId, userId } = request.user;

    const action = "user_logout";
    const meta = { user_id: userId,org_id:orgId };

    await addLog(orgId, userId, action, meta);

    response.send({ message: "User logged out successfully" });
});

//get profile details.
app.get("/api/auth/me",authMiddleware,async (request,response)=>{
    try{
        const {orgId,userId}=request.user;
    const [getOrgDetails]=await db.query("select * from organisations where id=?",[orgId])
    const [getUserDetails]=await db.query("select * from users where organisation_id=? and id=?",[orgId,userId])
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
    
})
module.exports=app