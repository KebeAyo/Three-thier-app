import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the three-tier application overview', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /build on a resilient three-tier foundation/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /explore database demo/i })).toBeInTheDocument();
});
