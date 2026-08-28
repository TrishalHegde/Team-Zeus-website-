import React, { useEffect, useState } from 'react';
import { Plus, BookOpen, Calendar, GitBranch, FolderOpen, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

const AdminAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    folder_name: '',
    deadline: '',
    template_repo_url: '',
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/assignments');
      setAssignments(res.data);
    } catch (err) {
      console.error('Failed to load assignments:', err);
      setError('Could not load assignments. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!formData.title.trim()) {
      setFormError('Assignment title is required.');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      folder_name: formData.folder_name.trim().toLowerCase().replace(/\s+/g, '-') || null,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      template_repo_url: formData.template_repo_url.trim() || null,
    };

    try {
      setSubmitting(true);
      await api.post('/api/assignments', payload);
      setFormSuccess('Assignment created successfully!');
      setFormData({ title: '', folder_name: '', deadline: '', template_repo_url: '' });
      fetchAssignments(); // Refresh list
      setTimeout(() => {
        setShowModal(false);
        setFormSuccess(null);
      }, 1500);
    } catch (err) {
      console.error('Failed to create assignment:', err);
      setFormError(err.response?.data?.detail || 'Failed to create assignment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ title: '', folder_name: '', deadline: '', template_repo_url: '' });
    setFormError(null);
    setFormSuccess(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Assignments</h2>
          <p className="text-slate-500 text-sm mt-1">Manage all assignments for your class.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          New Assignment
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-xl p-5 text-rose-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Assignment List */}
      {!loading && !error && (
        <>
          {assignments.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
              <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="font-semibold text-slate-700">No assignments yet</p>
              <p className="text-sm mt-1">Click "New Assignment" to create your first one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all duration-200 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-800 text-base leading-snug">{assignment.title}</h3>
                    {assignment.folder_name && (
                      <code className="shrink-0 text-xs font-mono bg-indigo-50 text-indigo-700 border border-indigo-100 rounded px-2 py-0.5">
                        {assignment.folder_name}/
                      </code>
                    )}
                  </div>

                  {assignment.deadline && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>Due: {new Date(assignment.deadline).toLocaleString()}</span>
                    </div>
                  )}

                  {assignment.template_repo_url && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <GitBranch className="w-3.5 h-3.5 shrink-0" />
                      <a
                        href={assignment.template_repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline truncate"
                      >
                        {assignment.template_repo_url.replace('https://github.com/', '')}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 space-y-6 relative animate-fade-in">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Create New Assignment</h3>
              <p className="text-sm text-slate-500 mt-1">Fill in the details below to publish a new assignment.</p>
            </div>

            {formError && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 text-rose-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-emerald-700 text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Folder Name */}
              <div className="space-y-1.5">
                <label htmlFor="folder_name" className="block text-sm font-semibold text-slate-700">
                  Folder Name <span className="text-rose-500">*</span>
                  <span className="ml-1 text-xs font-normal text-slate-400">(the folder students push to, e.g. "lab1")</span>
                </label>
                <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-4 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition">
                  <FolderOpen className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    id="folder_name"
                    name="folder_name"
                    type="text"
                    value={formData.folder_name}
                    onChange={handleChange}
                    placeholder="e.g. lab1"
                    className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                  />
                </div>
                <p className="text-xs text-slate-400">Students will push their code to <code className="bg-slate-100 px-1 rounded">{formData.folder_name || 'folder-name'}/{'{'}their-github-username{'}'}/main.c</code></p>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label htmlFor="title" className="block text-sm font-semibold text-slate-700">
                  Assignment Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Lab 1: Hello World in C"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              {/* Deadline */}
              <div className="space-y-1.5">
                <label htmlFor="deadline" className="block text-sm font-semibold text-slate-700">
                  Deadline <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  id="deadline"
                  name="deadline"
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              {/* Template Repo URL */}
              <div className="space-y-1.5">
                <label htmlFor="template_repo_url" className="block text-sm font-semibold text-slate-700">
                  Template Repository URL <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  id="template_repo_url"
                  name="template_repo_url"
                  type="url"
                  value={formData.template_repo_url}
                  onChange={handleChange}
                  placeholder="https://github.com/your-org/assignment-template"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow transition-all"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {submitting ? 'Creating...' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAssignments;
