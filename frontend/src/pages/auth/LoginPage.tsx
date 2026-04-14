import type { FormEvent } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Feedback } from '../../components/Feedback'
import { useAuth } from '../../hooks/useAuth'
import { apiService } from '../../services/api'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('demo@nocodeml.local')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasGoogleClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await apiService.login(email, password)
      login({ email: response.user.email, token: response.token })
      navigate('/app', { replace: true })
    } catch {
      setError('Login failed')
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
      navigate('/app', { replace: true })
    } catch {
      setError('Google login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-shell auth-layout">
      <article className="auth-hero card-like">
        <p className="auth-kicker">NoCodeML</p>
        <h2>Professional ML workflows, zero code required.</h2>
        <p className="muted">Access your workspace to upload data, prepare features, train models, and review outcomes.</p>
        <ul className="feature-list">
          <li>Free to use</li>
          <li>Community-supported</li>
          <li>Step-by-step model building</li>
        </ul>
      </article>

      <article className="auth-card auth-panel">
        <p className="auth-kicker">Sign In</p>
        <h2>Welcome Back</h2>
        <p className="muted">Use your account credentials to continue.</p>

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
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          <button disabled={loading} type="submit">
            Sign In
          </button>
        </form>

        {hasGoogleClientId ? (
          <div className="oauth-wrap">
            <GoogleLogin
              onError={() => setError('Google login was cancelled or failed.')}
              onSuccess={(credentialResponse) => {
                void handleGoogleLogin(credentialResponse.credential)
              }}
              text="signin_with"
            />
          </div>
        ) : null}

        <Feedback error={error} loading={loading} />
        <p className="muted">
          New user? <Link to="/register">Create account</Link>
        </p>
      </article>
    </section>
  )
}
