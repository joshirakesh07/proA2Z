import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';

// Placeholder imports for pages we will create
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import IdeaGenerator from './pages/IdeaGenerator';
import OriginalityAnalyzer from './pages/OriginalityAnalyzer';
import TechRecommender from './pages/TechRecommender';
import Projects from './pages/Projects';
import ProjectWorkspace from './pages/ProjectWorkspace';
import VivaPrep from './pages/VivaPrep';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/ideas" element={<IdeaGenerator />} />
            <Route path="/originality" element={<OriginalityAnalyzer />} />
            <Route path="/technology" element={<TechRecommender />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectWorkspace />} />
            <Route path="/projects/:id/viva" element={<VivaPrep />} />
          </Route>
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
