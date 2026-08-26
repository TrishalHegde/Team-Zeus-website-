import React, { useState } from 'react';
import { Search, Filter, ShieldAlert, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const mockSubmissions = [
  { id: 'sub-1', studentName: 'Alice Johnson', studentId: '1', assignmentTitle: 'Binary Search Tree Implementation', timestamp: '2026-08-26T22:15:00Z', score: 60, status: 'Failed tests', reviewStatus: 'Review recommended' },
  { id: 'sub-2', studentName: 'John Doe', studentId: '99', assignmentTitle: 'Pointers and Memory Allocation in C', timestamp: '2026-08-25T18:30:00Z', score: 100, status: 'Passed', reviewStatus: 'Clean' },
  { id: 'sub-3', studentName: 'John Doe', studentId: '99', assignmentTitle: 'Pointers and Memory Allocation in C', timestamp: '2026-08-25T17:45:00Z', score: 0, status: 'Syntax error', reviewStatus: 'Clean' },
  { id: 'sub-4', studentName: 'Bob Smith', studentId: '2', assignmentTitle: 'Pointers and Memory Allocation in C', timestamp: '2026-08-25T14:10:00Z', score: 90, status: 'Passed', reviewStatus: 'Review recommended' },
  { id: 'sub-5', studentName: 'Charlie Brown', studentId: '3', assignmentTitle: 'Binary Search Tree Implementation', timestamp: '2026-08-24T09:12:00Z', score: 95, status: 'Passed', reviewStatus: 'Clean' },
];

const getStatusBadge = (status) => {
  switch (status) {
    case 'Passed':
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800"><CheckCircle className="w-3 h-3" /> Passed</span>;
    case 'Failed tests':
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800"><XCircle className="w-3 h-3" /> Failed tests</span>;
    case 'Syntax error':
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800"><AlertCircle className="w-3 h-3" /> Syntax error</span>;
    default:
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 animate-pulse"><Clock className="w-3 h-3" /> Queued</span>;
  }
};

const AdminSubmissions = () => {
  const [searchParams] = useSearchParams();
  const studentFilterParam = searchParams.get('student') || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [assignmentFilter, setAssignmentFilter] = useState('All');
  const [reviewFilter, setReviewFilter] = useState('All');

  const filteredSubmissions = mockSubmissions.filter(sub => {
    const matchesSearch = sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (studentFilterParam && sub.studentId === studentFilterParam);
    const matchesAssignment = assignmentFilter === 'All' || sub.assignmentTitle === assignmentFilter;
    const matchesReview = reviewFilter === 'All' || sub.reviewStatus === reviewFilter;
    return matchesSearch && matchesAssignment && matchesReview;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Submission & Grading History</h2>
          <p className="text-slate-500 text-sm">Real-time log of compiling and testing results, including potential flag reviews.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Search Student</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 border-slate-200 text-xs text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assignment</label>
          <select
            value={assignmentFilter}
            onChange={(e) => setAssignmentFilter(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-slate-50 border-slate-200 text-xs text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="All">All Assignments</option>
            <option value="Pointers and Memory Allocation in C">Pointers and Memory Allocation in C</option>
            <option value="Binary Search Tree Implementation">Binary Search Tree Implementation</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Review Flag</label>
          <select
            value={reviewFilter}
            onChange={(e) => setReviewFilter(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-slate-50 border-slate-200 text-xs text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="All">All Items</option>
            <option value="Review recommended">Review Recommended</option>
            <option value="Clean">Clean</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full border-collapse text-left text-sm text-slate-500">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-700 uppercase tracking-wider border-b">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Assignment</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4">Review Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                  No submissions found matching criteria.
                </td>
              </tr>
            ) : (
              filteredSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{sub.studentName}</td>
                  <td className="px-6 py-4 max-w-[200px] truncate">{sub.assignmentTitle}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">{new Date(sub.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4">{getStatusBadge(sub.status)}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{sub.status === 'Syntax error' ? '-' : `${sub.score}/100`}</td>
                  <td className="px-6 py-4">
                    {sub.reviewStatus === 'Review recommended' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Review Recommended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                        <CheckCircle className="w-3.5 h-3.5 text-slate-400" /> Clean
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/admin/submissions/${sub.id}`}
                      className="font-bold text-indigo-600 hover:text-indigo-850 text-xs"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSubmissions;
