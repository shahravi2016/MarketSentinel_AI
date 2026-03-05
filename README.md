# MarketSentinel AI 🛡️📈

MarketSentinel AI is an intelligent system designed to detect potential stock market manipulation by analyzing price behavior, trading volume, and contextual market signals (News & Earnings).

Unlike traditional anomaly detection, MarketSentinel AI evaluates whether unusual price movements are **justified** by real-world events.

---

## 🚀 Key Features

- **AI Anomaly Detection**: Uses the **Isolation Forest** machine learning model to detect abnormal price and volume spikes.
- **Contextual Intelligence**: Cross-references market anomalies with live **News** and **Earnings** data via `yfinance`.
- **Market Correlation Analysis**: Compares stock movements against the S&P 500 (SPY) to identify decoupling.
- **Manipulation Risk Scoring**: Generates a 0-100% risk score with human-readable reasoning.
- **Modern Dashboard**: High-performance Next.js frontend with real-time charting using Recharts.

---

## 🛠️ Technology Stack

### Backend (AI & API)
- **Python 3.11+**
- **FastAPI**: High-performance web framework.
- **Scikit-learn**: Isolation Forest for anomaly detection.
- **Pandas/Numpy**: Data processing and feature engineering.
- **yfinance**: Real-time market data, news, and earnings fetching.

### Frontend (Dashboard)
- **Next.js 15 (App Router)**
- **Tailwind CSS**: Modern styling.
- **Recharts**: Data visualization.
- **Lucide React**: Iconography.
- **TypeScript**: Type safety.

---

## 📂 Project Structure

```text
MarketSentinel_AI/
├── backend/
│   ├── src/                    # AI logic modules
│   │   ├── data_loader.py      # Fetches stock data
│   │   ├── feature_engineering.py # Technical indicators
│   │   ├── anomaly_detector.py # Isolation Forest Model
│   │   ├── context_analyzer.py # News/Earnings analysis
│   │   └── risk_engine.py      # Final risk calculation
│   ├── app.py                  # FastAPI server
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── src/app/                # Next.js pages
│   └── tailwind.config.ts      # UI configuration
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Backend Setup
```bash
cd backend
# Install dependencies
pip install -r requirements.txt
# Start the FastAPI server
python app.py
```
The backend will run at `http://localhost:8000`.

### 2. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install
# Start the development server
npm run dev
```
The dashboard will be available at `http://localhost:3000`.

---

## 📈 How it Works (The AI Pipeline)

1. **Data Fetching**: Pulls historical OHLCV data for any ticker.
2. **Feature Engineering**: Calculates price change, volume relative to average, and volatility.
3. **Machine Learning**: The Isolation Forest model flags data points that deviate significantly from "normal" trading patterns.
4. **Contextual Validation**: The AI checks:
   - *"Is there news today?"*
   - *"Is it an earnings day?"*
   - *"Is the whole market moving, or just this stock?"*
5. **Risk Scoring**: If a spike happens with **No News** and **No Earnings** while the market is flat, the **Manipulation Risk** increases.
6. **Explanation**: The system provides clear reasons like *"Price surged 40% | NO major news detected to justify this move."*

---

## 🛡️ Disclaimer
MarketSentinel AI is an analysis and research tool. It does not provide financial advice or execute trades.
