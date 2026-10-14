import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', domain: '', technologies: '' });

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setIsModalOpen(false);
      fetchProjects();
      setNewProject({ title: '', description: '', domain: '', technologies: '' });
    } catch (err) {
      alert('Error creating project');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow text-sm font-medium hover:bg-indigo-700">
          Create New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Link to={`/projects/${project.id}`} key={project.id} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition flex flex-col h-full">
            <h2 className="text-xl font-bold text-indigo-700 mb-2 truncate">{project.title}</h2>
            <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-grow">{project.description}</p>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {project.status || 'Planning'}
              </span>
              <span className="text-xs text-gray-400 font-medium">Domain: {project.domain || 'N/A'}</span>
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">You don't have any projects yet.</p>
          <button onClick={() => setIsModalOpen(true)} className="mt-4 text-indigo-600 font-medium hover:underline">Create your first project</button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Project</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 sm:text-sm" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea rows={3} required className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 sm:text-sm" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Domain</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 sm:text-sm" value={newProject.domain} onChange={e => setNewProject({...newProject, domain: e.target.value})} />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="bg-indigo-600 border border-transparent rounded-md shadow-sm px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
