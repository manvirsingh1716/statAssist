interface FeedbackProps {
  loading?: boolean
  error?: string | null
}

export function Feedback({ loading, error }: FeedbackProps) {
  if (loading) {
    return <p className="muted">Loading...</p>
  }

  if (error) {
    return <p className="error-text">{error}</p>
  }

  return null
}
