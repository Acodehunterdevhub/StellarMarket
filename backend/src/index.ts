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

type AiRecommendation = {
  listingId: string;
  title: string;
  reason: string;
  confidence: number;
};

type AiInsight = {
  title: string;
  summary: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
};

type MerchantCopilotResult = {
  headline: string;
  description: string;
  riskFlags: string[];
  trustNudges: string[];
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

const aiInsights: AiInsight[] = [
  {
    title: 'Electronics demand is accelerating in Kenya',
    summary:
      'Mobile-first buyers are converting faster on listings that mention wallet compatibility and same-day dispatch.',
    action: 'Prioritize faster-delivery badges on electronics inventory this week.',
    priority: 'high',
  },
  {
    title: 'Trust scores are driving conversion in groceries',
    summary:
      'Shoppers are favoring merchants above 96% trust when settlement includes local wallet options.',
    action: 'Promote trust score and local payout methods above the fold for produce cards.',
    priority: 'medium',
  },
  {
    title: 'Fashion listings benefit from richer copy',
    summary:
      'Listings with cultural context and delivery clarity are retaining more product detail views.',
    action: 'Use merchant copilot text suggestions to enrich artisan product descriptions.',
    priority: 'low',
  },
];

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
    routes: [
      '/api/health',
      '/api/marketplace/summary',
      '/api/listings',
      '/api/ai/insights',
      '/api/ai/recommendations',
      '/api/ai/merchant-copilot',
    ],
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

app.get('/api/ai/insights', (_req: Request, res: Response) => {
  res.json({
    model: 'StellarMarket Intelligence v1',
    generatedAt: new Date().toISOString(),
    items: aiInsights,
  });
});

app.get('/api/ai/recommendations', (req: Request, res: Response) => {
  const shopperCountry =
    typeof req.query.country === 'string' ? req.query.country.toLowerCase() : null;
  const shopperCategory =
    typeof req.query.category === 'string' ? req.query.category.toLowerCase() : null;

  const rankedRecommendations: AiRecommendation[] = listings
    .map((listing) => {
      let confidence = Math.floor(listing.trustScore * 0.78);
      const reasons: string[] = [];

      if (shopperCountry && listing.country.toLowerCase() === shopperCountry) {
        confidence += 12;
        reasons.push('local availability matches the shopper region');
      }

      if (shopperCategory && listing.category.toLowerCase() === shopperCategory) {
        confidence += 10;
        reasons.push('product category aligns with current interest');
      }

      if (listing.featured) {
        confidence += 4;
        reasons.push('merchant is currently featured for strong marketplace performance');
      }

      if (!reasons.length) {
        reasons.push('high trust score and flexible settlement options');
      }

      return {
        listingId: listing.id,
        title: listing.name,
        reason: reasons.join('; '),
        confidence: Math.min(confidence, 99),
      };
    })
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);

  res.json({
    shopperContext: {
      country: shopperCountry ?? 'any',
      category: shopperCategory ?? 'any',
    },
    items: rankedRecommendations,
  });
});

app.post('/api/ai/merchant-copilot', (req: Request, res: Response) => {
  const {
    productName = 'Marketplace product',
    category = 'General goods',
    country = 'Africa',
    settlement = 'crypto and mobile money',
  } = (req.body ?? {}) as Partial<{
    productName: string;
    category: string;
    country: string;
    settlement: string;
  }>;

  const result: MerchantCopilotResult = {
    headline: `${productName} ready for trusted checkout across ${country}`,
    description: `${productName} is positioned as a reliable ${category.toLowerCase()} offer with transparent delivery expectations and settlement through ${settlement}.`,
    riskFlags: [
      'Clarify dispatch timelines to reduce post-payment uncertainty.',
      'State wallet or mobile money compatibility directly in the first sentence.',
    ],
    trustNudges: [
      'Highlight merchant location and fulfillment speed near the buy action.',
      'Include proof of authenticity, freshness, or product condition where relevant.',
    ],
  };

  res.json({
    model: 'StellarMarket Merchant Copilot v1',
    input: {
      productName,
      category,
      country,
      settlement,
    },
    result,
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
