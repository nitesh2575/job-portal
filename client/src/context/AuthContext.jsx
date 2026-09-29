import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        try {
            const savedUser = localStorage.getItem("user");
            const savedToken = localStorage.getItem("token");

            return {
                user: savedUser && savedToken ? JSON.parse(savedUser) : null,
                token: savedToken
            };
        } catch {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            return { user: null, token: null };
        }
    });

    const login = (token, userData) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        setAuth({ token, user: userData });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setAuth({ token: null, user: null });
    };

    return (
        <AuthContext.Provider
            value={{
                user: auth.user,
                token: auth.token,
                login,
                logout,
                isLoggedIn: Boolean(auth.token && auth.user)
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};