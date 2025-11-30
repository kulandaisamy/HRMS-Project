import {Component} from "react"
import api from "../services/api"
import "../StyleComponent/empManagement.css"
import { withRouter } from "../Navigator/withRouter"
import Header from "../components/Header"


class Employees extends Component{
    state={
        updateListEmployees:[],
        error:""
    }
    componentDidMount(){
        this.getData()
        
    }
    getData=async ()=>{
        const token=localStorage.getItem("token")
             if(!token){
                this.setState({
                    error:"You are not logged in!"
                })
                return
             }
        const response=await api.get("/employees")
        
        const {employees}=response.data
        this.setState({
            updateListEmployees:employees.map((eachItem)=>{
                return {
                    id:eachItem.id,
                    orgId:eachItem.organisation_id,
                    firstName:eachItem.first_name,
                    lastName:eachItem.last_name,
                    email:eachItem.email,
                    phoneNumber:eachItem.phone,
                    joinedAt:eachItem.created_at
                }
            })
        })
       
    }
    goToHome=()=>{
        const {navigate}=this.props
        navigate("/")
    }
    specialOperation=(id)=>{
        const {navigate}=this.props
        navigate(`/employee-details/${id}`)
    }
    render(){
        const {updateListEmployees}=this.state
        console.log(updateListEmployees)
        return (
            <div>
                 <Header/>
        <div className="employee-management-container">
           
            <div className="employee-management-table">
                 <h1>Employee Management</h1>
                 <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Emp Id</th>
                            <th>Org Id</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Joined AT</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                         {updateListEmployees.length>0 ? updateListEmployees.map((eachItem)=> <tr key={eachItem.id}>
                                <td>{eachItem.id}</td>
                                <td>{eachItem.orgId}</td>
                                <td>{eachItem.firstName}</td>
                                <td>{eachItem.lastName}</td>
                                <td>{eachItem.email}</td>
                                <td>{eachItem.phoneNumber}</td>
                                <td>{eachItem.joinedAt}</td>
                                <td><button className="btn btn-primary" onClick={()=>this.specialOperation(eachItem.id)}>Click</button></td>
                         </tr>) : 
                         <tr>
                         <td colSpan="5" className="text-center">
                  No employees found.
                </td>
                </tr>}
                    </tbody>
                   
                 </table>
            </div>
           <button type="button" className="btn btn-primary mt-4" onClick={this.goToHome}>Home Page</button>
        </div>
        </div>
        )
    }
}

export default withRouter(Employees)