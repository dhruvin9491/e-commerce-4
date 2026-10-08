import React, { createContext, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { USER_API } from '../constants/ApiConstant';
import { getData } from '../helper/ApiHelper';
import { ensureDefaultAdmin } from '../redux/actions/userActions';

const STORAGE_KEY = 'shoplane_user';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const dispatch = useDispatch();
    const initializationStarted = useRef(false);
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    const [initializationError, setInitializationError] = useState('');

    useEffect(() => {
        if (initializationStarted.current) return;
        initializationStarted.current = true;

        const initializeAuth = async () => {
            try {
                await dispatch(ensureDefaultAdmin());

                const storedUser = localStorage.getItem(STORAGE_KEY);
                if (!storedUser) return;

                let savedUser;
                try {
                    savedUser = JSON.parse(storedUser);
                } catch {
                    localStorage.removeItem(STORAGE_KEY);
                    return;
                }

                if (!savedUser?.id) {
                    localStorage.removeItem(STORAGE_KEY);
                    return;
                }

                const response = await getData(
                    `${USER_API}?id=${encodeURIComponent(savedUser.id)}`
                );
                const currentUser = response.data[0];

                if (!currentUser || currentUser.isDeleted) {
                    localStorage.removeItem(STORAGE_KEY);
                    return;
                }

                setUser(currentUser);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
            } catch (error) {
                setInitializationError(error.message || 'Could not connect to the account server.');
            } finally {
                setReady(true);
            }
        };

        initializeAuth();
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
        <AuthContext.Provider value={{ user, ready, initializationError, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}