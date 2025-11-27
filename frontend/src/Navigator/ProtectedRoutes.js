import {Navigate,Outlet} from "react-router-dom"
import { jwtDecode } from "jwt-decode"

const ProtectedRoutes=()=>{
    const token=localStorage.getItem("token")
  
    const currentTime=Date.now()/1000
       if(!token) {
        return <Navigate to="/login" replace/>
     }
     try{
          let decode=jwtDecode(token)
        if(decode.exp<currentTime){
            localStorage.removeItem("token")
            return <Navigate to="login"/>
        }
        return <Outlet/>
     }catch(error){
          localStorage.removeItem("token")
            return <Navigate to="login"/>
     }
 
    
}

export default ProtectedRoutes