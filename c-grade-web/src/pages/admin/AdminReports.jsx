import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, HelpCircle } from 'lucide-react';

const mockReportsData = {
  assignments: [
    { title: 'Pointers and Memory Allocation in C', submissions: 32, passRate: 85, avgScore: 88, flaggedCount: 1 },
    { title: 'Binary Search Tree Implementation', submissions: 24, passRate: 58, avgScore: 68, flaggedCount: 2 },
    { title: 'Graph Traversal (BFS & DFS)', submissions: 0, passRate: 0, avgScore: 0, flaggedCount: 0 },
    { title: 'Heap Sort Implementation', submissions: 0, passRate: 0, avgScore: 0, flaggedCount: 0 }
  ],
  failuresSummary: [
    { name: 'Memory leaks (Valgrind)', count: 18, type: 'Runtime Warning' },
    { name: 'Segmentation fault (SIGSEGV)', count: 12, type: 'Runtime Error' },
    { name: 'Compiler syntax error', count: 9, type: 'Build Failure' },
    { name: 'Double free detection', count: 8, type: 'Runtime Error' }
  ]
};

const AdminReports = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Analytics & Reports</h2>
        <p className="text-slate-500 text-sm">Analyze class-wide performance, assignment pass distributions, and common bugs.</p>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Assignment Performance */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              Assignment Pass Rates
            </h3>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">Active Only</span>
          </div>

          <div className="space-y-5">
            {mockReportsData.assignments.filter(a => a.submissions > 0).map((assign, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="truncate max-w-[250px]">{assign.title}</span>
                  <span>{assign.passRate}% Pass Rate</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${assign.passRate >= 75 ? 'bg-emerald-500' : assign.passRate >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${assign.passRate}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono w-10 text-right">{assign.submissions} subs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Avg Grades */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Average Class Grades
            </h3>
            <span className="text-xs text-slate-400 font-medium">Out of 100 max</span>
          </div>

          <div className="space-y-5">
            {mockReportsData.assignments.filter(a => a.submissions > 0).map((assign, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{assign.title}</span>
                  <span>Avg: {assign.avgScore}/100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className="bg-indigo-600 h-3 rounded-full"
                    style={{ width: `${assign.avgScore}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown of failures */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Error and Bug Breakdown
            </h3>
            <span className="text-xs text-slate-400">Total counted across all runs</span>
          </div>

          <div className="space-y-4">
            {mockReportsData.failuresSummary.map((failure, index) => (
              <div key={index} className="flex justify-between items-center text-xs p-3 bg-slate-50 border rounded-lg hover:bg-slate-100/50 transition-colors">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-800">{failure.name}</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">{failure.type}</div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-800">{failure.count}</span>
                  <span className="text-[10px] text-slate-400 block">occurrences</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suspicion analytics summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                Honor Code Summary
              </h3>
            </div>

            <div className="py-6 space-y-4 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 font-bold text-xl">
                3
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">Suspicious patterns resolved today</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  The system detected 3 anomalies in student submissions. Make sure to review the flagged queues in the Overview tab to ensure grading integrity.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border rounded-lg p-3 text-[11px] text-slate-500 leading-relaxed">
            <strong>Note:</strong> Anomaly detection rules flag submissions that complete in less than 5 minutes or show a commit rate higher than 3 commits per minute.
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminReports;
