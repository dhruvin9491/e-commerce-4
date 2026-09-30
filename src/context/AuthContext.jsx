import React, { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ensureDefaultAdmin } from '../redux/actions/userActions';

const STORAGE_KEY = 'shoplane_user';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const dispatch = useDispatch();
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

        dispatch(ensureDefaultAdmin())
            .catch(() => null)
            .finally(() => setReady(true));
    }, [dispatch]);

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