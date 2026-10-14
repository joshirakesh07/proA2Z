import React, { useState } from 'react';
import api from '../services/api';

const IdeaGenerator = () => {
  const [form, setForm] = useState({ skills: '', interests: '', domain: '', difficulty: 'Medium' });
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skillsList = form.skills.split(',').map(s => s.trim()).filter(s => s);
      const res = await api.post('/ai/ideas/generate', {
        skills: skillsList,
        interests: form.interests,
        domain: form.domain,
        difficulty: form.difficulty
      });
      setIdeas(res.data.ideas);
    } catch (err) {
      console.error(err);
      alert('Error generating ideas');
    }
    setLoading(false);
  };

  const handleCreateProject = async (idea) => {
    try {
      const res = await api.post('/projects/', {
        title: idea.title,
        description: idea.problem_statement + "\n\nProposed Solution: " + idea.proposed_solution,
        problem_statement: idea.problem_statement,
        solution: idea.proposed_solution,
        domain: form.domain,
        technologies: idea.recommended_technology_stack
      });
      alert(`Project "${res.data.title}" created successfully! Check your Projects tab.`);
    } catch (err) {
      alert('Error creating project');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900">AI Project Idea Generator</h3>
        <p className="mt-1 text-sm text-gray-500">Provide some context and let AI generate unique project ideas for you.</p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Skills (comma separated)</label>
              <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} placeholder="React, Python, Machine Learning" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Interests</label>
              <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" value={form.interests} onChange={e => setForm({...form, interests: e.target.value})} placeholder="Healthcare, Automation" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Target Domain</label>
              <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" value={form.domain} onChange={e => setForm({...form, domain: e.target.value})}>
                <option value="">Select Domain</option>
                <option value="Web Development">Web Development</option>
                <option value="AI/ML">AI/ML</option>
                <option value="IoT">IoT</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Computer Vision">Computer Vision</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Difficulty</label>
              <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}>
                <option value="Beginner">Beginner</option>
                <option value="Medium">Medium</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            {loading ? 'Generating Ideas...' : 'Generate Ideas'}
          </button>
        </form>
      </div>

      {ideas.length > 0 && (
        <div className="space-y-6">
          {ideas.map((idea, idx) => (
            <div key={idx} className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{idea.title}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Difficulty: {idea.difficulty}</p>
                </div>
                <button onClick={() => handleCreateProject(idea)} className="bg-green-600 text-white px-4 py-2 rounded shadow text-sm font-medium hover:bg-green-700">Create Project Workspace</button>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Problem Statement</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{idea.problem_statement}</dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Proposed Solution</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{idea.proposed_solution}</dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Features</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <ul className="list-disc pl-5">
                        {Array.isArray(idea.main_features) ? idea.main_features.map((f, i) => <li key={i}>{f}</li>) : <li>{idea.main_features}</li>}
                      </ul>
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Recommended Tech</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{idea.recommended_technology_stack}</dd>
                  </div>
                </dl>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IdeaGenerator;
