import pandas as pd
import numpy as np

def calculate_features(df: pd.DataFrame):
    """
    Calculates technical features for anomaly detection.
    :param df: DataFrame containing historical stock data.
    :return: DataFrame with added features.
    """
    df = df.copy()
    
    # Percentage changes
    df['price_change'] = df['close'].pct_change()
    df['volume_change'] = df['volume'].pct_change()
    
    # Volatility (Rolling standard deviation)
    df['volatility'] = df['price_change'].rolling(window=7).std()
    
    # Moving averages
    df['ma_7'] = df['close'].rolling(window=7).mean()
    df['ma_21'] = df['close'].rolling(window=21).mean()
    
    # Relative Volume (Volume vs 30-day average)
    df['rel_volume'] = df['volume'] / df['volume'].rolling(window=30).mean()
    
    # Handle NaN values from rolling calculations
    df = df.dropna()
    
    return df

if __name__ == "__main__":
    # Test feature engineering
    from src.data_loader import fetch_stock_data
    raw_data = fetch_stock_data("TSLA")
    features = calculate_features(raw_data)
    print(features[['close', 'price_change', 'volume_change', 'volatility', 'rel_volume']].tail())
