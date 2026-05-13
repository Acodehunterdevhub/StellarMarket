import '@testing-library/jest-dom';

// Declare Jest globals for TypeScript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const jest: any;

// Mock localStorage and sessionStorage for testing
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Mock console methods to prevent test noise
console.error = jest.fn();
console.warn = jest.fn();

// Mock Stellar SDK for testing
jest.mock('@stellar-sdk/core', () => ({
  Server: jest.fn().mockImplementation(() => ({
    loadAccount: jest.fn(),
    submitTransaction: jest.fn(),
    fetchBaseFee: jest.fn(),
  })),
  Keypair: {
    fromSecret: jest.fn(),
    fromPublicKey: jest.fn(),
  },
  TransactionBuilder: jest.fn(),
  Asset: {
    native: jest.fn(),
  },
}));

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock React components
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
  useContext: jest.fn(),
}));

// Mock React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));

// Mock API calls
(window as any).fetch = jest.fn();