import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { Dashboard } from '../Dashboard';
import { useAuth } from '../../../hooks/useAuth';

vi.mock('../../../hooks/useAuth');

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render admin dashboard for admin users', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { isAdmin: true },
    });

    render(<Dashboard />);

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Subscriptions')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should not render admin dashboard for non-admin users', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { isAdmin: false },
    });

    render(<Dashboard />);

    expect(screen.queryByText('Overview')).not.toBeInTheDocument();
    expect(screen.queryByText('Products')).not.toBeInTheDocument();
    expect(screen.queryByText('Orders')).not.toBeInTheDocument();
    expect(screen.queryByText('Subscriptions')).not.toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('should switch tabs when clicking on tab buttons', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { isAdmin: true },
    });

    render(<Dashboard />);

    // Click on Products tab
    fireEvent.click(screen.getByText('Products'));
    expect(screen.getByTestId('products-panel')).toBeVisible();

    // Click on Orders tab
    fireEvent.click(screen.getByText('Orders'));
    expect(screen.getByTestId('orders-panel')).toBeVisible();

    // Click on Subscriptions tab
    fireEvent.click(screen.getByText('Subscriptions'));
    expect(screen.getByTestId('subscriptions-panel')).toBeVisible();

    // Click on Settings tab
    fireEvent.click(screen.getByText('Settings'));
    expect(screen.getByTestId('settings-panel')).toBeVisible();
  });

  it('should display overview statistics', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { isAdmin: true },
    });

    render(<Dashboard />);

    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('Active Subscriptions')).toBeInTheDocument();
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('Total Products')).toBeInTheDocument();
  });
});
