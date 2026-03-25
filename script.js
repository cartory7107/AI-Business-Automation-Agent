const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

themeToggle?.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  themeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
});

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2.5 + 0.8,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
  }));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(127, 214, 255, 0.6)';
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 140) {
        ctx.strokeStyle = `rgba(140,220,255,${(140 - d) / 700})`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(draw);
}

resize();
createParticles();
draw();
window.addEventListener('resize', () => {
  resize();
  createParticles();
});

const countryInput = document.getElementById('country-input');
const countryList = document.getElementById('country-list');
const refreshButton = document.getElementById('refresh-trends');
const highlightNiche = document.getElementById('highlight-niche');
const liveTopic = document.getElementById('live-topic');
const liveKeyword = document.getElementById('live-keyword');
const uploadSuggestion = document.getElementById('upload-suggestion');
const viralScoreEl = document.getElementById('viral-score');
const viralBar = document.getElementById('viral-bar');
const signalBreakdown = document.getElementById('signal-breakdown');
const lastUpdate = document.getElementById('last-update');
const trendStatus = document.getElementById('trend-status');
const firecrawlKeyInput = document.getElementById('firecrawl-key');
const saveKeyBtn = document.getElementById('save-firecrawl-key');

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia',
  'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
  'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad',
  'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', "Cote d'Ivoire", 'Croatia', 'Cuba', 'Cyprus',
  'Czech Republic', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji',
  'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala',
  'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran',
  'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
  'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius',
  'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia',
  'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia',
  'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
  'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
  'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal',
  'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
  'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland',
  'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago',
  'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

const COUNTRY_TO_GEO = {
  'United States': 'US', 'United Kingdom': 'GB', Bangladesh: 'BD', India: 'IN', Canada: 'CA', Australia: 'AU', Germany: 'DE',
  France: 'FR', Brazil: 'BR', Japan: 'JP', 'South Korea': 'KR', 'Saudi Arabia': 'SA', Indonesia: 'ID', Turkey: 'TR',
  Italy: 'IT', Spain: 'ES', Mexico: 'MX', Netherlands: 'NL', Singapore: 'SG', Malaysia: 'MY', Pakistan: 'PK'
};

const NICHE_KEYWORDS = {
  Gaming: ['game', 'esports', 'roblox', 'minecraft', 'stream'],
  Football: ['football', 'soccer', 'goal', 'match', 'transfer'],
  Education: ['exam', 'study', 'learning', 'course', 'tutorial'],
  Motivation: ['motivation', 'discipline', 'success', 'habit', 'mindset'],
  Technology: ['ai', 'tech', 'software', 'automation', 'gadget'],
  Finance: ['finance', 'money', 'crypto', 'stock', 'invest'],
  Entertainment: ['music', 'celebrity', 'movie', 'drama', 'show'],
  'Shorts trends': ['shorts', 'viral', 'trend', 'challenge', 'clip']
};

function seededRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash << 5) - hash + seed.charCodeAt(i);
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

function scoreFromRange(seed, min, max) {
  return min + seededRandom(seed) * (max - min);
}

function calculateViralScore(signals) {
  const weighted =
    0.3 * signals.trendStrength +
    0.2 * signals.keywordDemand +
    0.2 * signals.competitorGap +
    0.2 * signals.ctrPrediction +
    0.1 * signals.watchtimePrediction;

  return Math.max(40, Math.min(95, Math.round(weighted)));
}

function extractNicheScores(text) {
  const lower = text.toLowerCase();
  return Object.entries(NICHE_KEYWORDS)
    .map(([niche, words]) => {
      const hits = words.reduce((acc, word) => acc + (lower.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length, 0);
      return { niche, hits };
    })
    .sort((a, b) => b.hits - a.hits);
}

function getFallbackSignals(country) {
  const ranked = Object.keys(NICHE_KEYWORDS)
    .map((niche) => ({ niche, strength: scoreFromRange(`${country}-${niche}`, 45, 99) }))
    .sort((a, b) => b.strength - a.strength);

  const top = ranked[0];
  const words = NICHE_KEYWORDS[top.niche];
  const topic = `${words[0]} trend in ${country}`;

  return {
    source: 'Local fallback model (no Firecrawl key)',
    topNiche: top.niche,
    topic,
    keyword: `${words[1]} ${country.toLowerCase()} trending`,
    uploadTime: `${Math.round(scoreFromRange(`${country}-hour`, 16, 23))}:00 - 22:00 local peak`,
    signals: {
      trendStrength: scoreFromRange(`${country}-trend`, 60, 96),
      keywordDemand: scoreFromRange(`${country}-keyword`, 58, 94),
      competitorGap: scoreFromRange(`${country}-gap`, 50, 93),
      ctrPrediction: scoreFromRange(`${country}-ctr`, 52, 95),
      watchtimePrediction: scoreFromRange(`${country}-watchtime`, 55, 92),
      uploadVelocity: scoreFromRange(`${country}-velocity`, 50, 95)
    }
  };
}

async function firecrawlScrape(url, key) {
  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      url,
      formats: ['markdown']
    })
  });

  if (!response.ok) throw new Error(`Firecrawl scrape failed (${response.status})`);
  const data = await response.json();
  return data?.data?.markdown || '';
}

async function getFirecrawlSignals(country) {
  const key = localStorage.getItem('firecrawl_api_key');
  if (!key) return getFallbackSignals(country);

  const geo = COUNTRY_TO_GEO[country] || 'US';
  const googleTrendsUrl = `https://trends.google.com/trending?geo=${geo}`;
  const youtubeTrendingUrl = `https://www.youtube.com/feed/trending?gl=${geo}`;

  try {
    trendStatus.textContent = 'Fetching live trend signals via Firecrawl...';
    const [googleText, youtubeText] = await Promise.all([
      firecrawlScrape(googleTrendsUrl, key),
      firecrawlScrape(youtubeTrendingUrl, key)
    ]);

    const combined = `${googleText}\n${youtubeText}`.trim();
    if (!combined) throw new Error('Empty scraped content');

    const rankedNiches = extractNicheScores(combined);
    const topNiche = rankedNiches[0]?.niche || 'Technology';
    const strongestWord = NICHE_KEYWORDS[topNiche][0];

    const density = Math.min(100, combined.length / 180);
    const nicheStrength = Math.min(100, (rankedNiches[0]?.hits || 1) * 8 + 45);

    return {
      source: 'Firecrawl live scrape',
      topNiche,
      topic: `${topNiche} now trending in ${country}`,
      keyword: `${strongestWord} ${country.toLowerCase()} live spike`,
      uploadTime: `${Math.round(scoreFromRange(`${country}-hour-live`, 17, 23))}:00 - 23:00 local peak`,
      signals: {
        trendStrength: Math.max(45, Math.min(98, density + 35)),
        keywordDemand: Math.max(45, Math.min(96, nicheStrength)),
        competitorGap: Math.max(40, Math.min(90, 88 - (rankedNiches[0]?.hits || 2))),
        ctrPrediction: Math.max(45, Math.min(95, 50 + (rankedNiches[0]?.hits || 1) * 4)),
        watchtimePrediction: Math.max(45, Math.min(94, 52 + (rankedNiches[0]?.hits || 1) * 3.5)),
        uploadVelocity: Math.max(45, Math.min(97, density + 30))
      }
    };
  } catch (error) {
    trendStatus.textContent = `Firecrawl unavailable: ${error.message}. Using fallback mode.`;
    return getFallbackSignals(country);
  }
}

function renderSignals(payload) {
  const score = calculateViralScore(payload.signals);
  highlightNiche.textContent = `📈 Top Niche: ${payload.topNiche}`;
  liveTopic.textContent = `Live trending topic: ${payload.topic}`;
  liveKeyword.textContent = `Live keyword spike: ${payload.keyword}`;
  uploadSuggestion.textContent = `Best upload timing: ${payload.uploadTime}`;
  viralScoreEl.textContent = `${score}%`;
  viralBar.style.width = `${score}%`;
  lastUpdate.textContent = new Date().toLocaleString();
  trendStatus.textContent = `Source: ${payload.source}`;

  signalBreakdown.innerHTML = [
    `Trend strength: ${Math.round(payload.signals.trendStrength)}%`,
    `Keyword demand: ${Math.round(payload.signals.keywordDemand)}%`,
    `Competitor engagement gap: ${Math.round(payload.signals.competitorGap)}%`,
    `Recent upload velocity: ${Math.round(payload.signals.uploadVelocity)}%`,
    `CTR prediction: ${Math.round(payload.signals.ctrPrediction)}%`,
    `Watchtime prediction: ${Math.round(payload.signals.watchtimePrediction)}%`
  ].map((item) => `<li>${item}</li>`).join('');
}

async function refreshTrends() {
  const selected = COUNTRIES.includes(countryInput.value) ? countryInput.value : 'United States';
  countryInput.value = selected;
  const data = await getFirecrawlSignals(selected);
  renderSignals(data);
}

function populateCountries() {
  countryList.innerHTML = COUNTRIES.map((country) => `<option value="${country}"></option>`).join('');
}

populateCountries();
countryInput.value = 'Bangladesh';
firecrawlKeyInput.value = localStorage.getItem('firecrawl_api_key') || '';
refreshTrends();

saveKeyBtn?.addEventListener('click', () => {
  const key = firecrawlKeyInput.value.trim();
  if (!key) {
    localStorage.removeItem('firecrawl_api_key');
    trendStatus.textContent = 'Firecrawl key removed. Running in fallback mode.';
    refreshTrends();
    return;
  }
  localStorage.setItem('firecrawl_api_key', key);
  trendStatus.textContent = 'Firecrawl key saved. Refreshing live trends...';
  refreshTrends();
});

countryInput?.addEventListener('change', refreshTrends);
refreshButton?.addEventListener('click', refreshTrends);
setInterval(refreshTrends, 6 * 60 * 60 * 1000);
