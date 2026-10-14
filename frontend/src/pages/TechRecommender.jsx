import React, { useState } from 'react';
import api from '../services/api';

const TechRecommender = () => {
  const [form, setForm] = useState({ project_description: '', domain: '', skills: '' });
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skillsList = form.skills.split(',').map(s => s.trim()).filter(s => s);
      const res = await api.post('/ai/technology/recommend', {
        ...form,
        skills: skillsList
      });
      setRecommendation(res.data.recommendation);
    } catch (err) {
      console.error(err);
      alert('Error getting recommendations');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Technology Recommender</h3>
        <p className="mt-1 text-sm text-gray-500">Get the best tech stack tailored to your project requirements and your current skills.</p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Description</label>
            <textarea rows={3} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" value={form.project_description} onChange={e => setForm({...form, project_description: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Domain</label>
              <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" value={form.domain} onChange={e => setForm({...form, domain: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Skills</label>
              <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} placeholder="Python, React" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none disabled:opacity-50">
            {loading ? 'Recommending...' : 'Get Recommendations'}
          </button>
        </form>
      </div>

      {recommendation && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recommended Tech Stack</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              {['frontend', 'backend', 'database', 'ai_ml'].map(layer => (
                recommendation[layer] && (
                  <div key={layer} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 capitalize">{layer.replace('_', ' ')}</dt>
                    <dd className="mt-1 text-sm font-bold text-gray-900 sm:mt-0 sm:col-span-2">{recommendation[layer]}</dd>
                  </div>
                )
              ))}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-indigo-50">
                <dt className="text-sm font-medium text-indigo-800">Why this stack?</dt>
                <dd className="mt-1 text-sm text-indigo-900 sm:mt-0 sm:col-span-2">{recommendation.reasoning}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechRecommender;
