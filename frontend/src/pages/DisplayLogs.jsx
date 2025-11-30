import {Component} from "react"
import api from "../services/api"
import "../StyleComponent/displaylogs.css"
import { withRouter } from "../Navigator/withRouter"
import Header from "../components/Header"

class DisplayLogs extends Component{
    state={
        updateLogResult:[],
        error:"",
        getEmpId:null,
        startDate:null,
        endDate:null,
        option:["org_register","user_login","user_logout","employee_created","employee_updated","employee_deleted","assigned_employee_to_team","unassigned_employee_from_team","team_deleted","team_updated","team_created"],
        action:null
    }
    componentDidMount(){
        this.fetchLogEntries()
    }
    fetchLogEntries=async ()=>{
        const token=localStorage.getItem("token")
             if(!token){
                this.setState({
                    error:"You are not logged in!"
                })
                return
             }
        const response=await api.get("/logs")
        const {logs}=response.data
        const formatted=logs.map((eachItem)=>{
                return {
                    id:eachItem.id,
                    orgId:eachItem.organisation_id,
                    empId:eachItem.meta.employee_id,
                    action:eachItem.action,
                    time:eachItem.timestamp,
                }
            })
        this.setState({
            updateLogResult:formatted
        })
    }
    goBackHome=()=>{
        const {navigate}=this.props
        navigate("/")
    }
    sendUserId=(e)=>{
        this.setState({
            getEmpId:e.target.value
        })
      
    }
    getStartData=async (e)=>{
        this.setState({
            startDate:e.target.value
        })
    }
    getEndData=async (e)=>{
        this.setState({
            endDate:e.target.value
        })
    }
    getActionData=(e)=>{
        this.setState({
            action:e.target.value
        })
    }
    submitForm=async (e)=>{
        e.preventDefault()
        const {getEmpId,startDate,endDate,action}=this.state
        const response=await api.get("/logs",{params :{
            empId:getEmpId,
            startDate,endDate,action
        }})
        this.setState({
            updateLogResult:response.data.logs.map((eachItem)=>{
                return {
                    id:eachItem.id,
                    orgId:eachItem.organisation_id,
                    empId:eachItem.meta.employee_id,
                    action:eachItem.action,
                    time:eachItem.timestamp,
                }
            })
        })
    }
    render(){
        const {updateLogResult,option}=this.state
        console.log(updateLogResult)
        return (
            <div>
                 <Header/>
        <div className="display-log-container">
            <button className="btn btn-primary mb-4" type="button" onClick={this.goBackHome}>Home Page</button>
            <form className="filter-container" onSubmit={this.submitForm}>
                <p>Filter</p>
                <input type="number" placeholder="Type Employee Id" onChange={this.sendUserId}/>
                <label className="label-org-name" htmlFor="start date">Start Date</label>
                <input id="start date" type="date" onChange={this.getStartData}/>
                <label className="label-org-name" htmlFor="End Date">End Date</label>
                <input id="End Date" type="date" onChange={this.getEndData}/>
                <select onChange={this.getActionData}>
                    <option>--Select Action--</option>
                    {option.map((eachItem)=> <option>{eachItem}</option>)}
                </select>
                <button type="submit" className="btn btn-outline-info">Apply</button>
            </form>
            <div className="logs-entry-container">
                <h1>Log Entries</h1>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Organisation Id</th>
                            <th>employee Id</th>
                            <th>Action</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {updateLogResult.length>0 ? updateLogResult.map((eachItem)=><tr key={eachItem.id}>
                            <td>{eachItem.id}</td>
                            <td>{eachItem.orgId}</td>
                            <td>{eachItem.empId ? eachItem.empId : "NA"}</td>
                            <td>{eachItem.action}</td>
                            <td>{eachItem.time}</td>
                        </tr>) : <tr>
                         <td colSpan="5" className="text-center">
                  No Logs found.
                </td>
                </tr>}
                        
                    </tbody>
                </table>
            </div>
            
            
        </div>
        </div>)
    }
}

export default withRouter(DisplayLogs)