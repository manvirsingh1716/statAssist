import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { getSession } from '../utils/storage'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const session = getSession()

  if (!session?.token) {
    return <Navigate to="/login" replace />
  }

  return children
}
