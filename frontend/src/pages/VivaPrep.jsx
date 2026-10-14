import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const VivaPrep = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerateQuestions = async () => {
    setGenerating(true);
    try {
      const res = await api.post(`/ai/viva/${id}/questions`);
      setQuestions(res.data.questions);
      setCurrentQuestionIndex(0);
      setEvaluation(null);
      setUserAnswer('');
    } catch (err) {
      console.error(err);
      alert('Error generating questions');
    }
    setGenerating(false);
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;
    setLoading(true);
    try {
      const currentQ = questions[currentQuestionIndex];
      const res = await api.post(`/ai/viva/evaluate/${currentQ.id}`, { answer: userAnswer });
      setEvaluation(res.data);
    } catch (err) {
      console.error(err);
      alert('Error evaluating answer');
    }
    setLoading(false);
  };

  const handleNext = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setUserAnswer('');
    setEvaluation(null);
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Viva Preparation</h2>
        <p className="text-gray-600 mb-8">Generate customized viva questions based on your project details to prepare for your final review.</p>
        <button onClick={handleGenerateQuestions} disabled={generating} className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow font-medium hover:bg-purple-700 disabled:opacity-50">
          {generating ? 'Generating Questions...' : 'Start Viva Session'}
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];
  const isFinished = currentQuestionIndex >= questions.length;

  if (isFinished) {
    return (
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Session Complete!</h2>
        <p className="text-gray-600 mb-8">You've completed all the questions for this viva session.</p>
        <Link to={`/projects/${id}`} className="text-indigo-600 font-medium hover:underline">Return to Project Workspace</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Viva Session</h1>
        <span className="text-sm font-medium text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</span>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {currentQ.category}
          </span>
        </div>
        <h2 className="text-xl font-medium text-gray-900 mb-6">{currentQ.question}</h2>

        {!evaluation ? (
          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Answer</label>
              <textarea rows={5} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:ring-purple-500 focus:border-purple-500" value={userAnswer} onChange={e => setUserAnswer(e.target.value)} placeholder="Type your answer here as if speaking..." />
            </div>
            <button type="submit" disabled={loading} className="bg-purple-600 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium hover:bg-purple-700 disabled:opacity-50">
              {loading ? 'Evaluating...' : 'Submit Answer'}
            </button>
          </form>
        ) : (
          <div className="space-y-6 border-t border-gray-200 pt-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Evaluation</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className={`text-2xl font-bold ${evaluation.score >= 8 ? 'text-green-600' : evaluation.score >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {evaluation.score}/10
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700">
                {evaluation.feedback}
              </div>
            </div>
            <button onClick={handleNext} className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700">
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VivaPrep;
