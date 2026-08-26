import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, GitBranch, Calendar, AlertCircle, CheckCircle, XCircle, Code, ShieldAlert } from 'lucide-react';

const mockSubmissions = {
  'sub-1': {
    id: 'sub-1',
    assignmentId: 'assign-2',
    assignmentTitle: 'Binary Search Tree Implementation',
    commitHash: 'a1b2c3d',
    timestamp: '2026-08-26T22:15:00Z',
    status: 'Failed tests',
    score: 60,
    compileSuccess: true,
    compilerLog: 'g++ -Wall -Werror -o main main.c\nCompilation successful.',
    testResults: [
      { id: 't-1', name: 'BST Insert', passed: true, input: 'insert 5, 3, 7\nprint', expected: '3 5 7', output: '3 5 7' },
      { id: 't-2', name: 'BST Search', passed: true, input: 'insert 5, 3, 7\nsearch 3', expected: 'found', output: 'found' },
      { id: 't-3', name: 'BST Delete Leaf Node', passed: true, input: 'insert 5, 3, 7\ndelete 3\nprint', expected: '5 7', output: '5 7' },
      { id: 't-4', name: 'BST Delete Node with Two Children', passed: false, input: 'insert 5, 3, 7, 2, 4\ndelete 3\nprint', expected: '2 4 5 7', output: '2 5 7' },
      { id: 't-5', name: 'Memory leaks check', passed: false, input: 'run under valgrind', expected: 'no memory leaks', output: 'HEAP SUMMARY: in use at exit: 24 bytes in 1 blocks' },
    ]
  },
  'sub-2': {
    id: 'sub-2',
    assignmentId: 'assign-1',
    assignmentTitle: 'Pointers and Memory Allocation in C',
    commitHash: 'f4e3d2c',
    timestamp: '2026-08-25T18:30:00Z',
    status: 'Passed',
    score: 100,
    compileSuccess: true,
    compilerLog: 'g++ -Wall -Werror -o main main.c\nCompilation successful.',
    testResults: [
      { id: 't-1', name: 'Malloc wrapper allocation', passed: true, input: 'alloc 10\nprint_stats', expected: 'allocated: 10', output: 'allocated: 10' },
      { id: 't-2', name: 'Free wrapper deallocation', passed: true, input: 'alloc 10\nfree\nprint_stats', expected: 'allocated: 0', output: 'allocated: 0' },
      { id: 't-3', name: 'Double free detection', passed: true, input: 'alloc 10\nfree\nfree', expected: 'error: double free detected', output: 'error: double free detected' },
      { id: 't-4', name: 'Valgrind clean run', passed: true, input: 'valgrind --leak-check=full', expected: 'no leaks', output: 'no leaks' },
    ]
  },
  'sub-3': {
    id: 'sub-3',
    assignmentId: 'assign-1',
    assignmentTitle: 'Pointers and Memory Allocation in C',
    commitHash: '9a8b7c6',
    timestamp: '2026-08-25T17:45:00Z',
    status: 'Syntax error',
    score: 0,
    compileSuccess: false,
    compilerLog: `main.c: In function 'main':\nmain.c:12:5: error: expected ';' before 'return'\n   12 |     return 0\n      |     ^~~~~~\n      |     ;`,
    testResults: []
  }
};

const getStatusDetails = (status) => {
  switch (status) {
    case 'Passed':
      return {
        badge: <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Passed</span>,
        color: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
        message: 'Your code compiled successfully and passed all automated test cases.'
      };
    case 'Failed tests':
      return {
        badge: <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">Failed tests</span>,
        color: 'border-rose-200 bg-rose-50 text-rose-800',
        icon: <XCircle className="w-5 h-5 text-rose-500" />,
        message: 'Your code compiled successfully, but some functionality test cases failed. Review outputs below.'
      };
    case 'Syntax error':
      return {
        badge: <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Syntax error</span>,
        color: 'border-amber-200 bg-amber-50 text-amber-800',
        icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
        message: 'Compilation failed. Look at the compiler output below to fix your code.'
      };
    default:
      return {
        badge: <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Queued</span>,
        color: 'border-blue-200 bg-blue-50 text-blue-800',
        icon: <Clock className="w-5 h-5 text-blue-500" />,
        message: 'Your submission is queued and waiting to be compiled and graded.'
      };
  }
};

const SubmissionDetails = () => {
  const { id } = useParams();
  const sub = mockSubmissions[id] || {
    assignmentTitle: 'Unknown Submission',
    commitHash: '',
    timestamp: '',
    status: 'Queued',
    score: 0,
    compileSuccess: false,
    compilerLog: '',
    testResults: []
  };

  const details = getStatusDetails(sub.status);

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Back button */}
      <Link to={`/assignments/${sub.assignmentId}`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Assignment
      </Link>

      <div className="space-y-6">
        {/* Header Block */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{sub.assignmentTitle}</span>
            <h2 className="text-xl font-bold text-slate-900">Submission Result</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Submitted: {sub.timestamp ? new Date(sub.timestamp).toLocaleString() : 'N/A'}
              </span>
              <span className="flex items-center gap-1 font-mono bg-slate-50 px-1.5 py-0.5 rounded border">
                <GitBranch className="w-3 h-3 text-slate-400" />
                Commit: {sub.commitHash}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">Grade Score</div>
              <div className="text-2xl font-extrabold text-slate-900">{sub.score}/100</div>
            </div>
            {details.badge}
          </div>
        </div>

        {/* Status Message */}
        <div className={`border rounded-xl p-4 flex gap-3 items-start ${details.color}`}>
          {details.icon}
          <div className="text-sm">
            <p className="font-semibold">Status: {sub.status}</p>
            <p className="mt-0.5 opacity-90">{details.message}</p>
          </div>
        </div>

        {/* Compiler logs */}
        <div className="bg-slate-900 text-white rounded-xl border border-slate-800 overflow-hidden">
          <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Code className="w-4 h-4 text-indigo-400" />
              COMPILER LOG (stderr/stdout)
            </div>
            <span className="text-[10px] text-slate-500 font-mono">gcc -Wall -Werror</span>
          </div>
          <pre className="p-4 overflow-x-auto font-mono text-xs text-slate-300 leading-relaxed max-h-[300px]">
            {sub.compilerLog || 'No compiler logs.'}
          </pre>
        </div>

        {/* Test Cases Results */}
        {sub.compileSuccess && sub.testResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Functional Test Cases</h3>
            
            <div className="space-y-4">
              {sub.testResults.map((test) => (
                <div key={test.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  {/* Test case header */}
                  <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-sm">{test.name}</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${test.passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {test.passed ? (
                        <>
                          <CheckCircle className="w-4 h-4" /> Passed
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" /> Failed
                        </>
                      )}
                    </span>
                  </div>
                  
                  {/* Test details */}
                  <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Test Input</div>
                      <pre className="bg-slate-50 border rounded p-2.5 overflow-x-auto text-slate-700 font-mono whitespace-pre-wrap">{test.input}</pre>
                    </div>
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Expected Output</div>
                      <pre className="bg-slate-50 border rounded p-2.5 overflow-x-auto text-slate-700 font-mono whitespace-pre-wrap">{test.expected}</pre>
                    </div>
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Student Program Output</div>
                      <pre className={`border rounded p-2.5 overflow-x-auto font-mono whitespace-pre-wrap ${test.passed ? 'bg-emerald-50/30 border-emerald-100 text-emerald-800' : 'bg-rose-50/30 border-rose-100 text-rose-800 font-semibold'}`}>{test.output}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionDetails;
