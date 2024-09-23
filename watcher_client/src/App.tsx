import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ErrorPage } from "./pages/ErrorPage.tsx";
import { Home } from "./pages/Home.tsx";
import { Login } from "./pages/Login.tsx";

function App(): React.ReactElement {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path={"/manage"} element={<Home />}>
                        {/*TODO: Add routes for each page here*/}
                    </Route>
                    <Route path={"/error"} element={<ErrorPage />} />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
