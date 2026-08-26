import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, GitBranch, Calendar, Code, FileText, CheckCircle2, AlertTriangle, Check, X } from 'lucide-react';

const mockFlaggedSubmissions = {
  'sub-flag-1': {
    id: 'sub-flag-1',
    studentName: 'Alice Johnson',
    assignmentTitle: 'Binary Search Tree Implementation',
    timestamp: '2026-08-26T21:40:00Z',
    commitHash: 'b45c2ef',
    score: 60,
    status: 'Failed tests',
    suspicionReason: 'Unusually high commit frequency (5 commits in 6 minutes)',
    evidence: {
      timeSinceLastCommit: '1m 15s',
      totalCommitsToday: 12,
      linesAdded: 84,
      linesDeleted: 2,
    },
    codeContent: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* left;
    struct Node* right;
};

// Copy-pasted BST deletion logic without understanding free()
struct Node* deleteNode(struct Node* root, int key) {
    if (root == NULL) return root;
    if (key < root->data)
        root->left = deleteNode(root->left, key);
    else if (key > root->data)
        root->right = deleteNode(root->right, key);
    else {
        if (root->left == NULL) {
            struct Node* temp = root->right;
            // Missing free(root); -> Memory leak flagged by valgrind!
            return temp;
        }
        else if (root->right == NULL) {
            struct Node* temp = root->left;
            return temp;
        }
        struct Node* temp = root->right;
        while (temp && temp->left != NULL)
            temp = temp->left;
        root->data = temp->data;
        root->right = deleteNode(root->right, temp->data);
    }
    return root;
}`
  },
  'sub-flag-2': {
    id: 'sub-flag-2',
    studentName: 'Bob Smith',
    assignmentTitle: 'Pointers and Memory Allocation in C',
    timestamp: '2026-08-25T14:10:00Z',
    commitHash: '7f3a8b2',
    score: 90,
    status: 'Passed',
    suspicionReason: 'Suspicious time-to-completion (finished assignment in 3 minutes after assignment opening)',
    evidence: {
      timeSinceLastCommit: 'N/A (First commit)',
      totalCommitsToday: 1,
      linesAdded: 145,
      linesDeleted: 0,
    },
    codeContent: `#include <stdio.h>
#include <stdlib.h>
#include "mymalloc.h"

// Entire correct solution pushed in one go
void* my_malloc(size_t size) {
    void* ptr = malloc(size);
    if(ptr) {
        // Track blocks (Mock code)
        insert_block(ptr, size);
    }
    return ptr;
}

void my_free(void* ptr) {
    if(ptr) {
        remove_block(ptr);
        free(ptr);
    }
}`
  }
};

const AdminSubmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviewAction, setReviewAction] = useState(null); // 'approved', 'flagged'

  const sub = mockFlaggedSubmissions[id] || {
    studentName: 'Unknown Student',
    assignmentTitle: 'Unknown Assignment',
    timestamp: '',
    commitHash: '',
    score: 0,
    status: 'Unknown',
    suspicionReason: 'No suspicious flags found.',
    evidence: { timeSinceLastCommit: '', totalCommitsToday: 0, linesAdded: 0, linesDeleted: 0 },
    codeContent: '// No code contents'
  };

  const handleAction = (action) => {
    setReviewAction(action);
    // In a real app, this sends a POST to the backend
  };

  return (
    <div className="space-y-8">
      {/* Back to submissions */}
      <Link to="/admin/submissions" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Submissions
      </Link>

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{sub.studentName}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{sub.assignmentTitle}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Submission Inspection</h2>
          <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(sub.timestamp).toLocaleString()}
            </span>
            <span className="flex items-center gap-1 font-mono bg-slate-50 px-1.5 py-0.5 rounded border">
              <GitBranch className="w-3 h-3 text-slate-400" />
              Commit: {sub.commitHash}
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400 font-medium">Automatic Grade</div>
          <div className="text-2xl font-extrabold text-slate-900">{sub.score}/100</div>
        </div>
      </div>

      {/* Suspicion Panel */}
      <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-5 space-y-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-amber-900">Review Recommended — Unusual Submission Pattern Detected</h3>
            <p className="text-xs text-amber-700 mt-0.5">{sub.suspicionReason}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-amber-200/50 text-xs">
          <div>
            <div className="text-slate-400">Time since last commit</div>
            <div className="font-bold text-slate-700 mt-0.5">{sub.evidence.timeSinceLastCommit}</div>
          </div>
          <div>
            <div className="text-slate-400">Total commits today</div>
            <div className="font-bold text-slate-700 mt-0.5">{sub.evidence.totalCommitsToday} commits</div>
          </div>
          <div>
            <div className="text-slate-400">Lines added</div>
            <div className="font-bold text-slate-700 mt-0.5 text-emerald-600">+{sub.evidence.linesAdded}</div>
          </div>
          <div>
            <div className="text-slate-400">Lines deleted</div>
            <div className="font-bold text-slate-700 mt-0.5 text-rose-600">-{sub.evidence.linesDeleted}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Code Viewer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Code className="w-4 h-4 text-slate-500" />
              Source Code (main.c)
            </h3>
            <span className="text-xs text-slate-400 font-mono">UTF-8 &middot; C Language</span>
          </div>

          <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-lg">
            <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              main.c
            </div>
            <pre className="p-5 overflow-x-auto text-xs text-slate-300 font-mono leading-relaxed max-h-[500px]">
              {sub.codeContent}
            </pre>
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-900">Review Actions</h3>
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            {reviewAction ? (
              <div className={`p-4 rounded-lg flex items-start gap-2.5 text-xs ${reviewAction === 'approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-rose-50 text-rose-800 border border-rose-100'}`}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <div>
                  <p className="font-bold">Submission Handled</p>
                  <p className="mt-0.5 opacity-90">
                    {reviewAction === 'approved' 
                      ? 'Grade approved. Flag dismissed and grade is now visible to student.' 
                      : 'Flag confirmed. Student will be notified and grade is suspended.'}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Review the source code and commit timelines. Decide whether to approve this score or flag it for honor code violation.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => handleAction('approved')}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg text-xs transition-colors shadow-sm"
                  >
                    <Check className="w-4 h-4" /> Approve Grade
                  </button>
                  <button
                    onClick={() => handleAction('flagged')}
                    className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 px-4 rounded-lg text-xs transition-colors shadow-sm"
                  >
                    <X className="w-4 h-4" /> Confirm Cheating Flag
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSubmissionDetails;
