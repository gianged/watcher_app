import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthorizeRoutingComponent from "./components/AuthorizeRoutingComponent.tsx";
import AnnounceManage from "./pages/AnnounceManage.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import DepartmentManage from "./pages/DepartmentManage.tsx";
import { ErrorPage } from "./pages/ErrorPage.tsx";
import { Home } from "./pages/Home.tsx";
import { Login } from "./pages/Login.tsx";
import Profile from "./pages/Profile.tsx";
import TicketManage from "./pages/TicketManage.tsx";
import { UserManage } from "./pages/UserManage.tsx";
import { AuthenticateProvider } from "./providers/AuthenticateProvider.tsx";

function App(): React.ReactElement {

    return (
        <>
            <BrowserRouter>
                <AuthenticateProvider>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path={"/app"} element={<AuthorizeRoutingComponent><Home /></AuthorizeRoutingComponent>}>
                            <Route index element={<Dashboard />} />
                            <Route path={"departments"} element={<DepartmentManage />} />
                            <Route path={"users"} element={<UserManage />} />
                            <Route path={"announces"} element={<AnnounceManage />} />
                            <Route path={"tickets"} element={<TicketManage />} />
                            <Route path={"profile"} element={<Profile />} />
                        </Route>
                        <Route path={"/error"} element={<ErrorPage />} />
                        <Route path="*" element={<ErrorPage />} />
                    </Routes>
                </AuthenticateProvider>
            </BrowserRouter>
        </>
    )
}

export default App
