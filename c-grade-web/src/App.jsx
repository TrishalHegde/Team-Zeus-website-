import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';

// Import Pages
import Login from './pages/Login';
import LoginCallback from './pages/LoginCallback';
import StudentDashboard from './pages/StudentDashboard';
import AssignmentDetails from './pages/AssignmentDetails';
import SubmissionDetails from './pages/SubmissionDetails';
import LiveQuizStudent from './pages/LiveQuizStudent';

// Import Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminStudents from './pages/admin/AdminStudents';
import AdminSubmissions from './pages/admin/AdminSubmissions';
import AdminSubmissionDetails from './pages/admin/AdminSubmissionDetails';
import AdminReports from './pages/admin/AdminReports';
import AdminAssignments from './pages/admin/AdminAssignments';
import LiveQuizTeacher from './pages/admin/LiveQuizTeacher';

import { Link } from 'react-router-dom';

// Route guard: requires login
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// Route guard: requires admin role
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

// Student Layout
const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-indigo-400">C-Grade Automator</h1>
          <span className="bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-bold px-2 py-0.5 rounded-full">STUDENT PORTAL</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {user?.avatar_url && (
              <img src={user.avatar_url} alt="User avatar" className="w-8 h-8 rounded-full border border-indigo-500/30" />
            )}
            <span className="text-sm font-medium text-slate-300">{user?.username || user?.github_id}</span>
          </div>
          <div className="w-[1px] h-4 bg-slate-800"></div>
          <Link to="/quiz/live" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             Live Quiz
          </Link>
          <div className="w-[1px] h-4 bg-slate-800"></div>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
              Admin Console
            </Link>
          )}
          <button
            onClick={logout}
            className="text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="flex-1 bg-slate-50">
        {children}
      </main>
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/login/callback" element={<LoginCallback />} />

      {/* Student Routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<PrivateRoute><MainLayout><StudentDashboard /></MainLayout></PrivateRoute>} />
      <Route path="/assignments/:id" element={<PrivateRoute><MainLayout><AssignmentDetails /></MainLayout></PrivateRoute>} />
      <Route path="/submissions/:id" element={<PrivateRoute><MainLayout><SubmissionDetails /></MainLayout></PrivateRoute>} />
      <Route path="/quiz/live" element={<PrivateRoute><MainLayout><LiveQuizStudent /></MainLayout></PrivateRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout><AdminOverview /></AdminLayout></AdminRoute>} />
      <Route path="/admin/students" element={<AdminRoute><AdminLayout><AdminStudents /></AdminLayout></AdminRoute>} />
      <Route path="/admin/submissions" element={<AdminRoute><AdminLayout><AdminSubmissions /></AdminLayout></AdminRoute>} />
      <Route path="/admin/submissions/:id" element={<AdminRoute><AdminLayout><AdminSubmissionDetails /></AdminLayout></AdminRoute>} />
      <Route path="/admin/assignments" element={<AdminRoute><AdminLayout><AdminAssignments /></AdminLayout></AdminRoute>} />
      <Route path="/admin/reports" element={<AdminRoute><AdminLayout><AdminReports /></AdminLayout></AdminRoute>} />
      <Route path="/admin/quizzes" element={<AdminRoute><AdminLayout><LiveQuizTeacher /></AdminLayout></AdminRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
