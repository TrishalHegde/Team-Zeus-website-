import React, { useState } from 'react';
import { Search, Filter, ShieldAlert, CheckCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockStudents = [
  { id: '1', name: 'Alice Johnson', github: 'alicej', avatar: 'https://avatars.githubusercontent.com/u/9919?v=4', submissionsCount: 6, avgScore: 84, status: 'Review recommended' },
  { id: '2', name: 'Bob Smith', github: 'bobsmith', avatar: 'https://avatars.githubusercontent.com/u/9920?v=4', submissionsCount: 4, avgScore: 72, status: 'Review recommended' },
  { id: '3', name: 'Charlie Brown', github: 'charliebr', avatar: 'https://avatars.githubusercontent.com/u/9921?v=4', submissionsCount: 5, avgScore: 95, status: 'Clean' },
  { id: '4', name: 'David Lee', github: 'davidl', avatar: 'https://avatars.githubusercontent.com/u/9922?v=4', submissionsCount: 3, avgScore: 68, status: 'Clean' },
  { id: '5', name: 'Emma Watson', github: 'emmaw', avatar: 'https://avatars.githubusercontent.com/u/9923?v=4', submissionsCount: 8, avgScore: 89, status: 'Clean' },
];

const AdminStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.github.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || student.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Student Directory</h2>
        <p className="text-slate-500 text-sm">Monitor student-specific metrics, submission behavior, and code cleanliness.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search students by name or GitHub username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 border-slate-200 text-sm text-slate-800"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-slate-50 border-slate-200 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Review recommended">Review Recommended</option>
            <option value="Clean">Clean</option>
          </select>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full border-collapse text-left text-sm text-slate-500">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-700 uppercase tracking-wider border-b">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">GitHub Username</th>
              <th className="px-6 py-4">Submissions</th>
              <th className="px-6 py-4">Average Score</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                  No students found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full" />
                    <span className="font-semibold text-slate-900">{student.name}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{student.github}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{student.submissionsCount}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{student.avgScore}%</span>
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 hidden sm:block">
                        <div
                          className={`h-1.5 rounded-full ${student.avgScore >= 80 ? 'bg-emerald-500' : student.avgScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${student.avgScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {student.status === 'Review recommended' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-100">
                        <ShieldAlert className="w-3.5 h-3.5" /> Review recommended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                        <CheckCircle className="w-3.5 h-3.5" /> Clean
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/admin/submissions?student=${student.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-850"
                    >
                      Submissions <ExternalLink className="w-3 h-3" />
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

export default AdminStudents;
