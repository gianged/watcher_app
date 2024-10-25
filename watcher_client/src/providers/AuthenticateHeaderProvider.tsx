const useAuthenticationHeader = (): { Authorization: string } => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return {
        Authorization: user?.token ? `${user.token}` : ''
    };
};

export default useAuthenticationHeader;