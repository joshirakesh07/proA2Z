import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {user.name}!</h1>
      <p className="mt-2 text-sm text-gray-600">Here's an overview of your academic projects.</p>
      
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Quick Links */}
        <Link to="/ideas" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition">
          <div className="p-5">
            <div className="font-medium text-gray-900">Generate Ideas</div>
            <div className="mt-1 text-sm text-gray-500">Use AI to find a project</div>
          </div>
        </Link>
        <Link to="/originality" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition">
          <div className="p-5">
            <div className="font-medium text-gray-900">Originality Check</div>
            <div className="mt-1 text-sm text-gray-500">Compare with existing projects</div>
          </div>
        </Link>
        <Link to="/profile" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition">
          <div className="p-5">
            <div className="font-medium text-gray-900">Update Profile</div>
            <div className="mt-1 text-sm text-gray-500">Add new skills</div>
          </div>
        </Link>
        <Link to="/projects" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition">
          <div className="p-5">
            <div className="font-medium text-gray-900">My Projects ({projects.length})</div>
            <div className="mt-1 text-sm text-gray-500">View active workspaces</div>
          </div>
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Active Projects</h2>
        <div className="mt-4 bg-white shadow rounded-lg overflow-hidden">
          {projects.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              You don't have any projects yet. <Link to="/ideas" className="text-indigo-600">Generate one!</Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {projects.map(p => (
                <li key={p.id} className="p-4 hover:bg-gray-50">
                  <Link to={`/projects/${p.id}`} className="block">
                    <p className="text-sm font-medium text-indigo-600 truncate">{p.title}</p>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{p.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
