import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API Key from .env.local or environment
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if API_KEY:
    genai.configure(api_key=API_KEY)

def generate_investigation_report(ticker, date, row_data):
    """
    Uses Gemini to generate a narrative investigation report.
    """
    if not API_KEY:
        return "Gemini API Key missing. Please set GEMINI_API_KEY in your .env file."

    model = genai.GenerativeModel("gemini-2.5-flash")
    
    prompt = f"""
    You are an expert Forensic Financial Analyst at MarketSentinel AI. 
    Investigate the following suspicious event for {ticker} on {date}.
    
    DATA POINT:
    - Price Change: {row_data['price_change']*100:.2f}%
    - Relative Volume: {row_data['rel_volume']:.2f}x average
    - Volatility: {row_data['volatility']:.4f}
    - Has Recent News: {row_data['has_news']}
    - Is Earnings Day: {row_data['is_earnings_day']}
    - Manipulation Risk Score: {row_data['manipulation_risk']}%
    
    TASK:
    1. Provide a professional 'Forensic Summary' of why this is suspicious or real.
    2. Explain the 'Mechanism' (e.g., Pump and Dump, Short Squeeze, or Justified Growth).
    3. Give a 'Verdict' on the reliability of the manipulation risk.
    
    Use professional Markdown formatting. Bold key terms and numbers for emphasis.
    Keep the tone expert, concise, and analytical. Use bullet points for clarity.
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Investigation failed: {str(e)}"
