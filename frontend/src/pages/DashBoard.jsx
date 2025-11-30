import {Component} from "react"
import api from "../services/api.js"
import "../StyleComponent/dashboard.css"
import { withRouter } from "../Navigator/withRouter.js"
import Header from "../components/Header.jsx"

class DashBoard extends Component{
    state={
        orgId:"",
        userId:"",
        orgName:"",
        userName:"",
        email:""
    }
    getData=async ()=>{
        try{
             const token=localStorage.getItem("token")
             if(!token){
                this.setState({
                    error:"You are not logged in!"
                })
                return
             }
             const response=await api.get("/auth/me")
             
             const {email,orgId,userName,userId,orgName}=response.data
             this.setState({
                orgId,
        userId,
        orgName,
        userName,
        email
             })
        }
        catch(e){
            console.log(e)
        }
       
    }
    componentDidMount(){
       this.getData()
    }
    createEmployee=()=>{
        const {navigate}=this.props
        navigate("/employee-form")
    }
    listEmployee=()=>{
        const {navigate}=this.props
        navigate("/employee-list")
    }
    createTeams=()=>{
        const {navigate}=this.props
        navigate("/team-form")
    }
    displayLogs=()=>{
        const {navigate}=this.props
        navigate("/display-log")

    }
    listTeams=()=>{
        const {navigate}=this.props
        navigate("/teams")
    }
  
    render(){
        const {orgId,userId,orgName,userName,email}=this.state
        return (<div className="dashboard-container">
            <Header/>
            <div className="display-profile">
                <div className="profilr-container">
                    <img src="https://res.cloudinary.com/dhlbduxoj/image/upload/v1763874412/Group_31_pu621q.png" className="profilr-pic" alt="profile-picture"/>
                    <div className="align-profile-details">
                        <h1>{userName.toUpperCase()}</h1>
                        <p className="organization-name-text">Organisation Name: {orgName.toUpperCase()}</p>
                        <p>Email: {email}</p>
                    </div>
                </div>
                <div className="id-container">
                    
                    <p>User Id: {userId}</p>
                    <p>Organisation Id: {orgId}</p>
                </div>
             
            </div>
            <div className="tab-container">
                <button className="create-button-employee" type="button" onClick={this.createEmployee}>Create Employees</button>
                <button className="create-button-employee" type="button" onClick={this.listEmployee}>List Employees</button>
                <button className="create-button-employee" type="button" onClick={this.createTeams}>Create Teams</button>
                <button className="create-button-employee" type="button" onClick={this.displayLogs}>Display Logs</button>
                <button className="create-button-employee" type="button" onClick={this.listTeams}>List Team</button>
            </div>
            </div>)
    }
}

export default withRouter(DashBoard)