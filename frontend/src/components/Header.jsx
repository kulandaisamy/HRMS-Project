import "../StyleComponent/header.css"
import { withRouter } from "../Navigator/withRouter.js"
import api from "../services/api.js"

const Header=(props)=>{

      const logOut=async ()=>{
        try{
        const response=await api.post("/auth/logout", {}, { withCredentials: true })
        if(response.data){
        localStorage.removeItem("token")
         const {navigate}=props
        navigate("/login")
        }
    }
    catch(error){
        console.error("Logged Out Failed",error)
    }
}
    return (
        <div className="header-container">
            <p className="hrms-para">HRMS</p>
            <button className="btn btn-outline-danger" onClick={logOut}>Logout</button>
        </div>
    )
}

export default withRouter(Header)