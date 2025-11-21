import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  MessageSquare, 
  MessageCircle, 
  LogOut, 
  UserCircle, 
  FileText,
  Menu,
  X
} from 'lucide-react';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100";

  const NavItem = ({ to, icon: Icon, label }: any) => (
    <Link to={to} onClick={() => setIsMobileOpen(false)} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(to)}`}>
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white shadow-xl z-30 transform lg:transform-none transition-transform duration-200 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">J</div>
              <span className="text-xl font-bold text-gray-800">JNTUGV</span>
            </div>
            <button onClick={() => setIsMobileOpen(false)} className="lg:hidden"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            
            {(user.role === UserRole.ADMIN || user.role === UserRole.COORDINATOR) && (
              <NavItem to="/users" icon={Users} label="User Management" />
            )}
            
            {user.role === UserRole.ADMIN && (
              <NavItem to="/departments" icon={Building2} label="Departments" />
            )}

            {(user.role === UserRole.ADMIN || user.role === UserRole.HOD || user.role === UserRole.PRINCIPAL) && (
               <NavItem to="/testimonials" icon={FileText} label="Testimonials" />
            )}

            <NavItem to="/forum" icon={MessageSquare} label="Discussion Forum" />
            
            {(user.role === UserRole.HOD || user.role === UserRole.ALUMNI) && (
              <NavItem to="/chat" icon={MessageCircle} label="Messages" />
            )}

            <NavItem to="/profile" icon={UserCircle} label="My Profile" />
          </div>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center space-x-3 mb-4 px-2">
              <img src={user.profilePic} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white shadow-sm lg:hidden h-16 flex items-center px-4">
          <button onClick={() => setIsMobileOpen(true)} className="p-2 rounded-md hover:bg-gray-100">
            <Menu size={24} />
          </button>
          <span className="ml-4 font-bold text-lg">Alumni Portal</span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};