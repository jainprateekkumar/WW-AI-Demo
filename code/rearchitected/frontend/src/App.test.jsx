import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

const savedEntry = {
  id: 'entry-1',
  name: 'Synthetic User',
  email: 'synthetic@example.com',
  message: 'Synthetic message',
  createdAtUtc: '2026-10-21T10:00:00.000000Z',
};

function jsonResponse(payload, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  };
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('public entries client', () => {
  it('shows the public synthetic-data notice and the empty state', async () => {
    fetch.mockResolvedValueOnce(jsonResponse([]));
    render(<App />);

    expect(screen.getByTestId('public-data-notice'))
      .toHaveTextContent('Entries are visible to anyone; use synthetic data only.');
    expect(await screen.findByTestId('entries-empty-state')).toBeInTheDocument();
    expect(screen.getByTestId('entry-count')).toHaveTextContent('00');
  });

  it('distinguishes a failed initial load from an empty collection and retries', async () => {
    fetch
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(jsonResponse([savedEntry]));
    render(<App />);

    expect(await screen.findByTestId('collection-error')).toBeInTheDocument();
    expect(screen.queryByTestId('entries-empty-state')).not.toBeInTheDocument();
    await userEvent.click(screen.getByTestId('entries-retry-button'));

    expect(await screen.findByText('Synthetic User')).toBeInTheDocument();
    expect(screen.getByTestId('entry-count')).toHaveTextContent('01');
  });

  it('keeps confirmed entries visible when a refresh fails', async () => {
    fetch
      .mockResolvedValueOnce(jsonResponse([savedEntry]))
      .mockRejectedValueOnce(new Error('offline'));
    render(<App />);

    expect(await screen.findByText('Synthetic User')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('entries-refresh-button'));

    expect(await screen.findByTestId('collection-error'))
      .toHaveTextContent('Your displayed entries are unchanged.');
    expect(screen.getByText('Synthetic User')).toBeInTheDocument();
  });

  it('posts to the shared API and prepends a confirmed entry', async () => {
    fetch
      .mockResolvedValueOnce(jsonResponse([]))
      .mockResolvedValueOnce(jsonResponse(savedEntry, 201));
    render(<App />);
    const user = userEvent.setup();

    await user.type(screen.getByTestId('entry-form-name-input'), 'Synthetic User');
    await user.type(screen.getByTestId('entry-form-email-input'), 'synthetic@example.com');
    await user.type(screen.getByTestId('entry-form-message-input'), 'Synthetic message');
    await user.click(screen.getByTestId('entry-form-submit-button'));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(fetch.mock.calls[1][0]).toBe('/api/entries');
    expect(fetch.mock.calls[1][1].method).toBe('POST');
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({
      name: 'Synthetic User',
      email: 'synthetic@example.com',
      message: 'Synthetic message',
    });
    expect(await screen.findByText('Entry saved successfully.')).toBeInTheDocument();
    expect(screen.getByTestId('entry-form-name-input')).toHaveValue('');
    expect(screen.getByTestId('entries-list')).toContainElement(screen.getByText('Synthetic User'));
  });

  it('shows API validation errors and retains form contents without retrying', async () => {
    fetch
      .mockResolvedValueOnce(jsonResponse([]))
      .mockResolvedValueOnce(jsonResponse({ errors: { Name: ['Name is required.'] } }, 400));
    render(<App />);
    const user = userEvent.setup();

    await user.type(screen.getByTestId('entry-form-name-input'), 'Synthetic User');
    await user.type(screen.getByTestId('entry-form-email-input'), 'synthetic@example.com');
    await user.type(screen.getByTestId('entry-form-message-input'), 'Synthetic message');
    await user.click(screen.getByTestId('entry-form-submit-button'));

    expect(await screen.findByRole('alert')).toHaveTextContent('Name is required.');
    expect(screen.getByTestId('entry-form-name-input')).toHaveValue('Synthetic User');
    expect(screen.getByTestId('entry-form-email-input')).toHaveValue('synthetic@example.com');
    expect(screen.getByTestId('entry-form-message-input')).toHaveValue('Synthetic message');
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('uses the API-provided newest-first collection order', async () => {
    fetch.mockResolvedValueOnce(
      jsonResponse([
        savedEntry,
        { ...savedEntry, id: 'entry-0', name: 'Older User', createdAtUtc: '2026-10-20T10:00:00Z' },
      ]),
    );
    render(<App />);

    const rows = await screen.findAllByTestId('entry-row');
    expect(rows[0]).toHaveTextContent('Synthetic User');
    expect(rows[1]).toHaveTextContent('Older User');
  });
});