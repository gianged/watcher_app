import { AxiosError } from "axios";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import authenticateApi from "../api/AuthenticateApi.ts";

interface AuthenticateType {
    user?: object | null,
    login: (username: string, password: string) => Promise<boolean>,
    logout: () => Promise<void>,
    loginError: string,
    token?: string
}

const AuthenticateContext = createContext<AuthenticateType>({
    user: {
        userId: 0,
        username: '',
        roleLevel: 0,
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
    const [user, setUser] = useState<object | null>(null);
    const [userCookie, setUserCookie, removeUserCookie] = useCookies(['user']);
    const [loginError, setLoginError] = useState<string>('');
    const navigate = useNavigate();

    const login = async (username: string, password: string) => {
        try {
            if (userCookie) {
                removeUserCookie('user');
            }
            const response = await authenticateApi.login(username, password);
            if (response.success) {
                setUser({
                    id: response.data.userId,
                    username: response.data.username,
                    roleLevel: response.data.roleLevel,
                    profilePicture: response.data.profilePicture,
                    token: response.data.token
                });
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
                removeUserCookie('user');
                navigate("/");
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (user) {
            setUserCookie('user', user);
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