import { useEffect, useState } from 'react';

const emptyForm = { name: '', email: '', message: '' };

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

async function getErrorMessage(response) {
  const payload = await response.json().catch(() => null);
  if (payload?.errors) return Object.values(payload.errors).flat().join(' ');
  return payload?.title || `Request failed (${response.status}).`;
}

export default function App() {
  const [form, setForm] = useState(emptyForm);
  const [entries, setEntries] = useState([]);
  const [apiState, setApiState] = useState('loading');
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function loadEntries(showRefresh = false) {
    if (showRefresh) setIsRefreshing(true);
    else setApiState('loading');
    setError('');

    try {
      const response = await fetch('/api/entries');
      if (!response.ok) throw new Error(await getErrorMessage(response));
      const result = await response.json();
      setEntries(result);
      setApiState('ready');
    } catch (loadError) {
      setError(loadError.message || 'Unable to load entries.');
      setApiState('error');
    } finally {
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    void loadEntries();
  }, []);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setNotice('');
  }

  async function submitEntry(event) {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    setNotice('');

    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error(await getErrorMessage(response));
      const entry = await response.json();
      setEntries((current) => [entry, ...current]);
      setForm(emptyForm);
      setNotice('Entry saved successfully.');
      setApiState('ready');
    } catch (saveError) {
      setError(saveError.message || 'Unable to save this entry.');
    } finally {
      setIsSaving(false);
    }
  }

  const connectionLabel = {
    loading: 'Connecting',
    ready: 'API connected',
    error: 'API unavailable',
  }[apiState];

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Fieldnotes home">
          <span className="brand-mark" aria-hidden="true">F</span>
          <span>fieldnotes<span className="brand-period">.</span></span>
        </a>
        <div className="topbar-meta">
          <span className={`connection-dot connection-${apiState}`} aria-hidden="true" />
          <span>{connectionLabel}</span>
        </div>
      </header>

      <main className="workspace">
        <div className="page-heading">
          <div>
            <p className="eyebrow">ENTRY DESK <span> / </span> 01</p>
            <h1>Keep the details.</h1>
          </div>
          <p className="page-caption">A considered place for every submission.</p>
        </div>

        <div className="content-grid">
          <section className="compose-panel" aria-labelledby="form-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">NEW SUBMISSION</p>
                <h2 id="form-title">Add an entry</h2>
              </div>
              <span className="required-note">* Required</span>
            </div>

            <form onSubmit={submitEntry}>
              <label className="field">
                <span>Name <span className="required-mark">*</span></span>
                <input
                  autoComplete="name"
                  maxLength={100}
                  name="name"
                  onChange={updateField}
                  placeholder="e.g. Jordan Lee"
                  required
                  value={form.name}
                />
              </label>

              <label className="field">
                <span>Email <span className="required-mark">*</span></span>
                <input
                  autoComplete="email"
                  maxLength={200}
                  name="email"
                  onChange={updateField}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={form.email}
                />
              </label>

              <label className="field">
                <span>Message <span className="required-mark">*</span></span>
                <textarea
                  maxLength={2000}
                  name="message"
                  onChange={updateField}
                  placeholder="Write a note..."
                  required
                  rows={5}
                  value={form.message}
                />
                <span className="character-count">{form.message.length} / 2,000</span>
              </label>

              {error && <p className="form-message form-error" role="alert">{error}</p>}
              {notice && <p className="form-message form-success" role="status">{notice}</p>}

              <button className="submit-button" disabled={isSaving} type="submit">
                <span>{isSaving ? 'Saving entry' : 'Save entry'}</span>
                <span className="button-arrow" aria-hidden="true">↗</span>
              </button>
            </form>
            <p className="privacy-note"><span aria-hidden="true">●</span> Saved to your local records</p>
          </section>

          <section className="entries-panel" aria-labelledby="entries-title">
            <div className="entries-heading">
              <div>
                <p className="eyebrow">YOUR COLLECTION</p>
                <h2 id="entries-title">Recent entries</h2>
              </div>
              <div className="entries-tools">
                <span className="entry-count">{entries.length.toString().padStart(2, '0')}</span>
                <button
                  aria-label="Refresh entries"
                  className="refresh-button"
                  disabled={isRefreshing || apiState === 'loading'}
                  onClick={() => void loadEntries(true)}
                  title="Refresh entries"
                  type="button"
                >
                  <span className={isRefreshing ? 'refresh-icon is-spinning' : 'refresh-icon'} aria-hidden="true">↻</span>
                </button>
              </div>
            </div>

            {apiState === 'loading' ? (
              <div className="list-state" role="status">Loading entries<span className="loading-dots">...</span></div>
            ) : entries.length === 0 ? (
              <div className="empty-state">
                <div className="empty-mark" aria-hidden="true"><span /><span /><span /></div>
                <h3>Your page is clear.</h3>
                <p>New submissions will appear here.</p>
              </div>
            ) : (
              <ol className="entry-list">
                {entries.map((entry, index) => (
                  <li className="entry-row" key={entry.id}>
                    <span className="entry-index">{(entries.length - index).toString().padStart(2, '0')}</span>
                    <article className="entry-content">
                      <div className="entry-meta">
                        <h3>{entry.name}</h3>
                        <time dateTime={entry.createdAtUtc}>{formatDate(entry.createdAtUtc)}</time>
                      </div>
                      <a className="entry-email" href={`mailto:${entry.email}`}>{entry.email}</a>
                      <p className="entry-message">{entry.message}</p>
                    </article>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
        <footer className="page-footer"><span>FIELDNOTES</span><span>LOCAL ENTRY ARCHIVE</span></footer>
      </main>
    </div>
  );
}
