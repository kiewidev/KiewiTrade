# TradeLens

<p align="center">
  <b>Trading Journal und Analyse App mit CSV Import, Trade Rekonstruktion aus Fills und sauberen Performance Insights.</b>
</p>

<!-- Demo Video -->
<p align="center">
  <b>Demo Video: https://github.com/user-attachments/assets/7b2127e8-9612-4a0f-ba9a-3960cca05582</b>
   
</p>

https://github.com/user-attachments/assets/7b2127e8-9612-4a0f-ba9a-3960cca05582
## Worum geht es
TradeLens hilft dir, Broker CSV Exporte zu importieren, einzelne Fills zu vollständigen Trades zusammenzusetzen und danach deine Performance, Ausführung und Disziplin auszuwerten. Fokus ist ein schneller Workflow wie bei TraderVue oder TradeZilla, aber als eigenes, erweiterbares Projekt.

## Highlights
1. CSV Import mit Preview und Column Mapping Templates  
2. Rekonstruktion kompletter Trades aus Fills inklusive Scale In und Scale Out  
3. FIFO Matching als Default  
4. Journaling mit Setups, Tags, Notizen, Emotionen und Regelverstößen  
5. Dashboards für KPIs, Equity Curve, Kalender und Drilldowns  

## Quickstart
1. Repo klonen
2. Docker starten
3. App öffnen

```bash
git clone https://github.com/DEIN_USER/DEIN_REPO.git
cd DEIN_REPO
docker compose up --build

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
