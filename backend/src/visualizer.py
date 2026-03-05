import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
import os

def visualize_results(df: pd.DataFrame, ticker: str):
    """
    Plots the stock price and highlights anomalous/high-risk points.
    :param df: Final risk-scored DataFrame.
    :param ticker: Stock ticker symbol.
    """
    plt.figure(figsize=(14, 10))
    sns.set_style("darkgrid")
    
    # 1. Price Plot
    ax1 = plt.subplot(2, 1, 1)
    ax1.plot(df.index, df['close'], label='Close Price', color='blue', alpha=0.6)
    
    # Highlight Anomalies
    anomalies = df[df['is_anomaly'] == -1]
    ax1.scatter(anomalies.index, anomalies['close'], color='red', label='Anomaly Marker', s=50, edgecolors='black')
    
    # Highlight High Risk (> 80%)
    high_risk = df[df['manipulation_risk'] > 80]
    ax1.scatter(high_risk.index, high_risk['close'], color='darkred', marker='x', label='High Manipulation Risk', s=100)
    
    ax1.set_title(f"MarketSentinel AI: {ticker} Anomaly Detection & Risk Analysis", fontsize=16)
    ax1.set_ylabel("Price ($)")
    ax1.legend()
    
    # 2. Volume & Risk Plot
    ax2 = plt.subplot(2, 1, 2)
    ax2.bar(df.index, df['volume'], color='gray', alpha=0.3, label='Volume')
    ax2_twin = ax2.twinx()
    ax2_twin.plot(df.index, df['manipulation_risk'], color='orange', label='Risk Score (%)', linewidth=2)
    
    ax2.set_ylabel("Volume")
    ax2_twin.set_ylabel("Risk Score (%)")
    ax2_twin.set_ylim(0, 100)
    
    # Add high risk threshold line
    ax2_twin.axhline(y=80, color='red', linestyle='--', alpha=0.5, label='Risk Threshold (80%)')
    
    # Sync legends
    lines, labels = ax2.get_legend_handles_labels()
    lines2, labels2 = ax2_twin.get_legend_handles_labels()
    ax2_twin.legend(lines + lines2, labels + labels2, loc='upper left')
    
    plt.tight_layout()
    
    # Save chart
    os.makedirs('data/charts', exist_ok=True)
    save_path = f'data/charts/{ticker}_analysis.png'
    plt.savefig(save_path)
    print(f"Chart saved to {save_path}")
    
    plt.show()

if __name__ == "__main__":
    # Test visualization
    from src.data_loader import fetch_stock_data
    from src.feature_engineering import calculate_features
    from src.anomaly_detector import detect_anomalies
    from src.context_analyzer import analyze_context
    from src.risk_engine import calculate_risk
    
    ticker = "TSLA"
    raw_data = fetch_stock_data(ticker)
    features = calculate_features(raw_data)
    anomalies = detect_anomalies(features)
    context = analyze_context(anomalies, ticker)
    risk_df = calculate_risk(context)
    
    visualize_results(risk_df, ticker)
