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

async function getMarketplaceData() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    return { summary: fallbackSummary, listings: fallbackListings, apiConnected: false };
  }

  try {
    const [summaryResponse, listingsResponse] = await Promise.all([
      fetch(`${baseUrl}/api/marketplace/summary`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/listings`, { next: { revalidate: 60 } }),
    ]);

    if (!summaryResponse.ok || !listingsResponse.ok) {
      throw new Error('API request failed');
    }

    const summary = (await summaryResponse.json()) as Summary;
    const listingsPayload = (await listingsResponse.json()) as { items: Listing[] };

    return {
      summary,
      listings: listingsPayload.items,
      apiConnected: true,
    };
  } catch (_error) {
    return { summary: fallbackSummary, listings: fallbackListings, apiConnected: false };
  }
}

export default async function HomePage() {
  const { summary, listings, apiConnected } = await getMarketplaceData();

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
            <a className="secondary-action" href="#why-stellarmarket">
              Why it works
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
            <h3>API-backed storytelling</h3>
            <p>The homepage is ready to switch from demo content to live backend metrics with one env var.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
