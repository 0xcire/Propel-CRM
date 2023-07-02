import App from './App';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, it } from 'vitest';

afterEach(() => {
  cleanup();
});

describe('base test', () => {
  it('app contains text', async () => {
    render(<App />);
    expect(await screen.getByText('from docker')).toBeInTheDocument();
  });
});
