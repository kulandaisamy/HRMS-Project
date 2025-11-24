import {Component} from "react"
import api from "../services/api"
import { withRouter } from "../Navigator/withRouter"
import "../StyleComponent/listTeam.css"

class Teams extends Component{
    state={
        updateTeamLogs:[],
        error:"",message:"",
        isEdit:"",name:"",
        
    }
    fetchTeams=async ()=>{
        const token=localStorage.getItem("token")
        if(!token){
            this.setState({
                    error:"You are not logged in!"
                })
                return
        }
        const response=await api.get("/teams")
        const {teams}=response.data
        this.setState({
            updateTeamLogs:teams.map((eachItem)=>{
                return {
                    Id:eachItem.id,
                    orgId:eachItem.organisation_id,
                    name:eachItem.name,
                    description:eachItem.description,
                    createdAt:eachItem.created_at
                }
            }
            )
        })
    }
    componentDidMount(){
        this.fetchTeams()
    }
    goHomePage=()=>{
        const {navigate}=this.props
        navigate("/")
    }
    deleteTeam=async (id)=>{
        try{
        const response=await api.delete(`/teams/${id}`)
        this.setState((prevState)=>({
            message: response.data.message,
            updateTeamLogs: prevState.updateTeamLogs.filter(team => team.Id !== id)
        }))
    }catch(e){
        console.log(e.response.message)
    }
       
    }
    editData=async (id)=>{
        this.setState({
            isEdit:id
        })
    }
    saveData=async (id)=>{
        try{
        const team = this.state.updateTeamLogs.find(t => t.Id === id);
        const response=await api.put(`/teams/${id}`,{  name: team.name,
            description: team.description})
            this.setState({
            message: response.data.message,
            isEdit: ""  
        });

    } catch (error) {
        console.error(error);
        this.setState({ message: "Failed to update team." });
    }
    }
    nameChange=(e,id)=>{
       const newValue = e.target.value
    this.setState(prevState => ({
        updateTeamLogs: prevState.updateTeamLogs.map(team => 
            team.Id === id ? {...team, name: newValue} : team
        ),
       
    }))
    }

    descriptionChange = (e, id) => {
    const newValue = e.target.value
    this.setState(prevState => ({
        updateTeamLogs: prevState.updateTeamLogs.map(team => 
            team.Id === id ? {...team, description: newValue} : team
        ),
       
    }))
}
    render(){
        const {updateTeamLogs,message,isEdit}=this.state
        return (<div className="list-team-container">
        
            <button type="button" className="btn btn-primary mb-4" onClick={this.goHomePage}>Home Page</button>
            {message && <p>{message}</p>}
            <div className="list-container">
                 <h1>List team</h1>
                 <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Organisation Id</th>
                            <th>Name</th>
                            <th>description</th>
                            <th>Created Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                           updateTeamLogs.length>0 ? updateTeamLogs.map((eachItem)=><tr key={eachItem.Id}>
                                <td>{eachItem.Id}</td>
                                <td>{eachItem.orgId}</td>
                                <td>{isEdit===eachItem.Id ?<input type="text" value={eachItem.name} onChange={(e)=>this.nameChange(e,eachItem.Id)}/> : eachItem.name}</td>
                                <td>{isEdit===eachItem.Id ?<input type="text" value={eachItem.description} onChange={(e)=>this.descriptionChange(e,eachItem.Id)}/>: eachItem.description}</td>
                                <td>{eachItem.createdAt}</td>
                                <td>
                                    <button type="button" className={isEdit===eachItem.Id ? "btn btn-success" :"btn btn-secondary"} onClick={isEdit===eachItem.Id ? ()=>this.saveData(eachItem.Id):()=>this.editData(eachItem.Id)}>{isEdit===eachItem.Id ?"Save" : "Edit"}</button>
                                    <button type="button" onClick={()=>this.deleteTeam(eachItem.Id)} className="btn btn-danger ml-1">Delete</button>
                                </td>

                            </tr>
                               
                            ) : <tr>
                                <td className="colspan=5 text-center">
                                     No Teams found.
                                </td>
                            </tr>
                        }
                    
                    </tbody>
                 </table>
            </div>
           
        </div>)
    }
}

export default withRouter(Teams)