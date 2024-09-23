import React, { createContext, ReactNode, useState } from "react";
import { AxiosError } from "axios";
import { useCookies } from "react-cookie";
import authenticateApi from "../api/AuthenticateApi.ts";
import { useNavigate } from "react-router-dom";

interface AuthenticateType {
    userId: number,
    roleLevel: number,
    username: string,
    login: (username: string, password: string) => Promise<boolean>,
    logout: () => Promise<void>,
    loginError: string
}

export const AuthenticateContext = createContext<AuthenticateType>({
    userId: 0,
    roleLevel: 0,
    username: '',
    login: async () => {
        return new Promise((resolve) => {
            resolve(false);
        })
    },
    logout: async () => {
    },
    loginError: ''
})

export const AuthenticateProvider: React.FC<ReactNode> = (children) => {
    const [userId, setUserId] = useState<number>(0);
    const [roleLevel, setRoleLevel] = useState<number>(0);
    const [username, setUsername] = useState<string>('');
    const [userCookie, setUserCookie, removeUserCookie] = useCookies(['user']);
    const [loginError, setLoginError] = useState<string>('');

    const login = async (username: string, password: string) => {
        try {
            const navigate = useNavigate();
            if (userCookie.user && Object.keys(userCookie.user).length > 0) {
                setUserId(userCookie.user['userId']);
                setUsername(userCookie.user['username']);
                setRoleLevel(userCookie.user['role']);
                navigate("/manage");
                return true;
            } else {
                const response = await authenticateApi.login(username, password);
                if (response.success) {
                    setUserId(response.data.userId);
                    setUsername(response.data.username);
                    setRoleLevel(response.data.roleLevel);
                    setUserCookie('user', {
                        userId: userId,
                        role: roleLevel,
                        username: username
                    });
                    navigate("/manage");
                    return true;
                } else {
                    setLoginError(response.message)
                    return false;
                }
            }
        } catch (e: AxiosError | any) {
            console.error("Error: " + e.message);
            return false;
        }
    }

    const logout = async () => {
        try {
            setUserId(0);
            setRoleLevel(0);
            setUsername('');
            removeUserCookie('user');
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <AuthenticateContext.Provider value={{
            userId,
            roleLevel,
            username,
            login,
            logout,
            loginError
        }}>
            {children}
        </AuthenticateContext.Provider>
    )
}
