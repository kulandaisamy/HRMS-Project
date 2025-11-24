import RegisterOrg from './pages/RegisterOrg';
import DashBoard from "./pages/DashBoard"
import {Route,Routes,Navigate } from "react-router-dom";
import Login from "./pages/Login"
import EmployeeForm from "./components/EmployeeForm"
import Employees from './pages/Employees';
import TeamForm from './components/TeamForm';
import DisplayLogs from './pages/DisplayLogs';
import Teams from "./pages/Teams";
import './App.css';
import EmployeeDetails from './pages/EmployeeDetails';

function App() {
  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <Routes>
      <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/register" />}
        />
      <Route exact path="/register" element={<RegisterOrg/>}/>
      <Route exact path="/dashboard" element={<DashBoard/>}/>
      <Route exact path="/login" element={<Login/>}/>
      <Route exact path="/employee-form" element={<EmployeeForm/>}/>
      <Route exact path="/employee-list" element={<Employees/>}/>
      <Route exact path="/team-form" element={<TeamForm/>}/>
      <Route exact path="/display-log" element={<DisplayLogs/>}/>
      <Route exact path="/teams" element={<Teams/>}/>
      <Route exact path="/employee-details/:id" element={<EmployeeDetails/>}/>
    </Routes>
  );
}

export default App;
