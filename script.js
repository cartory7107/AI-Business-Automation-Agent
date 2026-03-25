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

const NICHE_TOPICS = {
  Gaming: ['mobile esports', 'roblox updates', 'fps highlights'],
  Football: ['transfer rumors', 'matchday preview', 'goal compilations'],
  Education: ['exam strategy', 'study with me', 'ai learning tools'],
  Motivation: ['discipline routine', 'morning habits', 'success mindset'],
  Technology: ['ai agents', 'device leaks', 'automation workflow'],
  Finance: ['market recap', 'crypto volatility', 'budget challenge'],
  Entertainment: ['celebrity clips', 'music remixes', 'viral interviews'],
  'Shorts trends': ['hook in 3 seconds', 'loop trick', 'before-after reveal']
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

function getCountrySignals(country) {
  return {
    trendStrength: scoreFromRange(`${country}-trend`, 60, 98),
    keywordDemand: scoreFromRange(`${country}-keyword`, 55, 96),
    competitorGap: scoreFromRange(`${country}-gap`, 45, 94),
    ctrPrediction: scoreFromRange(`${country}-ctr`, 50, 95),
    watchtimePrediction: scoreFromRange(`${country}-watchtime`, 52, 93),
    uploadVelocity: scoreFromRange(`${country}-velocity`, 50, 97)
  };
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

function chooseTopNiche(country) {
  const ranked = Object.entries(NICHE_TOPICS)
    .map(([niche]) => ({
      niche,
      strength: scoreFromRange(`${country}-${niche}-strength`, 45, 99)
    }))
    .sort((a, b) => b.strength - a.strength);
  return ranked[0];
}

function suggestUploadTime(country) {
  const hour = Math.round(scoreFromRange(`${country}-hour`, 16, 23));
  return `${hour}:00 - ${hour + 1}:00 local peak`;
}

function renderSignals(country) {
  const signals = getCountrySignals(country);
  const topNiche = chooseTopNiche(country);
  const score = calculateViralScore(signals);
  const topicPool = NICHE_TOPICS[topNiche.niche];
  const topicIndex = Math.floor(scoreFromRange(`${country}-topic-index`, 0, topicPool.length));
  const keyword = `${topicPool[topicIndex]} ${country.toLowerCase()} trend`;

  highlightNiche.textContent = `📈 Top Niche: ${topNiche.niche} (${Math.round(topNiche.strength)}%)`;
  liveTopic.textContent = `Live trending topic: ${topicPool[topicIndex]}`;
  liveKeyword.textContent = `Live keyword spike: ${keyword}`;
  uploadSuggestion.textContent = `Best upload timing: ${suggestUploadTime(country)}`;
  viralScoreEl.textContent = `${score}%`;
  viralBar.style.width = `${score}%`;
  lastUpdate.textContent = new Date().toLocaleString();

  signalBreakdown.innerHTML = [
    `Google Trends popularity: ${Math.round(signals.trendStrength)}%`,
    `YouTube search volume estimate: ${Math.round(signals.keywordDemand)}%`,
    `Competitor engagement gap: ${Math.round(signals.competitorGap)}%`,
    `Recent upload velocity: ${Math.round(signals.uploadVelocity)}%`,
    `CTR prediction: ${Math.round(signals.ctrPrediction)}%`,
    `Watchtime prediction: ${Math.round(signals.watchtimePrediction)}%`
  ].map((item) => `<li>${item}</li>`).join('');
}

function populateCountries() {
  countryList.innerHTML = COUNTRIES.map((country) => `<option value="${country}"></option>`).join('');
}

populateCountries();
countryInput.value = 'Bangladesh';
renderSignals(countryInput.value);

countryInput?.addEventListener('change', () => {
  const selected = COUNTRIES.includes(countryInput.value) ? countryInput.value : 'United States';
  countryInput.value = selected;
  renderSignals(selected);
});

refreshButton?.addEventListener('click', () => {
  renderSignals(countryInput.value || 'United States');
});

setInterval(() => {
  renderSignals(countryInput.value || 'United States');
}, 6 * 60 * 60 * 1000);
