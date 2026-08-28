import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle, Clock, ExternalLink, GitBranch, AlertCircle, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const getStatusBadge = (status) => {
  switch (status) {
    case 'Passed':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">✅ Passed</span>;
    case 'Failed tests':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">❌ Failed tests</span>;
    case 'Queued':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 animate-pulse">⏳ Grading...</span>;
    case 'Syntax error':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">⚠️ Syntax error</span>;
    default:
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">— Not submitted</span>;
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
    <div className="container mx-auto px-6 py-8 space-y-8">

      {/* Greeting Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          {student.avatar_url && (
            <img
              src={student.avatar_url}
              alt={student.github_id}
              className="w-16 h-16 rounded-full border-2 border-indigo-100 shadow-inner"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Welcome, {user.username || student.github_id}!</h2>
            <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
              <GitBranch className="w-3.5 h-3.5 text-indigo-500" />
              github.com/{student.github_id}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assignments</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.totalAssignments}</h3>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Passed</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.completed}</h3>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.pending}</h3>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Score</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.averageCorrectness}%</h3>
          </div>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Your Assignments & Grades</h3>

        {assignments.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500 text-sm">
            No assignments posted yet. Check back soon!
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Assignment</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Folder</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Deadline</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {assignment.title}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      {assignment.folder_name ? (
                        <code className="text-xs bg-slate-100 border border-slate-200 px-2 py-1 rounded text-indigo-700 font-mono">
                          {assignment.folder_name}/
                        </code>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-500 hidden md:table-cell">
                      {assignment.deadline
                        ? new Date(assignment.deadline).toLocaleDateString()
                        : <span className="text-slate-400">No deadline</span>}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-700">
                      {assignment.status !== 'Not started' ? `${assignment.score}/100` : '—'}
                    </td>
                    <td className="px-5 py-4">
                      {getStatusBadge(assignment.status)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/assignments/${assignment.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        Details <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* How to Submit — simple, always visible */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 space-y-3">
        <h3 className="font-bold text-indigo-900 text-base">📌 How to Submit</h3>
        <ol className="space-y-2 text-sm text-indigo-800 list-decimal list-inside">
          <li>Clone the Team Zeus submissions repo (do this once)</li>
          <li>
            Navigate into the assignment folder shown above (e.g.{' '}
            <code className="bg-indigo-100 px-1.5 py-0.5 rounded font-mono text-indigo-700">lab1/</code>)
          </li>
          <li>
            Create a subfolder with your exact GitHub username and put your{' '}
            <code className="bg-indigo-100 px-1.5 py-0.5 rounded font-mono text-indigo-700">main.c</code> inside it
          </li>
          <li>
            <code className="bg-indigo-100 px-1.5 py-0.5 rounded font-mono text-indigo-700">git push</code> — grading runs automatically!
          </li>
        </ol>
        <p className="text-xs text-indigo-600 font-medium mt-2">
          Your grade will appear on this page within a minute of pushing.
        </p>
      </div>

    </div>
  );
};

export default StudentDashboard;
