import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Home, User, Lightbulb, CheckSquare, Target, Settings, Layers } from 'lucide-react';

const DashboardLayout = () => {
  const { user, loading, logout } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-indigo-600">Project A-Z</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link to="/dashboard" className="flex items-center px-2 py-2 text-gray-700 rounded-md hover:bg-gray-100">
            <Home className="mr-3 h-5 w-5" /> Dashboard
          </Link>
          <Link to="/projects" className="flex items-center px-2 py-2 text-gray-700 rounded-md hover:bg-gray-100">
            <Target className="mr-3 h-5 w-5" /> Projects
          </Link>
          <Link to="/ideas" className="flex items-center px-2 py-2 text-gray-700 rounded-md hover:bg-gray-100">
            <Lightbulb className="mr-3 h-5 w-5" /> Idea Generator
          </Link>
          <Link to="/originality" className="flex items-center px-2 py-2 text-gray-700 rounded-md hover:bg-gray-100">
            <CheckSquare className="mr-3 h-5 w-5" /> Originality Check
          </Link>
          <Link to="/technology" className="flex items-center px-2 py-2 text-gray-700 rounded-md hover:bg-gray-100">
            <Layers className="mr-3 h-5 w-5" /> Tech Recommender
          </Link>
          <Link to="/profile" className="flex items-center px-2 py-2 text-gray-700 rounded-md hover:bg-gray-100">
            <User className="mr-3 h-5 w-5" /> Profile
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <button onClick={logout} className="ml-2 p-2 text-gray-400 hover:text-gray-500">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
