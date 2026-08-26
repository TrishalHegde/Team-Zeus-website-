import React from 'react';
import { Users, History, GraduationCap, ShieldAlert, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockOverviewStats = {
  studentCount: 28,
  submissionCount: 142,
  averageScore: 78.4,
  pendingJobs: 2,
  flaggedCount: 3
};

const mockFlaggedSubmissions = [
  {
    id: 'sub-flag-1',
    studentName: 'Alice Johnson',
    assignmentTitle: 'Binary Search Tree Implementation',
    timestamp: '2026-08-26T21:40:00Z',
    reason: 'Unusually high commit frequency (5 commits in 6 minutes)',
    status: 'Review recommended'
  },
  {
    id: 'sub-flag-2',
    studentName: 'Bob Smith',
    assignmentTitle: 'Pointers and Memory Allocation in C',
    timestamp: '2026-08-25T14:10:00Z',
    reason: 'Suspicious time-to-completion (finished assignment in 3 minutes)',
    status: 'Review recommended'
  }
];

const mockCommonFailures = [
  { id: 1, name: 'Memory leaks (Valgrind checks)', count: 18, percentage: 64 },
  { id: 2, name: 'Null Pointer Dereference (Segmentation Fault)', count: 12, percentage: 42 },
  { id: 3, name: 'Double Free Error', count: 8, percentage: 28 },
  { id: 4, name: 'Infinite loop/Time limit exceeded', count: 5, percentage: 17 }
];

const AdminOverview = () => {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Class Performance Overview</h2>
        <p className="text-slate-500 text-sm">Dashboard view of current enrollment, submission metrics, and grading quality control.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="card flex flex-col justify-between p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Students</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-slate-800">{mockOverviewStats.studentCount}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">+2 active today</p>
          </div>
        </div>

        <div className="card flex flex-col justify-between p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Submissions</span>
            <History className="w-4 h-4" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-slate-800">{mockOverviewStats.submissionCount}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Average 5.1 per student</p>
          </div>
        </div>

        <div className="card flex flex-col justify-between p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Grade</span>
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-slate-800">{mockOverviewStats.averageScore}%</h3>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5">
              <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${mockOverviewStats.averageScore}%` }}></div>
            </div>
          </div>
        </div>

        <div className="card flex flex-col justify-between p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Review Flags</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-amber-600">{mockOverviewStats.flaggedCount}</h3>
            <p className="text-xs text-amber-600 font-medium mt-1">Requires manual review</p>
          </div>
        </div>

        <div className="card flex flex-col justify-between p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Jobs</span>
            <History className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-indigo-600">{mockOverviewStats.pendingJobs}</h3>
            <p className="text-xs text-indigo-500 font-medium mt-1 animate-pulse">Running in grader...</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Anti-cheat queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              Flagged Submissions (Review Queue)
            </h3>
            <Link to="/admin/submissions" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
              View full queue
            </Link>
          </div>

          {mockFlaggedSubmissions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-sm">
              All submissions are clear. No flags raised!
            </div>
          ) : (
            <div className="space-y-4">
              {mockFlaggedSubmissions.map((flag) => (
                <div key={flag.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-amber-300 transition-all duration-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-800">{flag.studentName}</div>
                      <div className="text-xs text-slate-500">
                        Assignment: <span className="font-medium text-slate-700">{flag.assignmentTitle}</span> &middot; {new Date(flag.timestamp).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded px-2.5 py-1 mt-2 w-fit">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        {flag.reason}
                      </div>
                    </div>
                    <Link
                      to={`/admin/submissions/${flag.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-1.5 hover:bg-indigo-100 transition-all"
                    >
                      Review <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Common Failures */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Common Class Failures</h3>
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            {mockCommonFailures.map((failure) => (
              <div key={failure.id} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="truncate max-w-[200px]">{failure.name}</span>
                  <span>{failure.count} students ({failure.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${failure.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
