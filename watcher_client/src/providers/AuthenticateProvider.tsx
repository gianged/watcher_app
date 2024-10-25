import { AxiosError } from "axios";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authenticateApi from "../api/AuthenticateApi.ts";

interface UserInfo {
    id: number;
    username: string;
    roleLevel: number;
    departmentId: number;
    profilePicture: string;
    token: string;
}

interface AuthenticateType {
    user?: UserInfo | null,
    login: (username: string, password: string) => Promise<boolean>,
    logout: () => Promise<void>,
    loginError: string,
    token?: string
}

const AuthenticateContext = createContext<AuthenticateType>({
    user: {
        id: 0,
        username: '',
        roleLevel: 0,
        departmentId: 0,
        profilePicture: '',
        token: ''
    },
    login: async () => {
        return new Promise((resolve) => {
            resolve(false);
        })
    },

    logout: async () => {
    },
    loginError: ''
})

const AuthenticateProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [user, setUser] = useState<UserInfo | null>(()=> {
        const localUser = localStorage.getItem('user');
        return localUser ? JSON.parse(localUser) : null;
    });
    const [loginError, setLoginError] = useState<string>('');
    const navigate = useNavigate();

    const login = async (username: string, password: string) => {
        try {
            const response = await authenticateApi.login(username, password);
            if (response.success) {
                const userData = {
                    id: response.data.id,
                    username: response.data.username,
                    roleLevel: response.data.roleLevel,
                    departmentId: response.data.departmentId,
                    profilePicture: `data:image/png;base64,${response.data.profilePictureBase64}`,
                    token: response.data.token
                }
                setUser(userData);
                return true;
            } else {
                setLoginError(response.message)
                return false;
            }
        } catch
            (e: AxiosError | any) {
            console.error("Error: " + e.message);
            return false;
        }
    };

    const logout = async () => {
        try {
            const response = await authenticateApi.logout();
            if (response.success) {
                setUser(null);
                localStorage.removeItem('user');
                navigate("/");
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            navigate("/app");
        }
    }, [user]);

    return (
        <AuthenticateContext.Provider value={{
            user,
            login,
            logout,
            loginError
        }}>
            {children}
        </AuthenticateContext.Provider>
    )
}

export { AuthenticateContext, AuthenticateProvider }