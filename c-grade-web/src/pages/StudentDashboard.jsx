import React from 'react';
import { BookOpen, CheckCircle, Clock, ExternalLink, GitBranch, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockStudentData = {
  name: 'John Doe',
  avatarUrl: 'https://avatars.githubusercontent.com/u/9919?v=4',
  stats: {
    totalAssignments: 4,
    completed: 2,
    averageCorrectness: 88,
    pending: 1,
  },
  assignments: [
    {
      id: 'assign-1',
      title: 'Pointers and Memory Allocation in C',
      deadline: '2026-09-01T23:59:59Z',
      repoName: 'pointers-assignment-johndoe',
      status: 'Passed',
      score: 100,
    },
    {
      id: 'assign-2',
      title: 'Binary Search Tree Implementation',
      deadline: '2026-09-10T23:59:59Z',
      repoName: 'bst-assignment-johndoe',
      status: 'Failed tests',
      score: 60,
    },
    {
      id: 'assign-3',
      title: 'Graph Traversal (BFS & DFS)',
      deadline: '2026-09-20T23:59:59Z',
      repoName: 'graphs-assignment-johndoe',
      status: 'Queued',
      score: 0,
    },
    {
      id: 'assign-4',
      title: 'Heap Sort Implementation',
      deadline: '2026-09-30T23:59:59Z',
      repoName: 'heap-sort-assignment-johndoe',
      status: 'Not started',
      score: 0,
    },
  ],
  submissions: [
    {
      id: 'sub-1',
      assignmentTitle: 'Binary Search Tree Implementation',
      commitHash: 'a1b2c3d',
      timestamp: '2026-08-26T22:15:00Z',
      status: 'Failed tests',
      score: 60,
    },
    {
      id: 'sub-2',
      assignmentTitle: 'Pointers and Memory Allocation in C',
      commitHash: 'f4e3d2c',
      timestamp: '2026-08-25T18:30:00Z',
      status: 'Passed',
      score: 100,
    },
    {
      id: 'sub-3',
      assignmentTitle: 'Pointers and Memory Allocation in C',
      commitHash: '9a8b7c6',
      timestamp: '2026-08-25T17:45:00Z',
      status: 'Syntax error',
      score: 0,
    },
  ]
};

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
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Greeting Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img
            src={mockStudentData.avatarUrl}
            alt={mockStudentData.name}
            className="w-16 h-16 rounded-full border-2 border-indigo-100 shadow-inner"
          />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Welcome back, {mockStudentData.name}!</h2>
            <p className="text-slate-500 text-sm">Monitor your C & DSA assignment submissions and grading feedback.</p>
          </div>
        </div>
        <div className="hidden sm:block">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Student Profile</span>
          <div className="flex items-center gap-1.5 mt-1 text-slate-600 font-medium">
            <GitBranch className="w-4 h-4 text-indigo-500" />
            github.com/{mockStudentData.name.toLowerCase().replace(' ', '')}
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
            <h3 className="text-2xl font-bold text-slate-800">{mockStudentData.stats.totalAssignments}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</p>
            <h3 className="text-2xl font-bold text-slate-800">{mockStudentData.stats.completed}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending</p>
            <h3 className="text-2xl font-bold text-slate-800">{mockStudentData.stats.pending}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Correctness</p>
            <h3 className="text-2xl font-bold text-slate-800">{mockStudentData.stats.averageCorrectness}%</h3>
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

          <div className="space-y-4">
            {mockStudentData.assignments.map((assignment) => (
              <div key={assignment.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Link to={`/assignments/${assignment.id}`} className="font-bold text-slate-800 hover:text-indigo-600 transition-colors">
                      {assignment.title}
                    </Link>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Due: {new Date(assignment.deadline).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-3.5 h-3.5" />
                        {assignment.repoName}
                      </span>
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
        </div>

        {/* Recent Submissions */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Recent Submissions</h3>
          
          <div className="space-y-4">
            {mockStudentData.submissions.map((sub) => (
              <div key={sub.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate max-w-[150px]">
                      {sub.assignmentTitle}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 font-mono bg-slate-50 px-1.5 py-0.5 rounded border w-fit">
                      <GitBranch className="w-3 h-3 text-slate-400" />
                      {sub.commitHash}
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
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
