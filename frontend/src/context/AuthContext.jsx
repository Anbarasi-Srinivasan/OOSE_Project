import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [library, setLibrary] = useState([]); // Purchased
    const [savedBooks, setSavedBooks] = useState([]); // Bookmarks
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        const fetchUser = () => {
            try {
                const storedUser = localStorage.getItem('bookflix_user');
                const token = localStorage.getItem('bookflix_token');
                if (storedUser && token && storedUser !== 'undefined') {
                    setUser(JSON.parse(storedUser));
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
            } catch (err) {
                console.error('Error parsing stored user:', err);
                localStorage.removeItem('bookflix_user');
                localStorage.removeItem('bookflix_token');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const fetchLibrary = async () => {
        try {
            const res = await axios.get(`${API_URL}/orders/my-library`);
            if (res.data.success) {
                setLibrary(res.data.data.map(o => o.book._id));
            }
        } catch (err) {
            console.error('Failed to fetch library:', err);
        }
    };

    const fetchSavedBooks = async () => {
        try {
            const res = await axios.get(`${API_URL}/users/library`);
            if (res.data.success) setSavedBooks(res.data.data.map(b => b._id));
        } catch (err) {
            console.error('Failed to fetch saved books:', err);
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${API_URL}/users/notifications`);
            if (res.data.success) setNotifications(res.data.data);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    const toggleSaveBook = async (bookId) => {
        try {
            const res = await axios.post(`${API_URL}/users/library/toggle`, { bookId });
            if (res.data.success) {
                await fetchSavedBooks();
                toast.success(res.data.message);
                return true;
            }
        } catch (err) {
            toast.error('Failed to update library');
            return false;
        }
    };

    const markNotificationsRead = async () => {
        try {
            await axios.post(`${API_URL}/users/notifications/read`);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error('Failed to clear notifications');
        }
    };

    useEffect(() => {
        if (user) {
            fetchLibrary();
            fetchSavedBooks();
            fetchNotifications();
            // Polling for notifications every 2 minutes
            const interval = setInterval(fetchNotifications, 120000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { token, user: userData } = res.data;
            localStorage.setItem('bookflix_token', token);
            localStorage.setItem('bookflix_user', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);
            
            if (userData.role === 'admin') {
                toast.success('Logged in as Admin');
            } else {
                toast.success('Logged in as User');
            }
            return userData;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Authentication Failure');
            return null;
        }
    };

    const register = async (username, email, password, role) => {
        try {
            const res = await axios.post(`${API_URL}/auth/register`, { username, email, password, role });
            const { token, user: userData } = res.data;
            localStorage.setItem('bookflix_token', token);
            localStorage.setItem('bookflix_user', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);
            toast.success('Identity Verified: Account Created Successfully');
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registry Failure');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('bookflix_token');
        localStorage.removeItem('bookflix_user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setLibrary([]);
        toast.success('Session Terminated Safely');
    };

    const buyBook = async (bookId, amount) => {
        try {
            const res = await axios.post(`${API_URL}/orders`, { bookId, amount });
            if (res.data.success) {
                await fetchLibrary();
                toast.success('Transaction Verified: Volume added to library');
                return true;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Transaction Refused');
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, loading, login, register, logout, 
            library, buyBook, fetchLibrary, 
            savedBooks, toggleSaveBook, fetchSavedBooks,
            notifications, fetchNotifications, markNotificationsRead,
            API_URL 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
