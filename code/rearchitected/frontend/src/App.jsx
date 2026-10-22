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

function isEntry(value) {
  return (
    value &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.email === 'string' &&
    typeof value.message === 'string' &&
    typeof value.createdAtUtc === 'string'
  );
}

export default function App() {
  const [form, setForm] = useState(emptyForm);
  const [entries, setEntries] = useState([]);
  const [apiState, setApiState] = useState('loading');
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formError, setFormError] = useState('');
  const [collectionError, setCollectionError] = useState('');
  const [notice, setNotice] = useState('');

  async function loadEntries(showRefresh = false) {
    if (showRefresh) setIsRefreshing(true);
    else setApiState('loading');
    setCollectionError('');

    try {
      const response = await fetch('/api/entries');
      if (!response.ok) throw new Error(await getErrorMessage(response));
      const result = await response.json();
      if (!Array.isArray(result) || !result.every(isEntry)) {
        throw new Error('The server returned an invalid entries response.');
      }
      setEntries(result);
      setApiState('ready');
    } catch {
      setCollectionError('Entries could not be loaded. Refresh to try again.');
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
    setFormError('');
    setNotice('');

    let response;
    try {
      response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch {
      setFormError('The save could not be confirmed. Refresh entries before trying again.');
      setIsSaving(false);
      return;
    }

    try {
      if (!response.ok) throw new Error(await getErrorMessage(response));
      const entry = await response.json();
      if (!isEntry(entry)) {
        throw new Error('The save could not be confirmed. Refresh entries before trying again.');
      }
      setEntries((current) => [entry, ...current]);
      setForm(emptyForm);
      setNotice('Entry saved successfully.');
      setApiState('ready');
      setCollectionError('');
    } catch (saveError) {
      setFormError(saveError.message || 'Unable to save this entry.');
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
        <div className="topbar-meta" role="status" aria-live="polite" data-testid="api-connection-status">
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

            <p className="public-data-notice" role="note" data-testid="public-data-notice">
              Public demo. Entries are visible to anyone; use synthetic data only.
            </p>

            <form data-testid="entry-form" onSubmit={submitEntry}>
              <label className="field">
                <span>Name <span className="required-mark">*</span></span>
                <input
                  autoComplete="name"
                  data-testid="entry-form-name-input"
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
                  data-testid="entry-form-email-input"
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
                  data-testid="entry-form-message-input"
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

              {formError && <p className="form-message form-error" role="alert">{formError}</p>}
              {notice && <p className="form-message form-success" role="status">{notice}</p>}

              <button
                className="submit-button"
                data-testid="entry-form-submit-button"
                disabled={isSaving}
                type="submit"
              >
                <span>{isSaving ? 'Saving entry' : 'Save entry'}</span>
                <span className="button-arrow" aria-hidden="true">↗</span>
              </button>
            </form>
          </section>

          <section className="entries-panel" aria-labelledby="entries-title" data-testid="entries-panel">
            <div className="entries-heading">
              <div>
                <p className="eyebrow">YOUR COLLECTION</p>
                <h2 id="entries-title">Recent entries</h2>
              </div>
              <div className="entries-tools">
                <span className="entry-count" data-testid="entry-count">
                  {entries.length.toString().padStart(2, '0')}
                </span>
                <button
                  aria-label="Refresh entries"
                  className="refresh-button"
                  data-testid="entries-refresh-button"
                  disabled={isRefreshing || apiState === 'loading'}
                  onClick={() => void loadEntries(true)}
                  title="Refresh entries"
                  type="button"
                >
                  <span className={isRefreshing ? 'refresh-icon is-spinning' : 'refresh-icon'} aria-hidden="true">↻</span>
                </button>
              </div>
            </div>

            {apiState === 'loading' && entries.length === 0 ? (
              <div className="list-state" role="status">Loading entries<span className="loading-dots">...</span></div>
            ) : collectionError && entries.length === 0 ? (
              <div className="collection-error" role="alert" data-testid="collection-error">
                <p>{collectionError}</p>
                <button
                  className="retry-button"
                  data-testid="entries-retry-button"
                  disabled={isRefreshing}
                  onClick={() => void loadEntries(true)}
                  type="button"
                >
                  {isRefreshing ? 'Refreshing entries' : 'Try again'}
                </button>
              </div>
            ) : entries.length === 0 ? (
              <div className="empty-state" data-testid="entries-empty-state">
                <div className="empty-mark" aria-hidden="true"><span /><span /><span /></div>
                <h3>Your page is clear.</h3>
                <p>New submissions will appear here.</p>
              </div>
            ) : (
              <>
                {collectionError && (
                  <p className="collection-refresh-error" role="alert" data-testid="collection-error">
                    {collectionError} Your displayed entries are unchanged.
                  </p>
                )}
                <ol className="entry-list" data-testid="entries-list">
                  {entries.map((entry, index) => (
                    <li className="entry-row" key={entry.id} data-testid="entry-row">
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
              </>
            )}
          </section>
        </div>
        <footer className="page-footer"><span>FIELDNOTES</span><span>PUBLIC DEMO COLLECTION</span></footer>
      </main>
    </div>
  );
}