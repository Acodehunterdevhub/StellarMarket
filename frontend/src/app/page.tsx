type Summary = {
  activeMerchants: number;
  countriesLive: number;
  weeklyVolumeUsd: number;
  avgSettlementMinutes: number;
  featuredListings: number;
};

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

const fallbackSummary: Summary = {
  activeMerchants: 1280,
  countriesLive: 9,
  weeklyVolumeUsd: 245000,
  avgSettlementMinutes: 4,
  featuredListings: 2,
};

const fallbackListings: Listing[] = [
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
];

const fallbackRecommendations: AiRecommendation[] = [
  {
    listingId: 'phone-ke',
    title: 'Refurbished Android Bundle',
    reason: 'electronics demand is strong and same-day regional settlement is supported',
    confidence: 97,
  },
  {
    listingId: 'solar-kit-ng',
    title: 'Solar Starter Kit',
    reason: 'high-trust merchant profile with practical cross-border utility',
    confidence: 95,
  },
  {
    listingId: 'produce-rw',
    title: 'Farm Fresh Produce Crate',
    reason: 'fast fulfillment and wallet-friendly local checkout options',
    confidence: 90,
  },
];

const fallbackInsights: AiInsight[] = [
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

const fallbackCopilot: MerchantCopilotResult = {
  headline: 'Solar Starter Kit ready for trusted checkout across Nigeria',
  description:
    'Solar Starter Kit is positioned as a reliable energy offer with transparent delivery expectations and settlement through USDC and NGN bank transfer.',
  riskFlags: [
    'Clarify dispatch timelines to reduce post-payment uncertainty.',
    'State wallet or mobile money compatibility directly in the first sentence.',
  ],
  trustNudges: [
    'Highlight merchant location and fulfillment speed near the buy action.',
    'Include proof of authenticity, freshness, or product condition where relevant.',
  ],
};

async function getMarketplaceData() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    return {
      summary: fallbackSummary,
      listings: fallbackListings,
      recommendations: fallbackRecommendations,
      insights: fallbackInsights,
      copilot: fallbackCopilot,
      apiConnected: false,
    };
  }

  try {
    const [summaryResponse, listingsResponse, recommendationsResponse, insightsResponse] =
      await Promise.all([
      fetch(`${baseUrl}/api/marketplace/summary`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/listings`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/ai/recommendations?country=Kenya&category=Electronics`, {
        next: { revalidate: 60 },
      }),
      fetch(`${baseUrl}/api/ai/insights`, { next: { revalidate: 60 } }),
    ]);

    const copilotResponse = await fetch(`${baseUrl}/api/ai/merchant-copilot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productName: 'Solar Starter Kit',
        category: 'Energy',
        country: 'Nigeria',
        settlement: 'USDC and NGN bank transfer',
      }),
      next: { revalidate: 60 },
    });

    if (
      !summaryResponse.ok ||
      !listingsResponse.ok ||
      !recommendationsResponse.ok ||
      !insightsResponse.ok ||
      !copilotResponse.ok
    ) {
      throw new Error('API request failed');
    }

    const summary = (await summaryResponse.json()) as Summary;
    const listingsPayload = (await listingsResponse.json()) as { items: Listing[] };
    const recommendationsPayload =
      (await recommendationsResponse.json()) as { items: AiRecommendation[] };
    const insightsPayload = (await insightsResponse.json()) as { items: AiInsight[] };
    const copilotPayload = (await copilotResponse.json()) as { result: MerchantCopilotResult };

    return {
      summary,
      listings: listingsPayload.items,
      recommendations: recommendationsPayload.items,
      insights: insightsPayload.items,
      copilot: copilotPayload.result,
      apiConnected: true,
    };
  } catch (_error) {
    return {
      summary: fallbackSummary,
      listings: fallbackListings,
      recommendations: fallbackRecommendations,
      insights: fallbackInsights,
      copilot: fallbackCopilot,
      apiConnected: false,
    };
  }
}

export default async function HomePage() {
  const { summary, listings, recommendations, insights, copilot, apiConnected } =
    await getMarketplaceData();

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Cross-border commerce for African markets</span>
          <h1>Buy, sell, and settle with crypto or mobile money in minutes.</h1>
          <p className="hero-text">
            StellarMarket connects verified merchants, faster settlement rails, and
            mobile-first checkout flows for modern African trade.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#featured-listings">
              Explore listings
            </a>
            <a className="secondary-action" href="#ai-layer">
              See AI layer
            </a>
          </div>
          <div className="status-pill">
            <span className={apiConnected ? 'status-dot live' : 'status-dot'} />
            {apiConnected ? 'Live data from backend API' : 'Showing curated demo inventory'}
          </div>
        </div>
        <div className="hero-panel">
          <p className="panel-label">Weekly marketplace snapshot</p>
          <div className="panel-metric">
            <strong>${summary.weeklyVolumeUsd.toLocaleString()}</strong>
            <span>settled in the last 7 days</span>
          </div>
          <div className="panel-grid">
            <div>
              <strong>{summary.activeMerchants.toLocaleString()}</strong>
              <span>active merchants</span>
            </div>
            <div>
              <strong>{summary.countriesLive}</strong>
              <span>countries live</span>
            </div>
            <div>
              <strong>{summary.avgSettlementMinutes} min</strong>
              <span>average settlement</span>
            </div>
            <div>
              <strong>{summary.featuredListings}</strong>
              <span>featured drops</span>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-band">
        <div>
          <strong>Escrow-style confidence</strong>
          <span>Transparent merchant trust scores and predictable delivery windows.</span>
        </div>
        <div>
          <strong>Local payment fluency</strong>
          <span>Crypto rails meet mobile money and bank transfer habits shoppers already use.</span>
        </div>
        <div>
          <strong>Operator friendly</strong>
          <span>Designed for lean marketplaces that need fast launch velocity.</span>
        </div>
      </section>

      <section className="section-block ai-section" id="ai-layer">
        <div className="section-heading">
          <span className="eyebrow">AI Layer</span>
          <h2>Built-in marketplace intelligence for shoppers, merchants, and operators.</h2>
        </div>
        <div className="ai-grid">
          <article className="ai-card ai-card-strong">
            <p className="panel-label">Shopper recommendations</p>
            <div className="recommendation-stack">
              {recommendations.map((item) => (
                <div className="recommendation-item" key={item.listingId}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.reason}</p>
                  </div>
                  <strong>{item.confidence}%</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="ai-card">
            <p className="panel-label">Merchant copilot</p>
            <h3>{copilot.headline}</h3>
            <p>{copilot.description}</p>
            <div className="copilot-columns">
              <div>
                <span className="mini-label">Risk flags</span>
                <ul>
                  {copilot.riskFlags.map((flag) => (
                    <li key={flag}>{flag}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="mini-label">Trust nudges</span>
                <ul>
                  {copilot.trustNudges.map((nudge) => (
                    <li key={nudge}>{nudge}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section-block" id="featured-listings">
        <div className="section-heading">
          <span className="eyebrow">Featured inventory</span>
          <h2>Merchant-ready offers people can actually discover.</h2>
        </div>
        <div className="listing-grid">
          {listings.map((listing) => (
            <article className="listing-card" key={listing.id}>
              <div className="listing-meta">
                <span>{listing.category}</span>
                <span>{listing.country}</span>
              </div>
              <h3>{listing.name}</h3>
              <p>{listing.seller}</p>
              <div className="listing-price-row">
                <strong>{listing.price}</strong>
                <span>{listing.eta}</span>
              </div>
              <dl className="listing-details">
                <div>
                  <dt>Settlement</dt>
                  <dd>{listing.settlement}</dd>
                </div>
                <div>
                  <dt>Trust score</dt>
                  <dd>{listing.trustScore}%</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block section-alt" id="why-stellarmarket">
        <div className="section-heading">
          <span className="eyebrow">Why StellarMarket</span>
          <h2>A stronger foundation for pan-African marketplace growth.</h2>
        </div>
        <div className="feature-grid">
          <article>
            <h3>Fast settlement paths</h3>
            <p>Reduce payment lag with rails tuned for both stablecoins and familiar local options.</p>
          </article>
          <article>
            <h3>Trust-first merchant UX</h3>
            <p>Surface trust score, location, payout method, and delivery expectations right in the card.</p>
          </article>
          <article>
            <h3>AI-backed growth loops</h3>
            <p>Recommendations, merchant guidance, and operator insights now share the same backend surface.</p>
          </article>
        </div>
        <div className="insight-board">
          {insights.map((insight) => (
            <article className="insight-card" key={insight.title}>
              <span className={`priority-badge priority-${insight.priority}`}>
                {insight.priority} priority
              </span>
              <h3>{insight.title}</h3>
              <p>{insight.summary}</p>
              <strong>{insight.action}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
