import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LiquidEther from './components/LiquidEther';

// --- AUTH GUARDS ---
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0514]">
            <div className="text-white italic font-serif opacity-50">Verifying Authority...</div>
        </div>
    );
    return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0514]">
            <div className="text-white italic font-serif opacity-50">Verifying Authority...</div>
        </div>
    );
    return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

// --- ANIMATED ROUTES WRAPPER ---
const AnimatedRoutes = () => {
    const location = useLocation();
    
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/user/dashboard" element={
                    <ProtectedRoute>
                        <UserDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/admin/dashboard" element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                } />

                <Route path="/dashboard" element={<Navigate to="/" />} />
            </Routes>
        </AnimatePresence>
    );
};
const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Toaster 
                    position="top-right" 
                    toastOptions={{
                        style: {
                            background: '#1a1525',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '1rem',
                            fontSize: '10px',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }
                    }} 
                />
                <div className="relative min-h-screen w-full bg-[#0a0514] overflow-x-hidden">
                    {/* Background Layer (Moved to z-[-1]) */}
                    <div className="fixed inset-0 z-0 pointer-events-none opacity-90">
                        <LiquidEther 
                          colors={['#4c1d95', '#7c3aed', '#a78bfa']} 
                          autoSpeed={0.3}
                          autoIntensity={1.5}
                        />
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 flex flex-col min-h-screen bg-transparent">
                        <Navbar />
                        <main className="flex-grow">
                            <AnimatedRoutes />
                        </main>
                        <Footer />
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
