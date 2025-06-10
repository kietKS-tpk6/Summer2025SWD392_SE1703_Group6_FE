import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/dashboard/Sidebar';
import LecturerSidebar from './components/dashboard/LecturerSidebar';
import Dashboard from './components/dashboard/pages/Dashboard';
import Users from './components/dashboard/pages/Users';
import ClassManagement from './components/dashboard/pages/Classes';
import Subjects from './components/dashboard/pages/Subjects';
import Syllabus from './components/dashboard/pages/Syllabus';
import Blog from './components/dashboard/pages/Blog';
import Analytics from './components/dashboard/pages/Analytics';
import Chat from './components/dashboard/pages/Chat';
import Schedule from './components/dashboard/pages/Schedule';
import Profile from './components/dashboard/pages/Profile';
import Settings from './components/dashboard/pages/Settings';
import ViewerPage from './pages/viewer-portal/ViewerPage';
import StudentPage from './pages/student-portal/StudentPage';
import NotFoundPage from './components/error/NotFoundPage';
import LoginPage from './pages/authentication/LoginPage';
import RegisterPage from './pages/authentication/RegisterPage';
import LecturerDashboard from './components/dashboard/pages/LecturerDashboard';
import './App.css';
import 'antd/dist/reset.css';

const { Content } = Layout;

// Dashboard routes configuration
const dashboardRoutes = [
  { path: '/', element: <Dashboard /> },
  { path: '/users', element: <Users /> },
  { path: '/class', element: <ClassManagement /> },
  { path: '/subject', element: <Subjects /> },
  { path: '/syllabus', element: <Syllabus /> },
  { path: '/blog', element: <Blog /> },
  { path: '/analytics', element: <Analytics /> },
  { path: '/chat', element: <Chat /> },
  { path: '/schedule', element: <Schedule /> },
  { path: '/profile', element: <Profile /> },
  { path: '/settings', element: <Settings /> },
];

// Lecturer routes configuration
const lecturerRoutes = [
  { path: '/', element: <LecturerDashboard /> },
  { path: '/courses', element: <div>Courses Page</div> },
  { path: '/schedule', element: <div>Schedule Page</div> },
  { path: '/assignments', element: <div>Assignments Page</div> },
  { path: '/students', element: <div>Students Page</div> },
  { path: '/messages', element: <div>Messages Page</div> },
  { path: '/profile', element: <div>Profile Page</div> },
  { path: '/settings', element: <div>Settings Page</div> },
];

// Public routes configuration
const publicRoutes = [
  { path: '/', element: <ViewerPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
];

// Student routes configuration
const studentRoutes = [
  { path: '/student', element: <StudentPage /> },
];

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Dashboard Layout */}
        <Route
          path="/dashboard/*"
          element={
            <Layout style={{ minHeight: '100vh' }}>
              <Sidebar />
              <Layout>
                <Content style={{ margin: '16px', padding: '24px', background: '#fff', borderRadius: '30px' }}>
                  <Routes>
                    {dashboardRoutes.map((route) => (
                      <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                  </Routes>
                </Content>
              </Layout>
            </Layout>
          }
        />

        {/* Lecturer Layout */}
        <Route
          path="/lecturer/*"
          element={
            <Layout style={{ minHeight: '100vh' }}>
              <LecturerSidebar />
              <Layout>
                <Content style={{ margin: '16px', padding: '24px', background: '#fff', borderRadius: '30px' }}>
                  <Routes>
                    {lecturerRoutes.map((route) => (
                      <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                  </Routes>
                </Content>
              </Layout>
            </Layout>
          }
        />

        {/* Public Routes */}
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* Student Routes */}
        {studentRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* 404 - Catch all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
