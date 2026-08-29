import React, { useState, useEffect } from 'react';
import { Play, Square, Plus, Trash2, Users } from 'lucide-react';
import api from '../../services/api';

export default function LiveQuizTeacher() {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correct_answer: ''
  });

  const [results, setResults] = useState(null);

  useEffect(() => {
    // In a real app, you'd fetch pending quizzes here. 
    // We'll just manage the active one for simplicity.
    fetchActiveQuiz();
  }, []);

  const fetchActiveQuiz = async () => {
    try {
      const res = await api.get('/api/quizzes/active');
      setActiveQuiz(res.data);
      if (res.data) fetchResults(res.data.id);
    } catch (e) {
      if (e.response?.status !== 404) console.error("Error fetching active quiz", e);
      setActiveQuiz(null);
    }
  };

  const fetchResults = async (quizId) => {
    try {
      const res = await api.get(`/api/quizzes/${quizId}/results`);
      setResults(res.data.results);
    } catch (e) {
      console.error("Error fetching results", e);
    }
  };

  const handleCreateQuiz = async () => {
    if (!newQuizTitle || !newQuestion.text || !newQuestion.correct_answer) {
      alert("Please fill all required fields");
      return;
    }
    
    try {
      const payload = {
        title: newQuizTitle,
        status: "pending",
        questions: [
          {
            text: newQuestion.text,
            options: JSON.stringify(newQuestion.options.filter(o => o.trim() !== '')),
            correct_answer: newQuestion.correct_answer
          }
        ]
      };
      const res = await api.post('/api/quizzes/', payload);
      setQuizzes([...quizzes, res.data]);
      setNewQuizTitle('');
      setNewQuestion({ text: '', options: ['', '', '', ''], correct_answer: '' });
      alert("Quiz created!");
    } catch (e) {
      console.error(e);
      alert("Error creating quiz");
    }
  };

  const handleStartQuiz = async (quizId) => {
    try {
      await api.post(`/api/quizzes/${quizId}/start`);
      fetchActiveQuiz();
    } catch (e) {
      console.error(e);
    }
  };

  const handleStopQuiz = async (quizId) => {
    try {
      await api.post(`/api/quizzes/${quizId}/stop`);
      fetchActiveQuiz();
      setResults(null);
    } catch (e) {
      console.error(e);
    }
  };

  // Poll for results if active
  useEffect(() => {
    let interval;
    if (activeQuiz) {
      interval = setInterval(() => {
        fetchResults(activeQuiz.id);
      }, 3000); // Polling every 3 seconds
    }
    return () => clearInterval(interval);
  }, [activeQuiz]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Live Quizzes Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Conduct real-time quizzes in your class</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CREATE QUIZ SECTION */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-500" />
            Create Quick Question
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Quiz Title</label>
              <input 
                type="text" 
                value={newQuizTitle}
                onChange={e => setNewQuizTitle(e.target.value)}
                placeholder="e.g. Pop Quiz on Memory Allocation"
                className="w-full border border-slate-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Question Text</label>
              <textarea 
                value={newQuestion.text}
                onChange={e => setNewQuestion({...newQuestion, text: e.target.value})}
                placeholder="What does malloc return if it fails?"
                className="w-full border border-slate-300 rounded-md p-2 h-24"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Options</label>
              {newQuestion.options.map((opt, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <span className="p-2 text-sm text-slate-500 font-bold">{String.fromCharCode(65+i)}</span>
                  <input 
                    type="text"
                    value={opt}
                    onChange={e => {
                      const newOpts = [...newQuestion.options];
                      newOpts[i] = e.target.value;
                      setNewQuestion({...newQuestion, options: newOpts});
                    }}
                    placeholder={`Option ${i+1}`}
                    className="w-full border border-slate-300 rounded-md p-2 text-sm"
                  />
                  <div className="flex items-center ml-2">
                     <input 
                        type="radio" 
                        name="correct_answer" 
                        checked={newQuestion.correct_answer === opt && opt !== ''}
                        onChange={() => setNewQuestion({...newQuestion, correct_answer: opt})}
                     />
                     <span className="ml-2 text-xs text-slate-500">Correct</span>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={handleCreateQuiz}
              className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Create Quiz
            </button>
          </div>
        </div>

        {/* ACTIVE & PENDING QUIZZES SECTION */}
        <div className="space-y-8">
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-emerald-500" />
              Active Live Quiz
            </h2>
            
            {activeQuiz ? (
              <div className="bg-emerald-50 p-4 rounded-md border border-emerald-100">
                <h3 className="font-bold text-lg text-emerald-900">{activeQuiz.title}</h3>
                <p className="text-emerald-700 text-sm mb-4">Students can currently see and answer this quiz.</p>
                
                <div className="bg-white p-4 rounded-md border border-emerald-200 mb-4">
                   <h4 className="font-semibold text-slate-700 text-sm mb-2">Live Submissions:</h4>
                   {results ? Object.entries(results).map(([ans, count]) => (
                     <div key={ans} className="flex justify-between items-center border-b border-slate-100 py-2 last:border-0">
                       <span className="text-slate-600 text-sm truncate max-w-[200px]">{ans}</span>
                       <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-xs font-bold">{count}</span>
                     </div>
                   )) : (
                     <p className="text-sm text-slate-500 italic">Waiting for submissions...</p>
                   )}
                </div>

                <button 
                  onClick={() => handleStopQuiz(activeQuiz.id)}
                  className="flex items-center justify-center gap-2 w-full bg-rose-500 text-white font-semibold py-2 rounded-md hover:bg-rose-600 transition-colors"
                >
                  <Square className="w-4 h-4" /> Stop Quiz
                </button>
              </div>
            ) : (
              <p className="text-slate-500 text-sm text-center py-8">No active quiz. Start one to broadcast to students.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Pending Quizzes
            </h2>
            {quizzes.length === 0 ? (
              <p className="text-slate-500 text-sm">You haven't created any pending quizzes in this session.</p>
            ) : (
              <div className="space-y-3">
                {quizzes.map(q => (
                  <div key={q.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-md">
                    <span className="font-medium text-slate-700">{q.title}</span>
                    <button 
                      onClick={() => handleStartQuiz(q.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                      disabled={!!activeQuiz}
                    >
                      Start
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
