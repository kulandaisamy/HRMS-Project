import RegisterOrg from './pages/RegisterOrg';
import DashBoard from "./pages/DashBoard"
import {Routes,Route } from "react-router-dom";
import Login from "./pages/Login"
import EmployeeForm from "./components/EmployeeForm"
import Employees from './pages/Employees';
import TeamForm from './components/TeamForm';
import DisplayLogs from './pages/DisplayLogs';
import Teams from "./pages/Teams";
import './App.css';
import EmployeeDetails from './pages/EmployeeDetails';
import ProtectedRoutes from "./Navigator/ProtectedRoutes"

function App() {
  
  return (
    <Routes>
      <Route exact path="/register" element={<RegisterOrg/>}/>
      <Route exact path="/login" element={<Login/>}/>
      <Route element={<ProtectedRoutes/>}>
      <Route exact path="/" element={<DashBoard/>}/>
      <Route exact path="/employee-form" element={<EmployeeForm/>}/>
      <Route exact path="/employee-list" element={<Employees/>}/>
      <Route exact path="/team-form" element={<TeamForm/>}/>
      <Route exact path="/display-log" element={<DisplayLogs/>}/>
      <Route exact path="/teams" element={<Teams/>}/>
      <Route exact path="/employee-details/:id" element={<EmployeeDetails/>}/>
      </Route>
    </Routes>
  );
}

export default App;
