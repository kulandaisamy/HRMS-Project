import {Component} from "react"
import api from "../services/api"
import "../StyleComponent/employeeform.css"
import { withRouter } from "../Navigator/withRouter"

class TeamForm extends Component{
    state={
        name:"",
        description:"",
        successMessage:"",
        error:""
    }
    getTeamName=(e)=>{
        this.setState({
            name:e.target.value
        })
    }
    getDescription=(e)=>{
        this.setState({
            description:e.target.value
        })
    }
    submitTeamForm=async (e)=>{
        e.preventDefault()
          const {name,description}=this.state
        this.setState({
            successMessage:"",
        error:""
        })
        try{
            const token=localStorage.getItem("token")
             if(!token){
                this.setState({
                    error:"You are not logged in!"
                })
                return
             }
              const response=await api.post("/teams",{
                name,description
            })
             this.setState({
                successMessage:response.data.message,
                name:"",
                description:""

            })
        }catch(e){
              if (e.response){
                const status = e.response.status;
            const message = e.response.data.message;
             if(status===400 && message==="Team name is required"){
                this.setState({
                    error:message
                })
            }else if(status===400 && message==="Team name already exists"){
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
    
    render(){
        const {name,description,successMessage,error}=this.state
        return (
            <div className="employee-form-container">
                <div className="create-employee-form">
                    <button type="button" className="btn btn-secondary back-button" onClick={this.goBack}><mark>Back</mark></button>
                    <h1 className="header-employee-text">Create a New Team</h1>
                    <p className="employee-join-text">Fill the required field below to create a new team</p>
                    <form className="form-employee-registration" onSubmit={this.submitTeamForm}>
                        
                        <label className="label-employee-name" htmlFor="team-name">Team Name</label>
                        <input type="text" className="employee-text-box" id="team-name" onChange={this.getTeamName} value={name}/>
                        
                        <label className="label-employee-name" htmlFor="description">Description</label>
                        <textarea 
                            id="description"
                            className="employee-textarea"
                            rows="4"
                            onChange={this.getDescription} value={description}
                        ></textarea>
                        <button type="submit" className="btn btn-primary mt-4">Create Team</button>
                    </form>
                    <div className="text-center w-100"> 
                         <p>{successMessage && <span className="success-msg">{successMessage}</span>}</p>
                    <p>{error && <span className="failure-msg">{error}</span>}</p>
                    </div>
                   
             
                

            </div>
        </div>)
    }
}

export default withRouter(TeamForm)