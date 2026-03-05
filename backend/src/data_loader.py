import yfinance as yf
import pandas as pd
import os

def fetch_stock_data(ticker: str, period: str = "1y", interval: str = "1d"):
    """
    Fetches historical stock data for a given ticker.
    :param ticker: Stock ticker symbol (e.g., 'AAPL')
    :param period: Time period (e.g., '1y', '6mo', 'max')
    :param interval: Data frequency (e.g., '1d', '1h')
    :return: pandas DataFrame
    """
    print(f"Fetching data for {ticker}...")
    stock = yf.Ticker(ticker)
    df = stock.history(period=period, interval=interval)
    
    if df.empty:
        raise ValueError(f"No data found for ticker: {ticker}")
        
    # Standardize column names
    df.columns = [col.lower() for col in df.columns]
    
    # Save raw data for auditing
    os.makedirs('data/raw', exist_ok=True)
    df.to_csv(f'data/raw/{ticker}_raw.csv')
    
    return df

if __name__ == "__main__":
    # Test the loader
    data = fetch_stock_data("TSLA")
    print(data.head())
