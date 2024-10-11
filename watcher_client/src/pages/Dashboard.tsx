import React, { useContext } from "react";
import { DashboardComponent } from "../components/DashboardComponent";
import "./Dashboard.scss"
import { AuthenticateContext } from "../providers/AuthenticateProvider.tsx";

const Dashboard: React.FC = () => {

    const {user} = useContext(AuthenticateContext);

    const role = user?.roleLevel ?? 0;
    const department = user?.departmentId ?? 0;
    const userId = user?.id ?? 0;

    return (
        <div>
            <DashboardComponent role={role} department={department} userId={userId} />
        </div>
    );
};

export default Dashboard;