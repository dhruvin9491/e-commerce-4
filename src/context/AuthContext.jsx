import React, { createContext, useEffect, useState } from 'react';

import { createData, getData } from '../helper/ApiHelper';
import { USER_API } from '../constants/ApiConstant';
import { DEFAULT_ADMIN } from '../constants/CommonConstant';

const STORAGE_KEY = 'shoplane_user';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem(STORAGE_KEY);
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        getData(`${USER_API}?email=${encodeURIComponent(DEFAULT_ADMIN.email)}`)
            .then(({ data }) => {
                if (!data.length) {
                    return createData(USER_API, DEFAULT_ADMIN);
                }
                return null;
            })
            .catch(() => null)
            .finally(() => setReady(true));
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, ready, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}