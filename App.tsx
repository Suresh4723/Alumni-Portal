import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, AuthState, UserRole } from './types';
import { api } from './services/api';
import { Layout } from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import UserManagement from './pages/UserManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import TestimonialManager from './pages/TestimonialManager';
import Forum from './pages/Forum';
import Chat from './pages/Chat';
import Profile from './pages/Profile';

// --- Auth Context ---
interface AuthContextType extends AuthState {
  login: (email: string, pass: string) => Promise<boolean>;
  register: (user: Partial<User>) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('jntugv_current_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    const users = api.getUsers();
    const found = users.find(u => u.email === email && u.password === pass);
    if (found) {
      if (!found.isApproved) {
        alert("Account pending approval by Admin/Coordinator.");
        return false;
      }
      setUser(found);
      localStorage.setItem('jntugv_current_user', JSON.stringify(found));
      return true;
    }
    return false;
  };

  const register = async (userData: any): Promise<boolean> => {
    api.createUser(userData);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jntugv_current_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Protected Route ---
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: UserRole[] }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute allowedRoles={[UserRole.HOD, UserRole.ALUMNI]}><Chat /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            {/* Admin / Coord / HOD Routes */}
            <Route path="/users" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.COORDINATOR]}><UserManagement /></ProtectedRoute>} />
            <Route path="/departments" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><DepartmentManagement /></ProtectedRoute>} />
            <Route path="/testimonials" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.HOD, UserRole.PRINCIPAL]}><TestimonialManager /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}