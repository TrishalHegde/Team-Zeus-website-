import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Placeholder components
const Login = () => <div className="p-8"><h1>Login Page</h1><p>Mock GitHub Login</p></div>;
const StudentDashboard = () => <div className="p-8"><h1>Student Dashboard</h1></div>;
const AssignmentDetails = () => <div className="p-8"><h1>Assignment Details</h1></div>;
const SubmissionDetails = () => <div className="p-8"><h1>Submission Details</h1></div>;
const AdminOverview = () => <div className="p-8"><h1>Admin Dashboard</h1></div>;

// Layout
const MainLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-indigo-900">C-Grade Automator</h1>
      <div className="flex gap-4">
        <span className="text-slate-600">Student User</span>
      </div>
    </header>
    <main className="flex-1 bg-slate-50">
      {children}
    </main>
  </div>
);

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
        <Route path="/admin" element={<MainLayout><AdminOverview /></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
