/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable static exports for better performance
  output: 'standalone',
  
  // Configure webpack
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  
  // Environment variables
  env: {
    // Stellar Network configuration
    STELLAR_NETWORK: process.env.STELLAR_NETWORK || 'testnet',
    STELLAR_HORIZON_URL: process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org',
    
    // Mobile money configuration
    MPESA_API_KEY: process.env.MPESA_API_KEY || '',
    MPESA_API_SECRET: process.env.MPESA_API_SECRET || '',
    
    // Analytics
    GA_TRACKING_ID: process.env.GA_TRACKING_ID || '',
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;