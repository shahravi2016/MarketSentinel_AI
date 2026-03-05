from src.data_loader import fetch_stock_data
from src.feature_engineering import calculate_features
from src.anomaly_detector import detect_anomalies
from src.context_analyzer import analyze_context
from src.risk_engine import calculate_risk, generate_reasons
from src.visualizer import visualize_results
import sys

def run_pipeline(ticker: str):
    """
    Runs the full MarketSentinel AI pipeline.
    """
    print(f"\n--- MarketSentinel AI: Starting analysis for {ticker} ---")
    
    try:
        # 1. Fetch data
        df = fetch_stock_data(ticker)
        
        # 2. Feature engineering
        df = calculate_features(df)
        
        # 3. Anomaly detection
        df = detect_anomalies(df)
        
        # 4. Context analysis
        df = analyze_context(df, ticker)
        
        # 5. Risk Scoring
        df = calculate_risk(df)
        
        # 6. Report findings
        high_risk_events = df[df['manipulation_risk'] > 80].tail(5)
        
        print(f"\nAnalysis Complete for {ticker}")
        print("-" * 30)
        
        if not high_risk_events.empty:
            print(f"Top {len(high_risk_events)} Suspicious Events Detected:")
            for date, row in high_risk_events.iterrows():
                reasons = generate_reasons(row)
                print(f"\nDate: {date.date()}")
                print(f"Manipulation Risk: {row['manipulation_risk']}%")
                print(f"Reasons: {reasons}")
        else:
            print("No high-risk manipulation events detected in the recent period.")
            
        # 7. Visualize
        visualize_results(df, ticker)
        
    except Exception as e:
        print(f"Error running pipeline: {e}")

if __name__ == "__main__":
    target_ticker = input("Enter Stock Ticker (e.g., TSLA, GME): ").upper() or "TSLA"
    run_pipeline(target_ticker)
