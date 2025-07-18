import os
import time
import requests
from django.core.cache import cache
from dotenv import load_dotenv

load_dotenv()

AMADEUS_CLIENT_ID = os.environ.get("AMADEUS_CLIENT_ID", "HH17VAGUp79s3C31xqsvd1dApQVG2Aps")
AMADEUS_CLIENT_SECRET = os.environ.get("AMADEUS_CLIENT_SECRET", "tzsFA1OBDR00zHCM")
AMADEUS_TOKEN_URL = "https://test.api.amadeus.com/v1/security/oauth2/token"

def get_amadeus_access_token():
    """
    Returns a valid Amadeus access token.
    Checks Django cache; if expired or missing, fetches a new token.
    """
    # Try to get the token from cache
    token_info = cache.get("amadeus_token_info")
    current_time = time.time()
    if token_info and token_info.get("expires_at", 0) > current_time:
        return token_info["access_token"]

    # Fetch a new token
    payload = {
        "grant_type": "client_credentials",
        "client_id": AMADEUS_CLIENT_ID,
        "client_secret": AMADEUS_CLIENT_SECRET,
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = requests.post(AMADEUS_TOKEN_URL, data=payload, headers=headers)
    if response.status_code == 200:
        data = response.json()
        access_token = data.get("access_token")
        expires_in = data.get("expires_in", 3600)  # seconds
        # Set expiry time a bit earlier to account for network delays
        expires_at = current_time + expires_in - 60
        token_info = {
            "access_token": access_token,
            "expires_at": expires_at,
        }
        # Cache the token info; expire cache key after token expires
        cache.set("amadeus_token_info", token_info, timeout=expires_in - 60)
        return access_token
    else:
        raise Exception(f"Failed to obtain token: {response.status_code} {response.text}")
