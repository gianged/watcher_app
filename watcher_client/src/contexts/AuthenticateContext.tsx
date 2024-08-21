import React, { createContext, ReactNode, useState } from "react";

interface AuthenticateType {
    userId: number,
    role: string,
    username: string,
    login: (username: string, password: string) => void,
    logout: () => void
}

export const AuthenticateContext = createContext<AuthenticateType>({
    userId: 0,
    role: 'Unauthorized',
    username: '',
    login: () => {
    },
    logout: () => {
    }
})

export const AuthenticateProvider: React.FC<ReactNode> = (children) => {
    const [userId, setUserId] = useState<number>(0);
    const [role, setRole] = useState<string>('Unauthorized');
    const [username, setUsername] = useState<string>('');

    const login = (username: string, password: string) => {

    }

    const logout = () => {
        setUserId(0);
        setRole('Unauthorized');
        setUsername('');
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
