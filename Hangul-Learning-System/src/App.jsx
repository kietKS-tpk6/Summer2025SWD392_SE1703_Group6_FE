import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/dashboard/Sidebar';
import LecturerSidebar from './components/dashboard/LecturerSidebar';
import Dashboard from './components/dashboard/pages/Dashboard';
import Users from './components/dashboard/pages/Users';
import ClassManagement from './components/classes/Classes';
import Subjects from './components/dashboard/pages/Subjects';
import CreateSubject from './components/dashboard/pages/subject/CreateSubject';
import Syllabus from './components/dashboard/pages/Syllabus';
import Blog from './components/dashboard/pages/Blog';
import Analytics from './components/dashboard/pages/Analytics';
import Chat from './components/dashboard/pages/Chat';
import Schedule from './components/dashboard/pages/Schedule';
import Profile from './components/dashboard/pages/Profile';
import Settings from './components/dashboard/pages/Settings';
import ViewerPage from './pages/viewer-portal/ViewerPage';
import HomeContent from './components/Homepage/Content';
import ViewClassDetail from './pages/student-portal/ViewClassDetail';
import WeeklyTimeTable from './pages/student-portal/WeeklyTimeTable';
import AssessmentManagement from './components/assessments/Assessments';
import AccountDetail from '../src/components/common/AccountDetail';
import AssessmentManagement from './components/assessments/Assessments'; // hoặc tên file bạn muốn
import AssessmentManagement from './components/assessments/Assessments'; 
import ViewDetailAssessment from './components/assessments/ViewDetailAssessment';

// import About from './pages/viewer-portal/About';
// import Courses from './pages/viewer-portal/Courses';
// import Contact from './pages/viewer-portal/Contact';
import EnrollClass from './pages/student-portal/EnrollClass';
import NotFoundPage from './components/error/NotFoundPage';
import LoginPage from './pages/authentication/LoginPage';
import RegisterPage from './pages/authentication/RegisterPage';
import PaymentSuccess from './components/payment/PaymentSuccess';
import PaymentFailed from './components/payment/PaymentFailed';
import PaymentForm from './components/payment/PaymentForm';
import LecturerDashboard from './components/dashboard/pages/LecturerDashboard';
import ClassDetail from './components/classes/detail/ClassDetail';
import LessonDetailPage from './components/classes/detail/lesson/LessonDetailPage';
import AttendancePage from './components/classes/attendance/AttendancePage';
import CheckAttendancePage from './components/classes/attendance/CheckAttendancePage';
import TeachingSchedule from './components/lecturer-portal/TeachingSchedule';
import StudentTestSchedule from './pages/student-portal/StudentTestSchedule';
import ViewTest from './pages/student-portal/ViewTest';
import TakeTest from './pages/student-portal/TakeTest';
import TestResult from './pages/student-portal/TestResult';
import SystemConfig from './components/dashboard/pages/SystemConfig';
import TestDetail from './pages/student-portal/TestDetail';
import ViewEnrolledClassDetail from './pages/student-portal/ViewEnrolledClassDetail';
import './App.css';
import 'antd/dist/reset.css';
import ProtectedRoute from './components/common/ProtectedRoute';

const { Content } = Layout;

// Dashboard routes configuration
const dashboardRoutes = [
  { path: '/', element: <Dashboard /> },
  { path: '/users', element: <Users /> },
  { path: '/class', element: <ClassManagement /> },
  { path: '/class/detail', element: <ClassDetail /> },
  { path: '/subject', element: <Subjects /> },
  { path: '/subject/create', element: <CreateSubject /> },
  { path: '/syllabus', element: <Syllabus /> },
  { path: '/blog', element: <Blog /> },
  { path: '/analytics', element: <Analytics /> },
  { path: '/chat', element: <Chat /> },
  { path: '/schedule', element: <Schedule /> },
  { path: '/profile', element: <AccountDetail/> },
  { path: '/profile/:accountId', element: <AccountDetail /> },
  { path: '/settings', element: <Settings /> },
  { path: '/assessment', element: <AssessmentManagement /> },
  { path: '/assessment/:testID', element: <ViewDetailAssessment /> },
  { path: '/lesson-detail' , element: <LessonDetailPage/>},
  { path: '/attendance', element: <AttendancePage/>},
  { path: '/check-attendance', element: <CheckAttendancePage /> },
  { path: '/system-config', element: <SystemConfig /> },
];

// Lecturer routes configuration
const lecturerRoutes = [
  { path: '/', element: <LecturerDashboard /> },
  { path: '/class', element: <div>Courses Page</div> },
  { path: '/schedule', element: <TeachingSchedule /> },
  { path: '/assignments', element: <div>Assignments Page</div> },
  { path: '/students', element: <div>Students Page</div> },
  { path: '/messages', element: <div>Messages Page</div> },
  { path: '/profile', element: <AccountDetail/> },
  { path: '/settings', element: <div>Settings Page</div> },
  { path: '/lesson-detail' , element: <LessonDetailPage/>},
  { path: '/attendance', element: <AttendancePage/>},
  { path: '/check-attendance', element: <CheckAttendancePage /> },
];

// Public routes configuration
const publicRoutes = [
  { 
    // TRANG CHÍNH
    path: '/', element: <ViewerPage />,
    // TRANG NAVIGATE
    children: [
      { path: '', element: <HomeContent /> },
      { path: '/payment-success', element: <PaymentSuccess/>},
      { path: '/payment-failed', element: <PaymentFailed/>},
      { path: '/payment/:classId', element: <PaymentForm /> },
      { path: '/class-detail/:id', element: <ViewClassDetail/>},
      // { path: 'about', element: <About /> },
      // { path: 'courses', element: <Courses /> },
      // { path: 'contact', element: <Contact /> },
    ]
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
];

// Student routes configuration
const studentRoutes = [
  // { path: '/  ', element: <StudentPage /> },
  { path: '/profile', element: <AccountDetail/> },
  { path: '/schedule', element: <WeeklyTimeTable/> }, 
  { path: '/payment-success', element: <PaymentSuccess/>},
  { path: '/payment-failed', element: <PaymentFailed/>},
  { path: '/payment/:classId', element: <PaymentForm /> },
  { path: '/lesson-detail' , element: <LessonDetailPage/>},
  { path: '/test-schedule', element: <StudentTestSchedule /> },
  { path: '/view-test/:testEventID', element: <ViewTest /> },
  { path: '/take-test/:testEventID', element: <TakeTest /> },
  { path: '/test-result/:testId', element: <TestResult /> },
  { path: '/test-detail/:studentTestID', element: <TestDetail /> },
  //{ path: '/weekly-time-table', element: <WeeklyTimeTable/>},
];

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Manager Layout */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={['Manager']}>
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
            </ProtectedRoute>
          }
        />

        {/* Lecturer Layout */}
        <Route
          path="/lecturer/*"
          element={
            <ProtectedRoute allowedRoles={['Lecture', 'Lecturer', 'Teacher']}>
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
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element}>
            {route.children?.map((child) => (
              <Route key={child.path} path={child.path} element={child.element} />
            ))}
          </Route>
        ))}

        {/* Student Routes */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />
                <Layout>
                  <Content style={{ margin: '16px', padding: '24px', background: '#fff', borderRadius: '30px' }}>
                    <Routes>
                      {studentRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                      ))}
                    </Routes>
                  </Content>
                </Layout>
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* 404 - Catch all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
