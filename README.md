🐾 Paw Rescue — Frontend Internship Projects
A collection of front-end development tasks built during the Codveda Technologies Frontend Development Internship. All projects are built around a unified fictional brand — Paw Rescue, a stray animal rescue initiative — to maintain a consistent visual identity across tasks.
📁 Project Structure
paw-rescue-projects/
├── landing-page/        → Level 1 Task 1: Responsive Landing Page
├── intractive-form/     → Level 1 Task 2: Interactive Form
├── tailwind-ui/         → Level 2 Task 3: CSS Framework UI
└── api-weather/         → Level 2 Task 2: REST API Integration
🗂️ Tasks Overview
Level 1 — Task 1: Responsive Landing Page
Folder: landing-page/
A fully responsive landing page for the Paw Rescue brand built with semantic HTML, CSS Flexbox/Grid, and vanilla JavaScript.
Features:
Sticky navbar with mobile hamburger menu
Hero section with custom glowing paw SVG illustration
Stats strip (12k+ meals, 800+ rescues, 24/7 on call)
Feature cards — Feeding Drives, Emergency Rescue, Medical Aid, Adoption Help
Scroll-triggered fade-in animations
CTA section and footer
Fully responsive across mobile, tablet, and desktop
Tech: HTML5 · CSS3 (Flexbox + Grid + Media Queries) · Vanilla JavaScript
Level 1 — Task 2: Interactive Form
Folder: intractive-form/
A volunteer signup form with real-time JavaScript validation and smooth UX interactions.
Features:
Fields: Full Name, Email, Phone Number, Password
Real-time validation on input and blur events
Dynamic error/success messages without page reload
Password strength meter (Weak / Medium / Strong)
Show/hide password toggle
Animated success confirmation panel on submit
Same Paw Rescue brand theme (warm amber/charcoal)
Tech: HTML5 · CSS3 · Vanilla JavaScript (DOM manipulation, event listeners)
Level 2 — Task 3: CSS Framework UI
Folder: tailwind-ui/
A "How It Works" page built entirely with Tailwind CSS, demonstrating utility-first framework usage with a custom brand theme.
Features:
Custom Tailwind config with Paw Rescue brand colors and fonts
4-step process section with connector line (desktop) and numbered cards
Stats strip and CTA section
Scroll-triggered reveal animations
Fully responsive (mobile-first Tailwind breakpoints)
Single-file implementation (HTML + Tailwind CDN + JS)
Tech: HTML5 · Tailwind CSS (CDN + custom config) · Vanilla JavaScript
Level 2 — Task 2: REST API Integration
Folder: api-weather/
A real-time Weather & Stray Risk Analyzer that fetches live weather data and calculates how dangerous current conditions are for stray animals in any city.
Features:
Live weather data via OpenWeather API (Fetch + async/await)
Displays temperature, feels like, humidity, wind speed, weather icon
Custom Stray Risk Level calculator (Low / Medium / High) based on weather conditions
Contextual tips for each risk level (what volunteers can do today)
Debounced search input for performance
Loading spinner and graceful error handling (city not found, network error, API error)
Recent searches stored in localStorage
Auto-loads Delhi weather on page open as demo
Tech: HTML5 · CSS3 · Vanilla JavaScript · OpenWeather API · Fetch API · Async/Await
Note: To run the API project locally, replace YOUR_API_KEY_HERE in api-weather/script.js line 5 with your free API key from openweathermap.org.
🎨 Design System
All projects share a unified Paw Rescue visual identity:
Token
Value
Usage
Background
#1A1714
Page background
Amber
#E8A24B
Primary accent, CTAs
Sage Green
#7C9070
Secondary accent, success states
Cream
#F7F1E8
Body text
Card
#2B2520
Card/surface backgrounds
Fonts: Fraunces (display/headings) · Inter (body)
🚀 Running Locally
All projects are plain HTML/CSS/JS — no build step required.
Clone the repo:
Bash
Open any project folder in VS Code
Right-click index.html → "Open with Live Server"
👨‍💻 Author
Suraj Singh
3rd Year B.Tech CSE Student | Aspiring Software Developer

Built as part of the Codveda Technologies Front-End Development Internship. All projects use a fictional NGO brand for practice purposes.