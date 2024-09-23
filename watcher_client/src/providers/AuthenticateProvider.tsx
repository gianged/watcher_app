import { AxiosError } from "axios";
import React, { createContext, ReactNode, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import authenticateApi from "../api/AuthenticateApi.ts";

interface AuthenticateType {
    user?: object | null,
    login: (username: string, password: string) => Promise<boolean>,
    logout: () => Promise<void>,
    loginError: string
}

const AuthenticateContext = createContext<AuthenticateType>({
    user: {
        userId: 0,
        username: '',
        roleLevel: 0,
        profilePicture: ''
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
    const [user, setUser] = useState<object | null>({});
    const [userCookie, setUserCookie, removeUserCookie] = useCookies(['user']);
    const [loginError, setLoginError] = useState<string>('');

    const login = async (username: string, password: string) => {
        try {
            const navigate = useNavigate();
            if (userCookie.user && Object.keys(userCookie.user).length > 0) {
                setUser({
                    userId: userCookie.user.userId,
                    username: userCookie.user.username,
                    roleLevel: userCookie.user.roleLevel,
                    profilePicture: userCookie.user.profilePicture
                });
                navigate("/manage");
                return true;
            } else {
                const response = await authenticateApi.login(username, password);
                if (response.success) {
                    setUser({
                        id: response.data.userId,
                        username: response.data.username,
                        roleLevel: response.data.roleLevel,
                        profilePicture: response.data.profilePicture
                    });
                    setUserCookie('user', user);
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
            const navigate = useNavigate();
            setUser(null);
            removeUserCookie('user');
            navigate("/");
        } catch (e) {
            console.error(e);
        }
    }

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