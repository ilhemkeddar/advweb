import { createBrowserRouter } from 'react-router-dom'
import { PublicLayout, DashboardLayout } from '../layouts'
import HomePage from '../pages/public/HomePage'
import TrainingHub from '../pages/public/TrainingHub'
import WorkshopDetails from '../pages/public/WorkshopDetails'
import Representatives from '../pages/public/Representatives'
import Resources from '../pages/public/Resources'
import Contact from '../pages/public/Contact'
import LoginPage from '../pages/auth/LoginPage'
import SignUpPage from '../pages/auth/SignUpPage'
import MyLearning from '../pages/user/MyLearning'
import ProfessorDashboard from '../pages/professor/ProfessorDashboard'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminAddWorkshop from '../pages/admin/AdminAddWorkshop'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'training', element: <TrainingHub /> },
      { path: 'representatives', element: <Representatives /> },
      { path: 'resources', element: <Resources /> },
      { path: 'contact', element: <Contact /> },
      { path: 'workshop/:id', element: <WorkshopDetails /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignUpPage /> },
    ],
  },
  {
    path: '/student',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <MyLearning /> },
      { path: 'learning', element: <MyLearning /> },
      { path: 'certificates', element: <MyLearning /> },
    ],
  },
  {
    path: '/professor',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <ProfessorDashboard /> },
      { path: 'workshops', element: <ProfessorDashboard /> },
      { path: 'submit', element: <ProfessorDashboard /> },
      { path: 'calendar', element: <ProfessorDashboard /> },
    ],
  },
  {
    path: '/admin',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'validation', element: <AdminDashboard /> },
      { path: 'users', element: <AdminDashboard /> },
      { path: 'analytics', element: <AdminDashboard /> },
      { path: 'messages', element: <AdminDashboard /> },
      { path: 'certificates', element: <AdminDashboard /> },
      { path: 'add-workshop', element: <AdminAddWorkshop /> },
    ],
  },
])
