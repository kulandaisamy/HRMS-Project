import {Component} from "react"
import api from "../services/api.js"
import { withRouter } from "../Navigator/withRouter.js"
import "../StyleComponent/employeeform.css"

class EmployeeForm extends Component{
    state={
        firstName:"",
        lastName:"",
        email:"",
        phone:"",
        successMessage:"",
        error:"",
        listTeam:[],
        assignTeam:"",
        teamId:"",
        assignTeamError:""
    }
    getFirstName=(e)=>{
        this.setState({
            firstName:e.target.value
        })
    }
    getLastName=(e)=>{
        this.setState({
            lastName:e.target.value
        })
    }
    getEmail=(e)=>{
        this.setState({
            email:e.target.value
        })
    }
    getPhone=(e)=>{
        this.setState({
            phone:e.target.value
        })
    }
    submitEmployeeForm=async (e)=>{
        e.preventDefault()
        const {firstName,lastName,email,phone,teamId}=this.state
        this.setState({
            successMessage:"",
        error:"",
        assignTeam:""
        })
        try{
             const token=localStorage.getItem("token")
             if(!token){
                this.setState({
                    error:"You are not logged in!"
                })
                return
             }
             const response=await api.post("/employees",{
                firstName,lastName,email,phone
            })
            const employeeId=response.data.employee_id
            const assignTeamResponse=await api.post(`/teams/${teamId}/assign`,{employeeId})
            
            this.setState({
                successMessage:response.data.message,
                assignTeam:assignTeamResponse.data.message,
                firstName:"",
                lastName:"",
                email:"",
                phone:"",
                assignTeamError:""
            })
        }catch(e){
            if (!teamId) {
    this.setState({
        assignTeamError: "Please select a team!"
    });
    return;
}
             if (e.response){
                const status = e.response.status;
            const message = e.response.data.message;
             if(status===400 && message==="Missing required fields"){
                this.setState({
                    error:message
                })
            }else if(status===400 && message==="No employee ID provided"){
                  this.setState({
                    error:message
                })
            }
             }
          
           else{
 this.setState({ error: "Something went wrong!" });
            }
        }
        
    }
    goBack=()=>{
        const {navigate}=this.props
        navigate("/")
    }
    getTeamName=async ()=>{
        const token=localStorage.getItem("token")
        if(!token){
            this.setState({
                    error:"You are not logged in!"
                })
                return
        }
        const response=await api.get("/teams")
        this.setState({
            listTeam:response.data.teams.map((eachItem)=>{
                return {
                    id:eachItem.id,
                    teamName:eachItem.name
                }
            })
        })
    }
    getTeamId=(e)=>{
        this.setState({
            teamId:e.target.value
        })
    }
    componentDidMount(){
        this.getTeamName()
    }
    render(){
        const {firstName,lastName,email,phone,successMessage,error,listTeam,assignTeam,assignTeamError,teamId}=this.state
        return (
            <div className="employee-form-container">
                <div className="create-employee-form">
                    <button type="button" className="btn btn-secondary back-button" onClick={this.goBack}><mark>Back</mark></button>
                    <h1 className="header-employee-text">Register a New Employee</h1>
                    <p className="employee-join-text">Fill the required field below to join a new Employee</p>
                    <form className="form-employee-registration" onSubmit={this.submitEmployeeForm}>
                        
                        <label className="label-employee-name" htmlFor="first-name">First Name</label>
                        <input type="text" className="employee-text-box" id="first-name" onChange={this.getFirstName} value={firstName}/>
                        <label className="label-employee-name" htmlFor="last-name">Last Name</label>
                        <input type="text" id="last-name" className="employee-text-box" onChange={this.getLastName} value={lastName}/>
                        <label className="label-employee-name" htmlFor="email">Email</label>
                        <input type="email" id="employee" className="employee-text-box" onChange={this.getEmail} value={email}/>
                        <label className="label-employee-name" htmlFor="phone">Phone</label>
                        <input type="text" id="phone" className="employee-text-box" onChange={this.getPhone} value={phone}/>
                        <label className="label-employee-name" htmlFor="Select Team">Select Team</label>
                        <select value={teamId} onChange={this.getTeamId}>
                            <option value="">-- Select a Team --</option>
                            {
                                listTeam.map((eachItem)=><option key={eachItem.id} value={eachItem.id} onChange={this.getTeamId}>{eachItem.teamName}</option>)
                            }
                        </select>
                        <button type="submit" className="btn btn-primary mt-4">Join Employee</button>
                    </form>
                    <div className="text-center w-100 error-handle"> 
                         <p>{successMessage && <span className="success-msg">{successMessage}</span>}</p>
                    <p>{error && <span className="failure-msg">{error}</span>}</p>
                    <p>{assignTeam && <span className="success-msg">{assignTeam}</span>}</p>
                    <p>{assignTeamError && <span className="failure-msg">{assignTeamError}</span>}</p>
                    </div>
                   
                </div>
                

            </div>
        )
    }
}

export default withRouter(EmployeeForm) 