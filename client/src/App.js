import { Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import { EmployeesProvider } from "./context/EmployeesContext";

import { AddEmployee } from "./comopnents/Employees/AddEmployee";
import { EditEmployee } from "./comopnents/Employees/EditEmployee";
import { Tasks } from "./comopnents/Tasks/Tasks";
import { AddTasks } from "./comopnents/Tasks/AddTask";
import { EditTask } from "./comopnents/Tasks/EditTask";
import { EmployeeDetails } from "./comopnents/Employees/EmployeeDetails";
import { CreateAccount } from "./comopnents/Employees/CreateAccount";
import { UpdateAccount } from "./comopnents/Employees/UpdateAccount";
import { MyTasks } from "./comopnents/Tasks/MyTasks";
import { Navbar } from "./comopnents/Navbar/Navbar";
import { Login } from "./comopnents/Login/Login";
import { Home } from "./comopnents/Home/Home";
import { Employees } from "./comopnents/Employees/Employees";

import "./App.css";
import AdminProtectedRoute from "./comopnents/ProtectedRoutes/AdminProtectedRoute";
import UserProtectedRoute from "./comopnents/ProtectedRoutes/UserProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar></Navbar>
        <ModalProvider>
          <EmployeesProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/employees-manager"
                element={
                  <AdminProtectedRoute>
                    <Employees />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/add-employee"
                element={
                  <AdminProtectedRoute>
                    <AddEmployee />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/employee-details/:id"
                element={
                  <AdminProtectedRoute>
                    <EmployeeDetails />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/employee-edit/:id"
                element={
                  <AdminProtectedRoute>
                    <EditEmployee />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/create-account/:id"
                element={
                  <AdminProtectedRoute>
                    <CreateAccount />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/update-account/:id"
                element={
                  <AdminProtectedRoute>
                    <UpdateAccount />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/task-manager"
                element={
                  <AdminProtectedRoute>
                    <Tasks />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/add-task"
                element={
                  <AdminProtectedRoute>
                    <AddTasks />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/task-edit/:id"
                element={
                  <AdminProtectedRoute>
                    <EditTask />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/my-tasks"
                element={
                  <UserProtectedRoute>
                    <MyTasks />
                  </UserProtectedRoute>
                }
              />
            </Routes>
          </EmployeesProvider>
        </ModalProvider>
      </div>
    </AuthProvider>
  );
}

export default App;
