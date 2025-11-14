import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { queryClient } from "./lib/queryClient";
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
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
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

                {/* Toast Notifications */}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#333',
                            color: '#fff',
                            borderRadius: '8px',
                            padding: '16px',
                        },
                        success: {
                            iconTheme: {
                                primary: '#28a745',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#dc3545',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </QueryClientProvider>
        </ErrorBoundary>
    )
}

export default App
