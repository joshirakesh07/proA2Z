import React, { useState } from 'react';
import api from '../services/api';

const OriginalityAnalyzer = () => {
  const [form, setForm] = useState({ title: '', description: '', technologies: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/ai/originality/analyze', form);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert('Error analyzing originality');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Project Originality Analyzer</h3>
        <p className="mt-1 text-sm text-gray-500">Check how similar your idea is to existing projects using Semantic Similarity.</p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Title</label>
            <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Description</label>
            <textarea rows={4} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Technologies (optional)</label>
            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" value={form.technologies} onChange={e => setForm({...form, technologies: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none disabled:opacity-50">
            {loading ? 'Analyzing...' : 'Analyze Originality'}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Originality Result</h3>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path className="text-gray-200" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className={`${result.similarity_score > 70 ? 'text-red-500' : result.similarity_score > 40 ? 'text-yellow-500' : 'text-green-500'}`} strokeDasharray={`${result.similarity_score}, 100`} strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold">
                {result.similarity_score}%
              </div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{result.originality_level}</div>
              <p className="text-gray-500 text-sm mt-1">{result.analysis}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Suggestions for Improvement:</h4>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default OriginalityAnalyzer;
