import { render } from '@testing-library/preact';
import { describe, it, expect } from 'vitest';
import { App } from './app';

describe('App', () => {
  it('should render without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });
});
