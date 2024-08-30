import React, { createContext, ReactNode, useState } from "react";
import axios, { AxiosError } from "axios";
import { useCookies } from "react-cookie";

interface AuthenticateType {
    userId: number,
    role: string,
    username: string,
    login: (username: string, password: string) => Promise<boolean>,
    logout: () => Promise<void>,
    loginError: string
}

export const AuthenticateContext = createContext<AuthenticateType>({
    userId: 0,
    role: 'Unauthorized',
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
    const [role, setRole] = useState<string>('Unauthorized');
    const [username, setUsername] = useState<string>('');
    const [userCookie, setUserCookie, removeUserCookie] = useCookies(['user']);
    const [loginError, setLoginError] = useState<string>('');

    const login = async (username: string, password: string) => {
        try {
            if (userCookie.user && Object.keys(userCookie.user).length > 0) {
                setUserId(userCookie.user['userId']);
                setUsername(userCookie.user['username']);
                setRole(userCookie.user['role']);
                return true;
            } else {
                const response = await axios.post(
                    `http://localhost:8081/watcher/auth/login?username=${username}&password=${password}`
                );
                if (response.status === 200) {
                    setUserId(response.data.userId);
                    setUsername(response.data.username);
                    setRole(response.data.role);
                    setUserCookie('user', {
                        userId: userId,
                        role: role,
                        username: username
                    });
                    setLoginError('');
                    return true;
                } else {
                    setLoginError(response.data.message || 'Login failed');
                    return false;
                }
            }
        } catch (e: AxiosError | any) {
            console.error(e);
            setLoginError(e.response?.data?.message || 'An error occurred during login');
            return false;
        }
    }

    const logout = async () => {
        try {
            setUserId(0);
            setRole('Unauthorized');
            setUsername('');
            removeUserCookie('user');
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <AuthenticateContext.Provider value={{
            userId,
            role,
            username,
            login,
            logout,
            loginError
        }}>
            {children}
        </AuthenticateContext.Provider>
    )
}
