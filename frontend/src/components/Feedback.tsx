interface FeedbackProps {
  loading?: boolean
  error?: string | null
}

export function Feedback({ loading, error }: FeedbackProps) {
  if (loading) {
    return (
      <div className="feedback feedback-loading" role="status" aria-live="polite">
        <span className="feedback-dot" />
        <p>Working on your request. This should only take a moment.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="feedback feedback-error" role="alert">
        <p>Something did not go as expected. Please try again.</p>
      </div>
    )
  }

  return null
}
