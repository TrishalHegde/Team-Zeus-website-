import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, History, BarChart3, BookOpen, LogOut, ArrowLeft } from 'lucide-react';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-indigo-400">C-Grade Admin</h1>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Instructor Console</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </NavLink>

          <NavLink
            to="/admin/students"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`
            }
          >
            <Users className="w-4 h-4" />
            Students
          </NavLink>

          <NavLink
            to="/admin/assignments"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`
            }
          >
            <BookOpen className="w-4 h-4" />
            Assignments
          </NavLink>

          <NavLink
            to="/admin/submissions"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`
            }
          >
            <History className="w-4 h-4" />
            Submissions
          </NavLink>

          <NavLink
            to="/admin/reports"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`
            }
          >
            <BarChart3 className="w-4 h-4" />
            Reports & Analytics
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-semibold text-indigo-400 hover:bg-slate-850 hover:text-indigo-300 transition-all border border-indigo-500/20"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            View Student View
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/20 transition-all">
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">C-Grade Automator</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-sm">
              IN
            </div>
            <span className="text-sm font-medium text-slate-700">Instructor Account</span>
          </div>
        </header>
        <div className="p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
