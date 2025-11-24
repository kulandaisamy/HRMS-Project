import {Component} from "react"
import { withRouter } from "../Navigator/withRouter.js"
import api from "../services/api.js"
import "../StyleComponent/login.css"

class Login extends Component{
    state={
        orgName:"",
        email:"",
        password:"",
        error:""
    }
    getOrgName=(e)=>{
        this.setState({
            orgName:e.target.value
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
    submitLoginForm=async (e)=>{
        e.preventDefault()
        const {navigate}=this.props
        const {orgName,email,password}=this.state
        try{
            const response=await api.post("/auth/login",{
                orgName,email,password
            })
            localStorage.setItem("token",response.data.jwtToken)
             navigate("/",{replace:true})
        }catch(error){
            if (error.response) {
                console.log(error)
            const status = error.response.status;
            const message = error.response.data;

            if (status === 400 && message === "No such Organisation") {
                this.setState({
                    error:"Organisation name wrong! Please try again."
                });
            } else if (status === 400 && message === "Invalid Email") {
                this.setState({
                    error:"Invalid Email."
                });
               
            }else if(status===400 && message==="Invalid password"){
                this.setState({
                    error:"Invalid password."
                });
            }
             else {
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

    }
    render(){
        const {orgName,email,password,error}=this.state
        return (<div className="login-container">
            <div className="login-form-container">
                <h1 className="login-heading">Login</h1>
                <p className="login-account-text">Login to your account</p>
                <form className="form-container-login" onSubmit={this.submitLoginForm}>
                    <label className="org-name-label" htmlFor="orgName">Organisation Name</label>
                    <input className="text-box" type="text" id="orgName" value={orgName} onChange={this.getOrgName}/>
                    <label className="org-name-label" htmlFor="email">Email</label>
                    <input className="text-box" type="text" id="email" value={email} onChange={this.getEmail}/>
                    <label className="org-name-label" htmlFor="password">Password</label>
                    <input className="text-box" type="password" id="password" value={password} onChange={this.getPassword}/>
                    <button className="btn btn-primary mt-4 w-100">Login</button>
                </form>
                {error && <p className="error-msg">{error}</p>}
            </div>
            <div className="bg-image-container">
                <h1 className="dummy-text">Manage all <span className="hr-text">HR Operations</span> from the comfort of your home</h1>
            </div>
            <div>

            </div>
        </div>)
    }
}

export default withRouter(Login)