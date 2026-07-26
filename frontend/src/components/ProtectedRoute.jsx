import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function ProtectedRoute({ children, role }) {
  const { user, authReady } = useAuth()
  const location = useLocation()

  if (!authReady) return null
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

export default ProtectedRoute
