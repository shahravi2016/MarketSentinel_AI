# MarketSentinel AI 🛡️📈

**MarketSentinel AI** is a state-of-the-art, context-aware surveillance system designed to identify and investigate potential stock market manipulation. By synthesizing statistical anomaly detection with real-world contextual reasoning, the platform provides transparency into "unjustified" market behavior.

---

## 🚀 Key Features

- **Multi-Layered Anomaly Detection**: Employs the **Isolation Forest** machine learning algorithm to identify multi-dimensional outliers across price, volume, and volatility.
- **Contextual Intelligence Engine**: Automatically cross-references statistical anomalies with live **News Signals**, **Earnings Calendars**, and **Sector Correlations** to determine if a move is fundamentally justified.
- **LLM-Powered Forensic Audits**: Integrated with **Google Gemini AI** to generate deep-dive narrative reports on specific "Shock Events," providing human-readable investigations into complex market signatures.
- **Dynamic Risk Scoring**: Quantifies the probability of manipulation on a 0-100% scale, updated in real-time based on the latest surveillance data.
- **Immersive Surveillance Dashboard**: A high-fidelity Next.js interface featuring 3D particle backgrounds, animated search nodes, and high-density data visualizations.

---

## 📈 How It Works (Surveillance Pipeline)

1.  **Data Ingestion**: The system pulls high-resolution historical and real-time OHLCV data via the `yfinance` API.
2.  **Neural Feature Engineering**: We calculate advanced technical features, including rolling standard deviation (volatility), relative volume (accumulation ratio), and sector-relative price deltas.
3.  **Statistical Outlier Analysis**: The backend passes these features through an **Isolation Forest** model, which assigns an "anomaly score" to every data point.
4.  **Contextual Synthesis**: For every flagged anomaly, the AI interrogates external signals:
    *   *News Verification*: Was there a relevant press release or SEC filing?
    *   *Earnings Sync*: Is the move synchronized with a scheduled financial report?
    *   *Market Decoupling*: Did the stock move independently of the S&P 500 (SPY)?
5.  **Forensic Reporting**: Users can trigger a **Gemini AI Audit** on any suspicious event. The AI analyzes the raw data signature and contextual news to produce a professional forensic report.

---

## 📊 Analytics & Visualizations

MarketSentinel AI utilizes a suite of professional charts to provide a comprehensive view of asset integrity:

### 1. Neural Frequency Analysis (Signal vs. Shock Pulse)
This primary chart overlays the **Asset Price Index** with **Shock Pulses** (high-risk moments).
*   **Why it makes sense**: It allows analysts to immediately see the correlation between price action and manipulation risk. A price surge accompanied by a "Shock Pulse" indicates a move that is statistically abnormal and contextually unsupported.

### 2. Risk Probability Trend (Probabilistic Forecast)
A dedicated area chart visualizing the **Manipulation Risk Score** (0–100%) over time.
*   **Why it makes sense**: It provides a standalone "Heat Check" for the asset. Sustained high risk levels indicate a period of instability or coordinated accumulation/distribution that requires investigation.

### 3. Volume Intensity Distribution (Accumulation Analytics)
A bar chart representing trading volume, dynamically colored based on risk intensity.
*   **Why it makes sense**: High-volume "Shock Bars" (pink) highlight periods of intense market activity that the AI has flagged as anomalous. This is critical for identifying "Wash Trading" or "Pump and Dump" footprints.

### 4. Volumetric Stress Heatmap (Variance Clustering)
Visualizes **Price Variance (Volatility)** as a purple pulse graph.
*   **Why it makes sense**: Market stress often precedes or accompanies manipulation. By mapping variance clusters, analysts can identify periods of "Neural Stress" where the asset is behaving chaotically compared to its historical norm.

---

## 🛠️ Technology Stack

### Backend (AI & Intelligence)
- **Python 3.11+** | **FastAPI**
- **Scikit-learn**: Isolation Forest Algorithm.
- **Pandas & NumPy**: High-performance data manipulation.
- **Google Gemini API**: Forensic narrative generation.

### Frontend (Command & Control)
- **Next.js 15 (App Router)** | **TypeScript**
- **Tailwind CSS**: Professional dark-mode surveillance aesthetic.
- **Recharts**: High-density data plotting.
- **Framer Motion**: Smooth interface transitions and animations.
- **Three.js (React Three Fiber)**: Immersive 3D background environments.

---

## ⚙️ Setup & Installation

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
# Ensure you have your GOOGLE_API_KEY set in your environment
python app.py
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🛡️ Disclaimer
MarketSentinel AI is a research and surveillance tool for identifying statistical patterns. It does not constitute financial advice and is intended for educational and analytical purposes only.
