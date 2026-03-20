import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Services from '../components/Services';

const renderServices = () =>
  render(<MemoryRouter><Services /></MemoryRouter>);

describe('Services component', () => {
  it('renders the section heading', () => {
    renderServices();
    expect(screen.getByText('Our Services')).toBeInTheDocument();
  });

  it('renders all 6 service cards', () => {
    renderServices();
    expect(screen.getByText('Classic Haircut')).toBeInTheDocument();
    expect(screen.getByText('Beard Trim & Shape')).toBeInTheDocument();
    expect(screen.getByText('Hot Towel Shave')).toBeInTheDocument();
    expect(screen.getByText('Cut + Beard Combo')).toBeInTheDocument();
    expect(screen.getByText('Hair Treatment')).toBeInTheDocument();
    expect(screen.getByText('Kids Haircut')).toBeInTheDocument();
  });

  it('displays prices for each service', () => {
    renderServices();
    expect(screen.getByText('$25')).toBeInTheDocument();
    expect(screen.getByText('$20')).toBeInTheDocument();
    expect(screen.getByText('$35')).toBeInTheDocument();
  });

  it('renders a "Book a Service" CTA button', () => {
    renderServices();
    expect(screen.getByText('Book a Service')).toBeInTheDocument();
  });
});
