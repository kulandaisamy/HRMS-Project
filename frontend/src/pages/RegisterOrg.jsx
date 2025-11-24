import {Component} from "react"

import api from "../services/api.js"
import "../StyleComponent/register.css"
import { withRouter } from "../Navigator/withRouter.js"

class RegisterOrg extends Component{
    state={
        orgName:"",
        adminName:"",
        email:"",
        password:"",
        error:""
    }
    getOrgName=(e)=>{
        this.setState({
            orgName:e.target.value
        })
    }
    getAdminName=(e)=>{
        this.setState({
            adminName:e.target.value
        })
    }
    getEmail=(e)=>{
        this.setState({
            email:e.target.value
        })
    }
    getPassword=(e)=>{
        this.setState({
            password:e.target.value
        })
    }
    sendData=async (e)=>{
        e.preventDefault()
        console.log(this.props)
        const {navigate}=this.props
        const {orgName,adminName,email,password}=this.state
        try{
            const response=await api.post("/auth/register",{
                orgName,adminName,email,password
            })
           
            localStorage.setItem("token",response.data.jwtToken)
         navigate("/",{replace:true})
        }
        catch(error){
            if (error.response) {
                console.log(error)
            
            const status = error.response.status;
            const message = error.response.data;

            if (status === 400 && message === "Organisation already exist") {
                this.setState({
                    error:"Organisation already exists! Please choose another name."
                });
            } else if (status === 400 && message === "Password required") {
                this.setState({
                    error:"Password is required."
                });
               
            } else {
                this.setState({
                    error:message
                });
               
            }
        } else {
            this.setState({
                    error:"Network error. Please try again later."
                });
            
        }
        }
         this.setState({
                  orgName:"",
                  adminName:"",
                  email:"",
                  password:"",
            })

    }
    render(){
        const {error, orgName,adminName,email,password}=this.state
        return (
            <div className="register-container">
                <div className="register-org-detail">
                     <div className="title-block">
                        <h1>HR Management Platform</h1>
                        <hr className="horizontal-container"/>
                     </div>
                </div>
                <div className="register-form-container">
                    <h1 className="org-title">Welcome to HRMS</h1>
                    <p className="registration-txt">Register your account</p>
                    <form className="register-form" onSubmit={this.sendData}>
                        <label className="label-org-name" htmlFor="orgName">Organisation Name</label>
                        <input className="text-box" type="text" id="orgName" onChange={this.getOrgName} value={orgName}/>
                        <label className="label-org-name" htmlFor="adminName">Admin Name</label>
                        <input type="text" className="text-box" id="adminName" onChange={this.getAdminName} value={adminName}/>
                        <label className="label-org-name" htmlFor="email">Email</label>
                        <input type="text" id="email" className="text-box" onChange={this.getEmail} value={email}/>
                        <label className="label-org-name" htmlFor="password">Password</label>
                        <input type="password" id="password" className="text-box" onChange={this.getPassword} value={password}/>
                        <button type="submit" className="btn btn-primary mt-4 w-50">Register</button>
                        {error && <p className="error-msg">{error}</p>}
                    </form>
                </div>
                
            </div>
            )
    }
}

export default withRouter(RegisterOrg)