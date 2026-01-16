import { render, screen } from '@testing-library/react';
import { AppProvider } from '../context/AppContext';
import { Config } from './Config';
import { describe, it, expect, vi } from 'vitest';

describe('Config Screen', () => {
  // Mock window.matchMedia for jsdom environment
  vi.stubGlobal('matchMedia', vi.fn().mockImplementation(query => ({
    matches: false, // default to light mode
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })));

  it('renders the configuration screen with all elements', () => {
    render(
      <AppProvider>
        <Config />
      </AppProvider>
    );

    // Check for the main title
    expect(screen.getByText('Configuration')).toBeInTheDocument();

    // Check for the API key input fields
    expect(screen.getByText('Jules API Key')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your Jules API key')).toBeInTheDocument();
    expect(screen.getByText('Gemini API Key')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your Gemini API key')).toBeInTheDocument();

    // Check for the theme switcher
    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });
});
