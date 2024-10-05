import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthorizeRoutingComponent from "./components/AuthorizeRoutingComponent.tsx";
import DepartmentManage from "./pages/DepartmentManage.tsx";
import { ErrorPage } from "./pages/ErrorPage.tsx";
import { Home } from "./pages/Home.tsx";
import { Login } from "./pages/Login.tsx";
import { AuthenticateProvider } from "./providers/AuthenticateProvider.tsx";

function App(): React.ReactElement {

    return (
        <>
            <BrowserRouter>
                <AuthenticateProvider>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path={"/app"} element={<AuthorizeRoutingComponent><Home /></AuthorizeRoutingComponent>}>
                            <Route path={"departments"} element={<DepartmentManage />} />
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
