import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AssignmentDetails from './pages/AssignmentDetails';
import SubmissionDetails from './pages/SubmissionDetails';

// Import Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminStudents from './pages/admin/AdminStudents';
import AdminSubmissions from './pages/admin/AdminSubmissions';
import AdminSubmissionDetails from './pages/admin/AdminSubmissionDetails';
import AdminReports from './pages/admin/AdminReports';

// Student Layout
const MainLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between text-white shadow-md">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-indigo-400">C-Grade Automator</h1>
        <span className="bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-bold px-2 py-0.5 rounded-full">STUDENT PORTAL</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <img src="https://avatars.githubusercontent.com/u/9919?v=4" alt="User avatar" className="w-8 h-8 rounded-full border border-indigo-500/30" />
          <span className="text-sm font-medium text-slate-350">John Doe</span>
        </div>
        <div className="w-[1px] h-4 bg-slate-800"></div>
        <Link to="/admin" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
          Admin Console
        </Link>
      </div>
    </header>
    <main className="flex-1 bg-slate-50">
      {children}
    </main>
  </div>
);

// We need to import Link inside App.jsx for layout header navigation
import { Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Student Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<MainLayout><StudentDashboard /></MainLayout>} />
        <Route path="/assignments/:id" element={<MainLayout><AssignmentDetails /></MainLayout>} />
        <Route path="/submissions/:id" element={<MainLayout><SubmissionDetails /></MainLayout>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout><AdminOverview /></AdminLayout>} />
        <Route path="/admin/students" element={<AdminLayout><AdminStudents /></AdminLayout>} />
        <Route path="/admin/submissions" element={<AdminLayout><AdminSubmissions /></AdminLayout>} />
        <Route path="/admin/submissions/:id" element={<AdminLayout><AdminSubmissionDetails /></AdminLayout>} />
        <Route path="/admin/reports" element={<AdminLayout><AdminReports /></AdminLayout>} />
      </Routes>
    </Router>
  );
}

export default App;

