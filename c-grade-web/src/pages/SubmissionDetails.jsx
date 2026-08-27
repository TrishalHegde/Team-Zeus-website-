import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, GitBranch, Calendar, AlertCircle, CheckCircle, XCircle, Code, Clock } from 'lucide-react';
import api from '../services/api';

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
        badge: <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 animate-pulse">Queued</span>,
        color: 'border-blue-200 bg-blue-50 text-blue-800',
        icon: <Clock className="w-5 h-5 text-blue-500" />,
        message: 'Your submission is queued and waiting to be compiled and graded. Refresh in a few moments.'
      };
  }
};

const SubmissionDetails = () => {
  const { id } = useParams();
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await api.get(`/api/submissions/${id}`);
        setSub(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Submission not found.');
        } else if (err.response?.status === 403) {
          setError('You do not have permission to view this submission.');
        } else {
          setError('Could not load submission details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [id]);

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
                Commit: {sub.commitHash?.substring(0, 7)}
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
            {sub.compilerLog || 'No compiler logs available.'}
          </pre>
        </div>

        {/* Test Cases Results */}
        {sub.compileSuccess && sub.testResults && sub.testResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Functional Test Cases
              <span className="ml-2 text-sm font-normal text-slate-400">
                ({sub.testResults.filter(t => t.passed).length}/{sub.testResults.length} passed)
              </span>
            </h3>

            <div className="space-y-4">
              {sub.testResults.map((test) => (
                <div key={test.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  {/* Test case header */}
                  <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-sm">{test.name}</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${test.passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {test.passed ? (
                        <><CheckCircle className="w-4 h-4" /> Passed</>
                      ) : (
                        <><XCircle className="w-4 h-4" /> Failed</>
                      )}
                    </span>
                  </div>

                  {/* Test details — only show on failure to give useful feedback */}
                  {!test.passed && (
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="space-y-1">
                        <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Expected Output</div>
                        <pre className="bg-slate-50 border rounded p-2.5 overflow-x-auto text-slate-700 font-mono whitespace-pre-wrap">{test.expected || '(empty)'}</pre>
                      </div>
                      <div className="space-y-1">
                        <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Your Program's Output</div>
                        <pre className="bg-rose-50/30 border border-rose-100 rounded p-2.5 overflow-x-auto text-rose-800 font-semibold font-mono whitespace-pre-wrap">{test.output || '(no output)'}</pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {sub.compileSuccess && sub.testResults?.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-400 text-sm">
            No test case results available for this submission.
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionDetails;
