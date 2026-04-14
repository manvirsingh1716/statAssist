export function SettingsPage() {
  return (
    <section className="page-content">
      <header className="page-header">
        <h2>Account and Settings</h2>
        <p className="muted">Manage profile information and workspace preferences for your team environment.</p>
      </header>

      <div className="panel-grid">
        <article className="panel card-like">
          <h3>Profile</h3>
          <form className="stacked-form">
            <label>
              Display Name
              <input placeholder="Enter display name" type="text" />
            </label>
            <label>
              Email Notifications
              <select defaultValue="enabled">
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </label>
            <button type="button">Save Preferences</button>
          </form>
        </article>

        <article className="panel card-like">
          <h3>Workspace Preferences</h3>
          <form className="stacked-form">
            <label className="inline-option">
              <input defaultChecked type="checkbox" />
              Show workflow tips during setup
            </label>
            <label className="inline-option">
              <input defaultChecked type="checkbox" />
              Keep latest project auto-selected
            </label>
            <label className="inline-option">
              <input type="checkbox" />
              Enable experimental model options
            </label>
          </form>
        </article>
      </div>
    </section>
  )
}
