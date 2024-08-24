import React, { createContext, ReactNode, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Simulate } from "react-dom/test-utils";

interface AuthenticateType {
    userId: number,
    role: string,
    username: string,
    login: (username: string, password: string) => Promise<void>,
    logout: () => Promise<void>
}

export const AuthenticateContext = createContext<AuthenticateType>({
    userId: 0,
    role: 'Unauthorized',
    username: '',
    login: async () => {
    },
    logout: async () => {
    }
})

export const AuthenticateProvider: React.FC<ReactNode> = (children) => {
    const [userId, setUserId] = useState<number>(0);
    const [role, setRole] = useState<string>('Unauthorized');
    const [username, setUsername] = useState<string>('');
    const [userCookie, setUserCookie, removeUserCookie] = useCookies(['user']);

    const login = async (username: string, password: string) => {
        try {
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
            }
        } catch (e) {
            console.error(e);
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
        }}>
            {children}
        </AuthenticateContext.Provider>
    )
}
