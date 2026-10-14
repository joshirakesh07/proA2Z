import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import ReactMarkdown from 'react-markdown';

const ProjectWorkspace = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loadingPlan, setLoadingPlan] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const [projRes, tasksRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get(`/projects/${id}/tasks`)
        ]);
        setProject(projRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjectData();
  }, [id]);

  const handleGeneratePlan = async () => {
    setLoadingPlan(true);
    try {
      await api.post(`/ai/planner/generate?project_id=${id}`);
      const tasksRes = await api.get(`/projects/${id}/tasks`);
      setTasks(tasksRes.data);
      alert('Project plan generated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error generating plan');
    }
    setLoadingPlan(false);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const res = await api.post(`/projects/${id}/tasks`, { title: newTaskTitle });
      setTasks([...tasks, res.data]);
      setNewTaskTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleTaskStatusToggle = async (task) => {
    const newStatus = task.status === 'Completed' ? 'To Do' : 'Completed';
    try {
      const res = await api.put(`/projects/tasks/${task.id}`, { status: newStatus });
      setTasks(tasks.map(t => t.id === task.id ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/projects/tasks/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!project) return <div>Loading...</div>;

  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const progress = tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-start bg-white shadow rounded-lg p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
          <p className="text-gray-500 mt-1">{project.domain}</p>
        </div>
        <div className="space-x-3">
          <Link to={`/projects/${id}/viva`} className="bg-purple-600 text-white px-4 py-2 rounded shadow text-sm font-medium hover:bg-purple-700">Prepare for Viva</Link>
          <button onClick={handleGeneratePlan} disabled={loadingPlan} className="bg-indigo-600 text-white px-4 py-2 rounded shadow text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
            {loadingPlan ? 'Generating...' : 'AI Planner'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Project Overview</h2>
            <div className="prose max-w-none text-sm text-gray-700">
              <ReactMarkdown>{project.description || '*No description provided.*'}</ReactMarkdown>
            </div>
            
            {project.technologies && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Tech Stack</h3>
                <p className="text-sm text-gray-600 mt-1">{project.technologies}</p>
              </div>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Task Management</h2>
            
            <form onSubmit={handleAddTask} className="flex space-x-2 mb-6">
              <input type="text" placeholder="Add a new task..." className="flex-1 border border-gray-300 rounded-md py-2 px-3 sm:text-sm" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} />
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-700">Add</button>
            </form>

            <ul className="divide-y divide-gray-200">
              {tasks.map(task => (
                <li key={task.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <input type="checkbox" checked={task.status === 'Completed'} onChange={() => handleTaskStatusToggle(task)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <span className={`ml-3 text-sm font-medium ${task.status === 'Completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.title}</span>
                  </div>
                  <button onClick={() => handleDeleteTask(task.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                </li>
              ))}
              {tasks.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No tasks yet. Use the AI Planner to generate tasks automatically!</p>}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Progress Tracker</h2>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div><span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">Task Completion</span></div>
                <div className="text-right"><span className="text-xs font-semibold inline-block text-indigo-600">{progress}%</span></div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center">{completedTasks} of {tasks.length} tasks completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectWorkspace;
