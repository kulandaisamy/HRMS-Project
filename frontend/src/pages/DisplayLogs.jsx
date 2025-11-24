import {Component} from "react"
import api from "../services/api"
import "../StyleComponent/displaylogs.css"
import { withRouter } from "../Navigator/withRouter"

class DisplayLogs extends Component{
    state={
        updateLogResult:[],
        error:""
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
        this.setState({
            updateLogResult:logs.map((eachItem)=>{
                return {
                    id:eachItem.id,
                    orgId:eachItem.organisation_id,
                    userId:eachItem.user_id,
                    action:eachItem.action,
                    time:eachItem.timestamp
                }
            })
        })
    }
    goBackHome=()=>{
        const {navigate}=this.props
        navigate("/")
    }
    render(){
        const {updateLogResult}=this.state
        console.log(updateLogResult)
        return (<div className="display-log-container">
            <button className="btn btn-primary mb-4" type="button" onClick={this.goBackHome}>Home Page</button>
            <div className="logs-entry-container">
                <h1>Log Entries</h1>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Organisation Id</th>
                            <th>UserId</th>
                            <th>Action</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {updateLogResult.length>0 ? updateLogResult.map((eachItem)=><tr key={eachItem.id}>
                            <td>{eachItem.id}</td>
                            <td>{eachItem.orgId}</td>
                            <td>{eachItem.userId}</td>
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
            
            
        </div>)
    }
}

export default withRouter(DisplayLogs)