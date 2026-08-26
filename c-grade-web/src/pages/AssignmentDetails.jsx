import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, ExternalLink, GitBranch, AlertTriangle, CheckCircle, FileCode } from 'lucide-react';

const mockAssignments = {
  'assign-1': {
    title: 'Pointers and Memory Allocation in C',
    deadline: '2026-09-01T23:59:59Z',
    repoName: 'pointers-assignment-johndoe',
    description: 'In this assignment, you will implement dynamic memory allocation algorithms (malloc and free wrappers) and debug memory leaks using Valgrind. Ensure your code compiles without warnings.',
    templateRepo: 'https://github.com/team-zeus-education/pointers-assignment-template',
    submissions: [
      { id: 'sub-2', commitHash: 'f4e3d2c', timestamp: '2026-08-25T18:30:00Z', status: 'Passed', score: 100 },
      { id: 'sub-3', commitHash: '9a8b7c6', timestamp: '2026-08-25T17:45:00Z', status: 'Syntax error', score: 0 },
    ]
  },
  'assign-2': {
    title: 'Binary Search Tree Implementation',
    deadline: '2026-09-10T23:59:59Z',
    repoName: 'bst-assignment-johndoe',
    description: 'Implement a self-balancing Binary Search Tree (AVL tree) in C. You need to implement search, insert, delete, and in-order/pre-order/post-order traversals. Performance will be graded based on time complexity.',
    templateRepo: 'https://github.com/team-zeus-education/bst-assignment-template',
    submissions: [
      { id: 'sub-1', commitHash: 'a1b2c3d', timestamp: '2026-08-26T22:15:00Z', status: 'Failed tests', score: 60 },
    ]
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'Passed':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Passed</span>;
    case 'Failed tests':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">Failed tests</span>;
    case 'Syntax error':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Syntax error</span>;
    default:
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">Queued</span>;
  }
};

const AssignmentDetails = () => {
  const { id } = useParams();
  const assignment = mockAssignments[id] || {
    title: 'Unknown Assignment',
    deadline: '',
    repoName: '',
    description: 'Assignment details could not be found.',
    templateRepo: '',
    submissions: []
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Back button */}
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">{assignment.title}</h2>
            <div className="flex flex-wrap gap-4 text-xs text-slate-500 pb-4 border-b border-slate-100">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-slate-400" />
                Due: {assignment.deadline ? new Date(assignment.deadline).toLocaleString() : 'N/A'}
              </span>
              <span className="flex items-center gap-1">
                <GitBranch className="w-4 h-4 text-slate-400" />
                Repo: {assignment.repoName || 'Not assigned'}
              </span>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Instructions</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{assignment.description}</p>
            </div>

            {assignment.templateRepo && (
              <div className="pt-2">
                <a
                  href={assignment.templateRepo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  View Template Repository <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          {/* Submission Instructions */}
          <div className="bg-slate-900 text-white rounded-xl p-6 space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-indigo-400">
              <FileCode className="w-5 h-5" />
              How to Submit your Code
            </h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-300">
              <li>Clone your assigned repository to your local machine.</li>
              <li>Write your solution inside <code className="bg-slate-800 text-indigo-300 px-1 py-0.5 rounded font-mono text-xs">main.c</code>.</li>
              <li>Commit your changes and push to GitHub.</li>
              <li>Our automated grading system will trigger and update your results below.</li>
            </ol>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs flex gap-2.5 items-start text-slate-400">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-300">Strict Rules:</strong> The code is compiled with <code className="bg-slate-950 px-1 py-0.5 rounded text-rose-300">gcc -Wall -Werror</code>. Ensure you have no warnings or errors, otherwise compilation will fail instantly.
              </div>
            </div>
          </div>
        </div>

        {/* Submissions Sidebar */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Submission History</h3>
          
          {assignment.submissions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500 text-sm">
              No submissions yet. Push your first commit to GitHub!
            </div>
          ) : (
            <div className="space-y-4">
              {assignment.submissions.map((sub, idx) => (
                <div key={sub.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-sm transition-all duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-xs text-slate-400">Attempt #{assignment.submissions.length - idx}</div>
                      <Link to={`/submissions/${sub.id}`} className="text-xs font-mono text-indigo-600 hover:underline block mt-0.5">
                        Commit: {sub.commitHash}
                      </Link>
                    </div>
                    {getStatusBadge(sub.status)}
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>{new Date(sub.timestamp).toLocaleDateString()}</span>
                    {sub.status !== 'Syntax error' && (
                      <span className="font-semibold text-slate-800">Score: {sub.score}/100</span>
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

export default AssignmentDetails;
