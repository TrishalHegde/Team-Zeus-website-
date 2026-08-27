import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle, Clock, ExternalLink, GitBranch, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const getStatusBadge = (status) => {
  switch (status) {
    case 'Passed':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Passed</span>;
    case 'Failed tests':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">Failed tests</span>;
    case 'Queued':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 animate-pulse">Queued</span>;
    case 'Syntax error':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Syntax error</span>;
    default:
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">Not started</span>;
  }
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchDashboard = async () => {
      try {
        const response = await api.get(`/api/students/${user.id}/dashboard`);
        setData(response.data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError('Could not load your dashboard. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-xl p-5 text-rose-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const { student, stats, assignments, submissions } = data;

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Greeting Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {student.avatar_url && (
            <img
              src={student.avatar_url}
              alt={student.github_id}
              className="w-16 h-16 rounded-full border-2 border-indigo-100 shadow-inner"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Welcome back, {user.username || student.github_id}!</h2>
            <p className="text-slate-500 text-sm">Monitor your C & DSA assignment submissions and grading feedback.</p>
          </div>
        </div>
        <div className="hidden sm:block">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Student Profile</span>
          <div className="flex items-center gap-1.5 mt-1 text-slate-600 font-medium">
            <GitBranch className="w-4 h-4 text-indigo-500" />
            github.com/{student.github_id}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assignments</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.totalAssignments}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.completed}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.pending}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Correctness</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.averageCorrectness}%</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assignments List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Assignments</h3>
            <span className="text-xs text-slate-400">Sorted by deadline</span>
          </div>

          {assignments.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-sm">
              No assignments have been posted yet.
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <Link to={`/assignments/${assignment.id}`} className="font-bold text-slate-800 hover:text-indigo-600 transition-colors">
                        {assignment.title}
                      </Link>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Due: {new Date(assignment.deadline).toLocaleDateString()}</span>
                        {assignment.template_repo_url && (
                          <a href={assignment.template_repo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-indigo-500">
                            <GitBranch className="w-3.5 h-3.5" />
                            View Repo
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                      {assignment.status !== 'Not started' && (
                        <div className="text-right">
                          <div className="text-xs text-slate-400 font-medium">Score</div>
                          <div className="text-sm font-bold text-slate-800">{assignment.score}/100</div>
                        </div>
                      )}
                      {getStatusBadge(assignment.status)}
                      <Link
                        to={`/assignments/${assignment.id}`}
                        className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Submissions */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Recent Submissions</h3>

          {submissions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-sm">
              No submissions yet. Push your C code to get started!
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => (
                <div key={sub.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate max-w-[150px]">
                        {sub.assignment_title}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 font-mono bg-slate-50 px-1.5 py-0.5 rounded border w-fit">
                        <GitBranch className="w-3 h-3 text-slate-400" />
                        {sub.commit_hash?.substring(0, 7)}
                      </div>
                    </div>
                    {getStatusBadge(sub.status)}
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>{new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {sub.status !== 'Syntax error' && (
                      <span className="font-semibold text-slate-700">Score: {sub.score}/100</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
