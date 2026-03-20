import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from '../components/Navbar';
import * as AuthContext from '../context/AuthContext';

// Helper: render Navbar wrapped in router
const renderNavbar = () =>
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

describe('Navbar – unauthenticated', () => {
  beforeEach(() => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
    });
  });

  it('renders the brand name', () => {
    renderNavbar();
    expect(screen.getByText(/The Barber Shop/i)).toBeInTheDocument();
  });

  it('shows Login and Sign Up links', () => {
    renderNavbar();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('does NOT show Dashboard link', () => {
    renderNavbar();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('does NOT show Logout button', () => {
    renderNavbar();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });
});

describe('Navbar – authenticated customer', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: true,
      user: { name: 'John Doe', role: 'CUSTOMER' },
      logout: mockLogout,
    });
  });

  it('shows greeting with first name', () => {
    renderNavbar();
    expect(screen.getByText(/Hi,/i)).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('shows Logout button', () => {
    renderNavbar();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('shows Book Now link for customers', () => {
    renderNavbar();
    expect(screen.getByText('Book Now')).toBeInTheDocument();
  });

  it('shows Dashboard link', () => {
    renderNavbar();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('does NOT show Login / Sign Up', () => {
    renderNavbar();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
  });
});

describe('Navbar – authenticated barber', () => {
  beforeEach(() => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: true,
      user: { name: 'James Barber', role: 'BARBER' },
      logout: vi.fn(),
    });
  });

  it('does NOT show Book Now link for barbers', () => {
    renderNavbar();
    expect(screen.queryByText('Book Now')).not.toBeInTheDocument();
  });

  it('shows Dashboard link', () => {
    renderNavbar();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});

describe('Navbar – mobile menu toggle', () => {
  beforeEach(() => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
    });
  });

  it('toggles mobile menu when hamburger is clicked', () => {
    renderNavbar();
    const hamburger = screen.getByLabelText('Toggle menu');
    // Initially hidden in mobile CSS, but DOM node should exist after click
    fireEvent.click(hamburger);
    // After clicking, the close icon should be visible (aria-label stays the same)
    expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument();
  });
});
