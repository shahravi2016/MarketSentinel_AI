from sklearn.ensemble import IsolationForest
import pandas as pd

def detect_anomalies(df: pd.DataFrame, contamination: float = 0.05):
    """
    Detects anomalies in stock data using the Isolation Forest model.
    :param df: DataFrame with technical features.
    :param contamination: Expected proportion of outliers in the data.
    :return: DataFrame with an added 'is_anomaly' column (-1 for anomaly, 1 for normal).
    """
    # Features to use for anomaly detection
    features = ['price_change', 'volume_change', 'volatility', 'rel_volume']
    
    # Initialize Isolation Forest
    model = IsolationForest(
        contamination=contamination,
        random_state=42,
        n_estimators=100
    )
    
    # Fit and predict
    df['is_anomaly'] = model.fit_predict(df[features])
    df['anomaly_score'] = model.decision_function(df[features])
    
    # Normalize anomaly_score to a 0-1 scale where 1 is highly anomalous
    # decision_function returns lower values for anomalies
    df['anomaly_score'] = 1 - (df['anomaly_score'] - df['anomaly_score'].min()) / (df['anomaly_score'].max() - df['anomaly_score'].min())
    
    return df

if __name__ == "__main__":
    # Test anomaly detector
    from src.data_loader import fetch_stock_data
    from src.feature_engineering import calculate_features
    
    raw_data = fetch_stock_data("TSLA")
    features = calculate_features(raw_data)
    anomalies = detect_anomalies(features)
    
    print(anomalies[anomalies['is_anomaly'] == -1].tail())
