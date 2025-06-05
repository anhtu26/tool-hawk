import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/auth/ProfilePage';
import DashboardPage from './pages/dashboard/DashboardPage';

// Tool Pages
import ToolsListPage from './pages/tools/ToolsListPage';
// Category Pages
import CategoryManagementPage from './pages/CategoryManagementPage';
import ToolDetailPage from './pages/tools/ToolDetailPage';
import CreateToolPage from './pages/tools/CreateToolPage';
import EditToolPage from './pages/tools/EditToolPage';

// Pages - temporary placeholders until implemented
const VendorsList = () => <div className="container py-6"><h1 className="text-2xl font-bold mb-4">Vendors</h1><p>Vendors list will be displayed here</p></div>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/tools" element={<ToolsListPage />} />
              <Route path="/tools/:id" element={<ToolDetailPage />} />
              <Route path="/tools/create" element={<CreateToolPage />} />
              <Route path="/tools/edit/:id" element={<EditToolPage />} />
              <Route path="/categories" element={<CategoryManagementPage />} />
              <Route path="/vendors" element={<VendorsList />} />
            </Route>
          </Route>
          
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
