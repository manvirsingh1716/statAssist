import { useMemo } from 'react'

import { clearSession, getSession, setSession } from '../utils/storage'

interface LoginPayload {
  email: string
  token: string
}

export function useAuth() {
  const session = getSession()

  const api = useMemo(
    () => ({
      isAuthenticated: Boolean(session?.token),
      user: session,
      login: ({ email, token }: LoginPayload) => {
        setSession({ email, token })
      },
      logout: () => {
        clearSession()
      },
    }),
    [session],
  )

  return api
}
