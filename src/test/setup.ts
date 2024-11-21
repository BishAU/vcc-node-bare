import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { vi } from 'vitest';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Intersection Observer
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock ResizeObserver
window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock Stripe
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve({
    elements: vi.fn(() => ({
      create: vi.fn(),
    })),
    confirmPayment: vi.fn(),
    confirmCardPayment: vi.fn(),
  })),
}));

// Mock environment variables
process.env.VITE_STRIPE_PUBLIC_KEY = 'pk_test_mock';
process.env.VITE_STRIPE_SECRET_KEY = 'sk_test_mock';
process.env.VITE_STRIPE_WEBHOOK_SECRET = 'whsec_mock';
process.env.VITE_XERO_CLIENT_ID = 'mock_client_id';
process.env.VITE_XERO_CLIENT_SECRET = 'mock_client_secret';
