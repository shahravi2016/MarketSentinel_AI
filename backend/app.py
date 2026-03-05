from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from src.data_loader import fetch_stock_data
from src.feature_engineering import calculate_features
from src.anomaly_detector import detect_anomalies
from src.context_analyzer import analyze_context
from src.risk_engine import calculate_risk, generate_reasons
import pandas as pd
import json

app = FastAPI(title="MarketSentinel AI API")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/analyze/{ticker}")
async def analyze_stock(ticker: str):
    """
    Runs the AI pipeline for a given ticker and returns analysis as JSON.
    """
    try:
        # Run AI Pipeline
        df = fetch_stock_data(ticker)
        df = calculate_features(df)
        df = detect_anomalies(df)
        df = analyze_context(df, ticker)
        df = calculate_risk(df)
        
        # Prepare response (last 30 days)
        last_30 = df.tail(30).copy()
        last_30['date'] = last_30.index.strftime('%Y-%m-%d')
        
        # Find suspicious events (risk > 70%)
        suspicious_events = df[df['manipulation_risk'] > 70].copy()
        avg_volatility = df['volatility'].mean()
        
        if not suspicious_events.empty:
            # Sort by date descending to show most recent first
            suspicious_events = suspicious_events.sort_index(ascending=False).head(10)
            suspicious_events['date'] = suspicious_events.index.strftime('%Y-%m-%d')
            suspicious_events['reason'] = suspicious_events.apply(generate_reasons, axis=1, args=(avg_volatility,))
            suspicious_list = suspicious_events[['date', 'manipulation_risk', 'reason']].to_dict(orient='records')
        else:
            suspicious_list = []
        
        # Summary statistics
        latest_risk = df['manipulation_risk'].iloc[-1]
        
        return {
            "ticker": ticker,
            "latest_risk": float(latest_risk),
            "summary": {
                "price": float(df['close'].iloc[-1]),
                "volume": int(df['volume'].iloc[-1]),
                "avg_volatility": float(avg_volatility)
            },
            "history": last_30[['date', 'close', 'volume', 'rel_volume', 'manipulation_risk']].to_dict(orient='records'),
            "suspicious_events": suspicious_list
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
