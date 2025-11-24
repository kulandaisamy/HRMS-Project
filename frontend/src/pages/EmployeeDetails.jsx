import { Component } from "react";

import api from "../services/api";
import { withRouter } from "../Navigator/withRouter";
import "../StyleComponent/employeeDetails.css"

class EmployeeDetails extends Component{
    state={
        email:"",
        firstName:"",
        lastName:"",
        phone:"",
        teamName:"",
        isEdit:false,teamId:"",
        teamList:[],
        message:"",
        deleteMessage:""
    }
    getEmployeeDetails=async (id)=>{
    
        const response=await api.get(`/employees/${id}`)
        console.log(response.data.employee)
        const {email,first_name,last_name,phone,name,team_id}=response.data.employee
        this.setState({
            email,
            firstName:first_name,
            lastName:last_name,
            phone,
            teamName:name,
            teamId:team_id
        })
    }
    editProfile=()=>{
        this.setState({
            isEdit:true
        })
    }
   

    componentDidMount(){
             const {params}=this.props
        const {id}=params
        this.getEmployeeDetails(id)
       
       
    }
    changeFirstName=(e)=>{
        this.setState({
            firstName:e.target.value
        })
    }
    changeLasttName=(e)=>{
         this.setState({
            lastName:e.target.value
        }) 
    }
    changeEmail=(e)=>{
            this.setState({
            email:e.target.value
        })  
    }

    changePhone=(e)=>{
           this.setState({
            phone:e.target.value
        })  
    }

    changeTeam=(e)=>{
        this.setState({
            teamId:e.target.value
        })
    }
    updateEmployee=async (e)=>{
        e.preventDefault()
         const {params}=this.props
        const {id}=params
        const {firstName,lastName,email,phone}=this.state
        const response=await api.put(`/employees/${id}`,{firstName,lastName,email,phone})
        this.setState({
            message:response.data.message,
            isEdit:false
        })
    }

    deleteEmployee=async (e)=>{
        e.preventDefault()
        const {params}=this.props
        const {id}=params
        const response=await api.delete(`/employees/${id}`)
        this.setState({
            deleteMessage:response.data.message
        },this.homePage)
      
    }

    homePage=()=>{
        const {navigate}=this.props
        navigate("/")
    }

    render(){
        const {firstName,lastName,email,phone,teamName,isEdit,message,deleteMessage}=this.state
        return (
        <div className="employee-details-container">
            <button className="btn btn-primary mb-4" onClick={this.homePage}>Home Page</button>
            <div className="employee-maintain">
               <div className="img-container">
                <div className="profile-details">
                    <img src="https://res.cloudinary.com/dhlbduxoj/image/upload/v1763874412/Group_31_pu621q.png" className="profile-pic" alt="profile pic"/>
                    {isEdit ? 
                    <form className="employee-details" onSubmit={this.updateEmployee}>
                        <p>First Name: <input className="employee-text-box" value={firstName} type="text" onChange={this.changeFirstName}/> </p>
                        <p>Last Name: <input value={lastName} type="text" className="employee-text-box" onChange={this.changeLasttName}/></p>
                        <p>Email: <input value={email} type="email" className="employee-text-box" onChange={this.changeEmail}/></p>
                        <p>Phone: <input value={phone} type="text" className="employee-text-box" onChange={this.changePhone}/></p>
                         <p>Team: {teamName}</p>
                        <button className="btn btn-success update-btn" type="submit">Update</button>
                    </form> :    
                    <form className="employee-details" onSubmit={this.deleteEmployee}>
                        <p>First Name:{firstName}</p>
                        <p>Last Name: {lastName}</p>
                        <p>Email: {email}</p>
                        <p>Phone: {phone}</p>
                        <p>Team: {teamName}</p>
                        <button type="submit" className="btn btn-danger delete-btn">Delete</button>
                    </form>
                    }
                 
                </div>
                    
                    <div>
                        <button type="button" className="edit-custom-btn" onClick={this.editProfile}>
                             <img src="https://res.cloudinary.com/dhlbduxoj/image/upload/v1763928735/Vector_nj2l3p.png" className="edit-btn" alt="edit-btn"/>
                        </button>
                         <p className="edit-text">Edit</p>
                    </div>
                </div> 
            </div>
            {deleteMessage && <p className="error-msg">{deleteMessage}</p>}
            {message && <p className="text-success">{message}</p>}
         
        </div>)
    }
}

export default withRouter(EmployeeDetails)