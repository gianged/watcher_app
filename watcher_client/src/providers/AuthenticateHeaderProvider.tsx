import { useCookies } from "react-cookie";

const useAuthenticationHeader = (): { Authorization: string } => {
    const [userCookie] = useCookies(['user']);

    return {
        Authorization: userCookie?.user?.token ? `${userCookie.user.token}` : ''
    };
};

export default useAuthenticationHeader;