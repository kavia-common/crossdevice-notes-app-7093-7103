import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders app header title', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const title = screen.getAllByText(/Notes/i)[0];
  expect(title).toBeInTheDocument();
});
