import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function LiveQuizStudent() {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Poll for active quiz
  useEffect(() => {
    const fetchActiveQuiz = async () => {
      try {
        const res = await api.get('/api/quizzes/active');
        // If it's a new quiz that just became active, reset state
        if (!activeQuiz || activeQuiz.id !== res.data.id) {
          setActiveQuiz(res.data);
          setSelectedOption(null);
          setSubmitted(false);
          setError(null);
        }
      } catch (e) {
        if (e.response?.status === 404) {
          setActiveQuiz(null);
        }
      }
    };

    fetchActiveQuiz();
    const interval = setInterval(fetchActiveQuiz, 3000);
    return () => clearInterval(interval);
  }, [activeQuiz]);

  const handleSubmit = async () => {
    if (!selectedOption) return;
    try {
      await api.post(`/api/quizzes/${activeQuiz.id}/submit`, {
        quiz_id: activeQuiz.id,
        question_id: activeQuiz.questions[0].id,
        chosen_answer: selectedOption
      });
      setSubmitted(true);
    } catch (e) {
      if (e.response?.data?.detail) {
        setError(e.response.data.detail);
      } else {
        setError("Error submitting answer.");
      }
    }
  };

  if (!activeQuiz) {
    return (
      <div className="h-[calc(100vh-100px)] flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-12 h-12 text-slate-300 animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Waiting for Teacher</h2>
        <p className="text-slate-500 mt-2 max-w-md">
          There is no live quiz active at the moment. When the instructor starts a quiz, it will automatically appear here.
        </p>
      </div>
    );
  }

  const question = activeQuiz.questions[0];
  let options = [];
  try {
    options = JSON.parse(question.options);
  } catch (e) {
    options = [];
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 mt-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-100 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-rose-100 text-rose-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider animate-pulse">
              LIVE
            </span>
            <h1 className="text-sm font-semibold text-slate-500">{activeQuiz.title}</h1>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 leading-tight">
            {question.text}
          </h2>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-emerald-800 mb-2">Answer Submitted!</h3>
              <p className="text-emerald-600">Waiting for the teacher to end the quiz and discuss the results.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedOption(opt)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                    selectedOption === opt 
                      ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                      : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      selectedOption === opt ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {String.fromCharCode(65+i)}
                    </div>
                    <span className="text-lg font-medium text-slate-700">{opt}</span>
                  </div>
                </button>
              ))}

              {error && <p className="text-rose-500 text-sm font-medium mt-2">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className="w-full mt-8 bg-indigo-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
              >
                Submit Answer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
