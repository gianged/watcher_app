import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login.tsx";
import { Home } from "./pages/Home.tsx";

function App(): React.ReactElement {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path={"/manage"} element={<Home />}>
                        {/*TODO: Add routes for each page here*/}
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
