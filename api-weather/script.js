// ===================================================
// IMPORTANT: Replace YOUR_API_KEY_HERE with your
// OpenWeather API key (from openweathermap.org)
// ===================================================
const API_KEY = 'f5e73aa0160be0e8881ef2a6ee252298';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM refs
const cityInput   = document.getElementById('cityInput');
const searchBtn   = document.getElementById('searchBtn');
const searchHint  = document.getElementById('searchHint');
const loading     = document.getElementById('loading');
const errorState  = document.getElementById('errorState');
const errorTitle  = document.getElementById('errorTitle');
const errorText   = document.getElementById('errorText');
const results     = document.getElementById('results');
const recentWrap  = document.getElementById('recentWrap');
const recentTags  = document.getElementById('recentTags');

// Recent searches (max 5)
let recentCities = JSON.parse(localStorage.getItem('pr_recent') || '[]');

// ===== DEBOUNCE =====
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ===== STRAY RISK LOGIC =====
function getStrayRisk(data) {
  const temp     = data.main.temp;        // °C
  const humidity = data.main.humidity;    // %
  const windKph  = data.wind.speed * 3.6; // m/s → kph
  const condition = data.weather[0].main.toLowerCase();

  let level  = 'low';
  let reason = '';
  let tips   = [];

  // High risk conditions
  if (
    condition.includes('rain') ||
    condition.includes('storm') ||
    condition.includes('thunderstorm') ||
    condition.includes('drizzle') ||
    temp < 8 ||
    temp > 42 ||
    windKph > 50
  ) {
    level = 'high';
    if (condition.includes('rain') || condition.includes('storm') || condition.includes('drizzle')) {
      reason = 'Rain/storm conditions make it dangerous for strays — wet fur causes rapid body temperature drops, and traffic visibility is reduced.';
      tips = [
        'Check under vehicles and in drains — strays shelter there in rain',
        'Lay out dry food rather than wet food today',
        'If you spot a soaked/shivering animal, call our rescue line immediately',
        'Leave out a dry shelter (cardboard box, old crate) in your building',
      ];
    } else if (temp < 8) {
      reason = `At ${Math.round(temp)}°C, hypothermia risk is real — especially for young, old, or injured strays with no shelter.`;
      tips = [
        'Leave out warm, high-calorie food (khichdi, meat scraps)',
        'Place old blankets or newspapers in sheltered spots',
        'Check for shivering or lethargic animals — they need help now',
        'Volunteer for a night check-in round tonight',
      ];
    } else if (temp > 42) {
      reason = `At ${Math.round(temp)}°C, heat stroke is a serious risk — paws burn on hot pavement and dehydration sets in fast.`;
      tips = [
        'Leave out multiple bowls of fresh water in shaded spots',
        'Avoid walking or feeding strays between 11 AM–4 PM',
        'Look for panting, drooling, or disoriented animals — heat stroke signs',
        'Wet a cloth and place it in shade for animals to rest on',
      ];
    } else if (windKph > 50) {
      reason = `Strong winds (${Math.round(windKph)} kph) can cause debris injuries and make it hard for strays to find food and shelter.`;
      tips = [
        "Secure any food/water bowls you've placed outside",
        'Check for animals trapped under fallen objects',
        'Keep rescue line number handy — more calls expected today',
      ];
    }
  }

  // Medium risk
  else if (
    temp < 15 ||
    temp > 36 ||
    humidity > 85 ||
    condition.includes('mist') ||
    condition.includes('fog') ||
    condition.includes('haze')
  ) {
    level = 'medium';
    if (temp < 15) {
      reason = `Cool at ${Math.round(temp)}°C — strays are uncomfortable and need extra food for body heat.`;
      tips = [
        'Add a warm food option to your regular feeding spot',
        'Check for animals that look lethargic or hunched',
        'Consider leaving a cardboard box shelter nearby',
      ];
    } else if (temp > 36) {
      reason = `Hot at ${Math.round(temp)}°C — hydration becomes critical; pavement can cause paw burns.`;
      tips = [
        'Place water bowls in shaded areas',
        'Feed in the early morning or after sunset',
        'Watch for signs of heat exhaustion (excessive panting)',
      ];
    } else if (humidity > 85) {
      reason = `High humidity (${humidity}%) makes it feel much hotter and can cause respiratory stress in strays.`;
      tips = [
        'Ensure water bowls are clean and full',
        'Provide food in covered spots to prevent spoiling',
        'Watch for animals with laboured breathing',
      ];
    } else {
      reason = 'Low visibility conditions make strays harder to spot on roads — traffic accident risk increases.';
      tips = [
        'Drive carefully in fog/mist — animals may be on the road',
        'Check your usual feeding spots — animals may not find food easily',
        'Report any injured animals immediately',
      ];
    }
  }

  // Low risk
  else {
    level = 'low';
    reason = `Conditions are relatively comfortable at ${Math.round(temp)}°C — strays can manage today, but consistent care always helps.`;
    tips = [
      'Great day for a feeding drive — animals are active and visible',
      'Check water bowls and refill if needed',
      'Perfect time to observe animals that might need medical attention',
      'Consider surveying new areas for strays today',
    ];
  }

  return { level, reason, tips };
}

// ===== FETCH WEATHER =====
async function fetchWeather(city) {
  showState('loading');
  searchHint.textContent = '';

  try {
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 404) {
        showError('City not found', `We couldn't find "${city}". Check the spelling or try a nearby city.`);
      } else if (res.status === 401) {
        showError('API key error', 'Please check your OpenWeather API key in script.js.');
      } else {
        showError('Something went wrong', `Error ${res.status}. Please try again.`);
      }
      return;
    }

    renderResults(data);
    addRecentCity(data.name);

  } catch (err) {
    showError('Network error', 'Could not connect. Check your internet connection and try again.');
  }
}

// ===== RENDER RESULTS =====
function renderResults(data) {
  // Weather
  document.getElementById('cityName').textContent    = data.name;
  document.getElementById('countryName').textContent = data.sys.country;
  document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById('feelsLike').textContent   = `${Math.round(data.main.feels_like)}°C`;
  document.getElementById('humidity').textContent    = `${data.main.humidity}%`;
  document.getElementById('windSpeed').textContent   = `${Math.round(data.wind.speed * 3.6)} kph`;
  document.getElementById('weatherDesc').textContent = data.weather[0].description;
  document.getElementById('weatherIcon').src         = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  document.getElementById('weatherIcon').alt         = data.weather[0].description;

  // Risk
  const risk = getStrayRisk(data);
  const badge = document.getElementById('riskBadge');
  badge.className = `risk-badge ${risk.level}`;
  document.getElementById('riskLevel').textContent  = risk.level.charAt(0).toUpperCase() + risk.level.slice(1) + ' Risk';
  document.getElementById('riskReason').textContent = risk.reason;

  const tipsList = document.getElementById('tipsList');
  tipsList.innerHTML = risk.tips.map(tip => `<li>${tip}</li>`).join('');

  showState('results');
}

// ===== STATE HELPERS =====
function showState(state) {
  loading.hidden     = state !== 'loading';
  errorState.hidden  = state !== 'error';
  results.hidden     = state !== 'results';
}

function showError(title, text) {
  errorTitle.textContent = title;
  errorText.textContent  = text;
  showState('error');
}

// ===== RECENT CITIES =====
function addRecentCity(cityName) {
  recentCities = [cityName, ...recentCities.filter(c => c.toLowerCase() !== cityName.toLowerCase())].slice(0, 5);
  localStorage.setItem('pr_recent', JSON.stringify(recentCities));
  renderRecentTags();
}

function renderRecentTags() {
  if (!recentCities.length) { recentWrap.hidden = true; return; }
  recentWrap.hidden = false;
  recentTags.innerHTML = recentCities.map(city =>
    `<button class="recent-tag" data-city="${city}">${city}</button>`
  ).join('');

  recentTags.querySelectorAll('.recent-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      cityInput.value = tag.dataset.city;
      fetchWeather(tag.dataset.city);
    });
  });
}

// ===== EVENTS =====
const debouncedFetch = debounce((val) => {
  if (val.trim().length >= 3) fetchWeather(val.trim());
}, 600);

cityInput.addEventListener('input', (e) => {
  debouncedFetch(e.target.value);
});

cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const val = cityInput.value.trim();
    if (!val) { searchHint.textContent = 'Please enter a city name.'; return; }
    fetchWeather(val);
  }
});

searchBtn.addEventListener('click', () => {
  const val = cityInput.value.trim();
  if (!val) { searchHint.textContent = 'Please enter a city name.'; return; }
  fetchWeather(val);
});

// Init recent tags on load
renderRecentTags();

// Auto-load Delhi on start for instant demo feel
window.addEventListener('load', () => {
  cityInput.value = 'Delhi';
  fetchWeather('Delhi');
});