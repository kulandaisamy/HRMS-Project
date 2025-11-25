const db= require("../db")

exports.addEmployee=async (orgId,firstName,lastName,email,phone)=>{
    const insertEmployee="INSERT INTO employees (organisation_id,first_name,last_name,email,phone) VALUES (?,?,?,?,?)"
    const [employeeResult]=await db.query(insertEmployee,[orgId,firstName,lastName,email,phone])
    return employeeResult
}

exports.showEmployees=async (orgId)=>{
    const listEmployee="select * from employees where organisation_id =?"
    const [resultAllEmployee]=await db.query(listEmployee,[orgId])
    return resultAllEmployee
}

exports.updateEmployeeData=async (firstName,lastName,email,phone,orgId,id)=>{
    const oldDataQuery="select * from employees where id=? and organisation_id=?"
    const [oldDataResult]=await db.query(oldDataQuery,[id,orgId])
    const updateQuery="UPDATE employees SET first_name=?,last_name=?,email=?,phone=? where id=? and organisation_id=?"
    await db.query(updateQuery,[firstName,lastName,email,phone,id,orgId])
    return oldDataResult;
}

exports.deleteEmployeeData=async (id,orgId)=>{
    const oldQuery="select * from employees where id=? and organisation_id=?"
    const [oldQueryResult]=await db.query(oldQuery,[id,orgId])
       
    const deleteQuery="DELETE FROM employees where id=? and organisation_id=?"
    await db.query(deleteQuery,[id,orgId])
    return oldQueryResult
}

exports.specificEmployeeData=async ()=>{
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
    return getQueryResult
}