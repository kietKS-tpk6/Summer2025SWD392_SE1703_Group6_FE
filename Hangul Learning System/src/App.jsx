import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ViewerPage from './pages/viewer-portal/ViewerPage'
import StudentPage from './pages/student-portal/StudentPage'
import LecturerPage from './pages/lecturer-portal/LecturerPage'
import ManagerPage from './pages/manager-portal/ManagerPage'
import NotFoundPage from './components/error/NotFoundPage'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import './App.css'
import 'antd/dist/reset.css'

// Route configurations
const routes = {
  viewer: [
    {
    path: '/viewer',
    element: <ViewerPage />,
    label: 'Viewer Portal'
  }
],
  student: {
    path: '/student',
    element: <StudentPage />,
    label: 'Student Portal'
  },
  lecturer: [
    {
      path: '/lecturer',
      element: <LecturerPage />,
      label: 'Lecturer Portal'
    }
  ],
  manager: [
    {
    path: '/manager',
    element: <ManagerPage />,
    label: 'Manager Portal'
  }
]
}

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        {/* Navigation */}
        <nav className="main-nav">
          {Object.values(routes).flat().map((route) => (
            <a
              key={route.path}
              href={route.path}
              className="nav-link"
            >
              {route.label}
            </a>
          ))}
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            {/* Default route */}
            <Route path="/" element={
              Array.isArray(routes.viewer) ? routes.viewer[0].element : routes.viewer.element
            } />
            
            {/* Render all routes */}
            {Object.values(routes).flat().map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}

            {/* 404 - Catch all */}
            <Route path="*" element={<NotFoundPage />} /> 
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
