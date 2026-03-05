import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta

def analyze_context(df: pd.DataFrame, ticker: str):
    """
    Analyzes contextual signals (Market Correlation, News, and Earnings).
    """
    print(f"Analyzing contextual signals for {ticker}...")
    stock = yf.Ticker(ticker)
    
    # 1. Market Correlation (SPY)
    start_date = df.index.min().strftime('%Y-%m-%d')
    end_date = df.index.max().strftime('%Y-%m-%d')
    spy_data = yf.download("SPY", start=start_date, end=end_date, progress=False)
    
    if not spy_data.empty:
        if df.index.tz is not None: df.index = df.index.tz_localize(None)
        if spy_data.index.tz is not None: spy_data.index = spy_data.index.tz_localize(None)
        spy_returns = spy_data['Close'].pct_change().fillna(0).reindex(df.index, method='pad')
        diff = abs(df['price_change'] - spy_returns.values.flatten())
        df['market_diff_score'] = (diff - diff.min()) / (diff.max() - diff.min())
    else:
        df['market_diff_score'] = 0.5

    # 2. News Analysis
    news = stock.news
    df['has_news'] = False
    for article in news:
        # Convert pubtime to date string
        pub_date = datetime.fromtimestamp(article['providerPublishTime']).strftime('%Y-%m-%d')
        if pub_date in df.index.strftime('%Y-%m-%d'):
            df.loc[df.index.strftime('%Y-%m-%d') == pub_date, 'has_news'] = True

    # 3. Earnings Check
    try:
        earnings_dates = stock.calendar
        # Check if 'Earnings Date' exists and is a list/index
        if earnings_dates is not None and 'Earnings Date' in earnings_dates:
            e_dates = [d.strftime('%Y-%m-%d') for d in earnings_dates['Earnings Date']]
            df['is_earnings_day'] = df.index.strftime('%Y-%m-%d').isin(e_dates)
        else:
            df['is_earnings_day'] = False
    except:
        df['is_earnings_day'] = False

    # 4. Final Context Score (Justification)
    # Higher score = UNJUSTIFIED (Manipulation risk)
    # We lower the score if there is News or Earnings
    df['context_score'] = df['market_diff_score']
    df.loc[df['has_news'] == True, 'context_score'] *= 0.5
    df.loc[df['is_earnings_day'] == True, 'context_score'] *= 0.3
    
    return df

if __name__ == "__main__":
    from src.data_loader import fetch_stock_data
    from src.feature_engineering import calculate_features
    from src.anomaly_detector import detect_anomalies
    
    raw_data = fetch_stock_data("TSLA")
    features = calculate_features(raw_data)
    anomalies = detect_anomalies(features)
    context = analyze_context(anomalies, "TSLA")
    
    print(context[['price_change', 'context_score']].tail())
