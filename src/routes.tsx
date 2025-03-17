import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/admin/LoginPage';
import Dashboard from './components/admin/Dashboard';
import Projects from './components/admin/Projects';
import Messages from './components/admin/Messages';
import ProtectedRoute from './components/admin/ProtectedRoute';
import App from './App';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/admin">
        <Route path="login" element={<LoginPage />} />
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="projects" element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        } />
        <Route path="messages" element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
