import pandas as pd

def calculate_risk(df: pd.DataFrame):
    """
    Combines anomaly scores and context scores into a final manipulation risk score.
    """
    # Manipulation Risk formula
    df['manipulation_risk'] = (df['anomaly_score'] * 0.6) + (df['context_score'] * 0.4)
    
    # Scale to percentage
    df['manipulation_risk'] = (df['manipulation_risk'] * 100).round(2)
    
    return df

def generate_reasons(row):
    """
    Generates human-readable reasons for high risk.
    """
    reasons = []
    
    # Technical Signals
    if row['price_change'] > 0.05:
        reasons.append(f"Price surged {row['price_change']*100:.1f}%")
    if row['rel_volume'] > 2.5:
        reasons.append(f"Volume spiked {row['rel_volume']:.1f}x above average")
    
    # Contextual Signals (The "Why")
    if not row['has_news'] and not row['is_earnings_day']:
        if row['price_change'] > 0.05 or row['rel_volume'] > 2.5:
            reasons.append("NO major news or earnings detected to justify this move")
    elif row['has_news']:
        reasons.append("News detected, but move exceeds typical market reaction")
    
    if row['market_diff_score'] > 0.8:
        reasons.append("Movement decoupled from broader market (SPY) trends")

    if row['volatility'] > row['volatility'].mean() * 1.5:
        reasons.append("Abnormal volatility detected")
    
    return " | ".join(reasons) if reasons else "Normal market activity."

if __name__ == "__main__":
    from src.data_loader import fetch_stock_data
    from src.feature_engineering import calculate_features
    from src.anomaly_detector import detect_anomalies
    from src.context_analyzer import analyze_context
    
    ticker = "TSLA"
    raw_data = fetch_stock_data(ticker)
    features = calculate_features(raw_data)
    anomalies = detect_anomalies(features)
    context = analyze_context(anomalies, ticker)
    risk_df = calculate_risk(context)
    
    high_risk = risk_df[risk_df['manipulation_risk'] > 75]
    print(high_risk[['manipulation_risk']].tail())
