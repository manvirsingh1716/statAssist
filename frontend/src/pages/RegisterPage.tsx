import type { FormEvent } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Feedback } from '../components/Feedback'
import { useAuth } from '../hooks/useAuth'
import { apiService } from '../services/api'

export function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasGoogleClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await apiService.register(email, password)
      login({ email: response.user.email, token: response.token })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async (credential?: string) => {
    if (!credential) {
      setError('Google login did not return a credential.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await apiService.loginWithGoogle(credential)
      login({ email: response.user.email, token: response.token })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-shell">
      <article className="auth-card">
        <p className="auth-kicker">Get Started</p>
        <h2>Create an Account</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>

          <label>
            Password
            <input
              minLength={3}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          <button disabled={loading} type="submit">
            Register
          </button>
        </form>

        {hasGoogleClientId ? (
          <div style={{ marginTop: '0.75rem' }}>
            <GoogleLogin
              onError={() => setError('Google login was cancelled or failed.')}
              onSuccess={(credentialResponse) => {
                void handleGoogleLogin(credentialResponse.credential)
              }}
              text="signup_with"
            />
          </div>
        ) : null}

        <Feedback error={error} loading={loading} />
        <p className="muted">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </article>
    </section>
  )
}
