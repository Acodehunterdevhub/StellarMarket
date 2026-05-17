import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

type Listing = {
  id: string;
  name: string;
  category: string;
  country: string;
  price: string;
  settlement: string;
  seller: string;
  trustScore: number;
  eta: string;
  featured?: boolean;
};

const listings: Listing[] = [
  {
    id: 'solar-kit-ng',
    name: 'Solar Starter Kit',
    category: 'Energy',
    country: 'Nigeria',
    price: '$185',
    settlement: 'USDC, NGN bank transfer',
    seller: 'Lagos Energy Hub',
    trustScore: 98,
    eta: '2 days',
    featured: true,
  },
  {
    id: 'phone-ke',
    name: 'Refurbished Android Bundle',
    category: 'Electronics',
    country: 'Kenya',
    price: '$94',
    settlement: 'M-Pesa, XLM',
    seller: 'Nairobi Renew Market',
    trustScore: 96,
    eta: '24 hours',
    featured: true,
  },
  {
    id: 'fashion-gh',
    name: 'Kente Capsule Collection',
    category: 'Fashion',
    country: 'Ghana',
    price: '$61',
    settlement: 'USDC, mobile money',
    seller: 'Accra Studio Co.',
    trustScore: 95,
    eta: '3 days',
  },
  {
    id: 'produce-rw',
    name: 'Farm Fresh Produce Crate',
    category: 'Groceries',
    country: 'Rwanda',
    price: '$28',
    settlement: 'RWF wallet, XLM',
    seller: 'Kigali Harvest',
    trustScore: 97,
    eta: 'Same day',
  },
];

const marketplaceSummary = {
  activeMerchants: 1280,
  countriesLive: 9,
  weeklyVolumeUsd: 245000,
  avgSettlementMinutes: 4,
};

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'StellarMarket API',
    version: '0.1.0',
    routes: ['/api/health', '/api/marketplace/summary', '/api/listings'],
  });
});

// Basic health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    service: 'stellarmarket-backend',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/marketplace/summary', (_req: Request, res: Response) => {
  res.json({
    ...marketplaceSummary,
    featuredListings: listings.filter((listing) => listing.featured).length,
  });
});

app.get('/api/listings', (req: Request, res: Response) => {
  const category = typeof req.query.category === 'string' ? req.query.category : null;

  const filteredListings = category
    ? listings.filter(
        (listing) => listing.category.toLowerCase() === category.toLowerCase(),
      )
    : listings;

  res.json({
    count: filteredListings.length,
    items: filteredListings,
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
