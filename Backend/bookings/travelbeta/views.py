import os
import json
import logging
import traceback
import requests
from dotenv import load_dotenv
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets, generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from json import JSONDecodeError


from .models import Profile,  Hotel, Shortlet, CarRental, Vacation
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer,
    ProfileSerializer,
    HotelSerializer, ShortletSerializer,
    CarRentalSerializer, VacationSerializer
)
from .utils import get_amadeus_access_token  # your helper to fetch+cache token

# Load .env
load_dotenv()

logger = logging.getLogger(__name__)

# Registration & Login and profile views
@api_view(['POST'])
def register(request):
    try:
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"User registered","user":serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception:
        logger.error("Register error:\n%s", traceback.format_exc())
        return Response({"error":"Internal server error"}, status=500)

@api_view(['POST'])
def login_view(request):
    try:
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username
            })
        return Response(serializer.errors, status=400)
    except Exception:
        logger.error("Login error:\n%s", traceback.format_exc())
        return Response({"error":"Internal server error"}, status=500)

# Profile
class ProfileDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            p = Profile.objects.get(user=request.user)
            return Response(ProfileSerializer(p).data)
        except Profile.DoesNotExist:
            return Response({"error":"Profile not found"}, status=404)
    def put(self, request):
        try:
            p = Profile.objects.get(user=request.user)
            ser = ProfileSerializer(p, data=request.data, partial=True)
            if ser.is_valid():
                ser.save()
                return Response(ser.data)
            return Response(ser.errors, status=400)
        except Profile.DoesNotExist:
            return Response({"error":"Profile not found"}, status=404)
#adameus api search and booking
class FlightBookingAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # 1) fetch Amadeus token
        try:
            token = get_amadeus_access_token()
        except Exception:
            logger.error("Token fetch error:\n%s", traceback.format_exc())
            return Response({"error": "Token error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 2) call Amadeus flight‑offers
        url = "https://test.api.amadeus.com/v2/shopping/flight-offers"
        params = {
            "originLocationCode":      request.data.get("origin"),
            "destinationLocationCode": request.data.get("destination"),
            "departureDate":           request.data.get("departure_date"),
            "adults":                  request.data.get("adults"),
        }
        headers = {"Authorization": f"Bearer {token}"}

        resp = requests.get(url, headers=headers, params=params)
        if resp.status_code != 200:
            logger.error("Amadeus error: %s", resp.text)
            return Response({"error": resp.json()}, status=resp.status_code)

        # 3) return the raw Amadeus response
        amadeus_payload = resp.json()  # contains { data: [...], dictionaries: {...} }
        return Response(amadeus_payload, status=status.HTTP_200_OK)

class HotelBookingAPIView(APIView):
    """
    This view now searches for hotel offers based on a cityCode,
    which is the correct workflow for the Amadeus v3 API.
    """
    permission_classes = [IsAuthenticated] # Or AllowAny if you allow anonymous searches

    def post(self, request):
        # Extract data from the request, now using cityCode
        city_code = request.data.get("cityCode")
        check_in_date = request.data.get("checkInDate")
        check_out_date = request.data.get("checkOutDate")
        adults = request.data.get("adults")
        rooms = request.data.get("rooms")

        if not all([city_code, check_in_date, check_out_date, adults, rooms]):
            return Response(
                {"error": "Missing required search parameters."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 1. Get Amadeus access token
        try:
            token = get_amadeus_access_token()
        except Exception:
            logger.error("Token fetch error:\n%s", traceback.format_exc())
            return Response(
                {"error": "External API authentication failed"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 2. Call Amadeus v3 Hotel Offers API
        headers = {"Authorization": f"Bearer {token}"}
        params = {
            "cityCode": city_code,
            "checkInDate": check_in_date,
            "checkOutDate": check_out_date,
            "adults": adults,
            "roomQuantity": rooms,
            "paymentPolicy": "NONE", # Important for searching without credit card info
            "bestRateOnly": "true"
        }
        
        try:
            resp = requests.get(
                "https://test.api.amadeus.com/v3/shopping/hotel-offers",
                headers=headers,
                params=params
            )
            resp.raise_for_status()
        except requests.exceptions.RequestException as err:
            logger.error("Amadeus hotel offers error for city '%s': %s", city_code, str(err))
            logger.error("Amadeus response body: %s", err.response.text if err.response else "No response")
            return Response(
                {"error": "Failed to fetch hotel offers from the provider."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 3. Return the successful response to the frontend
        return Response(resp.json(), status=status.HTTP_200_OK)

class ShortletBookingAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # 1) fetch Shortlet API token
        try:
            token = get_amadeus_access_token()
        except Exception:
            logger.error("Shortlet token error:\n%s", traceback.format_exc())
            return Response({"error": "Token error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 2) call Shortlet‑offers endpoint
        url = "https://test.api.shortlets.com/v1/shopping/shortlet-offers"
        params = {
            "cityCode":     request.data.get("city_code"),
            "checkInDate":  request.data.get("check_in_date"),
            "checkOutDate": request.data.get("check_out_date"),
            "adults":       request.data.get("adults", 1),
            # add any other supported params here…
        }
        headers = {"Authorization": f"Bearer {token}"}

        resp = requests.get(url, headers=headers, params=params)
        if resp.status_code != 200:
            logger.error("Shortlet‑offers error: %s", resp.text)
            return Response({"error": resp.json()}, status=resp.status_code)

        # 3) return raw Shortlet API response
        return Response(resp.json(), status=status.HTTP_200_OK)

# Local airport search
def search_local_airports(q):
    file_path = os.path.join(settings.BASE_DIR, "airports.json")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (FileNotFoundError, JSONDecodeError) as e:
        logger.error("Could not load/parse airports.json: %s", e)
        return []  # safe fallback

    q_lower = q.lower()
    results = []
    for airport in data:
        name = (airport.get("name") or "").lower()
        iata = (airport.get("iata") or "").upper()
        if not iata:
            continue
        if q_lower in name or q_lower == iata.lower():
            results.append({"name": airport.get("name") or "", "iataCode": iata})
    return results

#query suggestion view
@api_view(['GET'])
def get_location(request):
    q = request.query_params.get("q")
    if not q:
        return Response({"error": "q parameter is required."}, status=400)

    # First try Amadeus lookup
    try:
        token = get_amadeus_access_token()
        resp = requests.get(
            "https://test.api.amadeus.com/v1/reference-data/locations",
            headers={"Authorization": f"Bearer {token}"},
            params={"keyword": q, "subType": "CITY,AIRPORT"}
        )
    except Exception:
        logger.error("Error during Amadeus lookup:\n%s", traceback.format_exc())
        return Response({"error": "Location lookup error."}, status=500)

    if resp.status_code == 200:
        data = resp.json().get("data", [])
        results = [
            {"name": loc.get("name") or "", "iataCode": loc.get("iataCode")}
            for loc in data
            if loc.get("iataCode")
        ]
        if results:
            return Response(results)

    # Fallback to local
    logger.info("Amadeus returned no results for '%s'; using local lookup", q)
    try:
        results = search_local_airports(q)
        return Response(results, status=200)
    except Exception:
        logger.error("Local lookup error:\n%s", traceback.format_exc())
        return Response({"error": "Local lookup failed."}, status=500)

@api_view(['GET'])
def get_shortlet_suggestions(request):
    q = request.query_params.get("q")
    if not q:
        return Response({"error": "q parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

    # 1) Try Shortlet API lookup
    try:
        token = get_amadeus_access_token()
        resp = requests.get(
            "https://test.api.shortlets.com/v1/reference-data/locations/shortlets",
            headers={"Authorization": f"Bearer {token}"},
            params={"keyword": q}
        )
    except Exception:
        logger.error("Error during Shortlet lookup:\n%s", traceback.format_exc())
        return Response({"error": "Shortlet lookup error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if resp.status_code == 200:
        data = resp.json().get("data", [])
        results = [
            {
                "shortletId": item.get("shortletId"),
                "name":       item.get("shortlet", {}).get("name", ""),
                "cityCode":   item.get("shortlet", {}).get("cityCode", ""),
            }
            for item in data
            if item.get("shortletId")
        ]
        if results:
            return Response(results, status=status.HTTP_200_OK)  


class HotelSuggestionAPIView(APIView):
    """
    This view now provides City suggestions for hotel searches.
    The goal is to get a valid city IATA code to use for finding hotel offers.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get("q")
        if not query:
            return Response(
                {"error": "Missing 'q' parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 1. Get Amadeus access token
        try:
            token = get_amadeus_access_token()
        except Exception:
            logger.error("Token fetch error:\n%s", traceback.format_exc())
            return Response(
                {"error": "External API authentication failed"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 2. Call Amadeus City Search API
        headers = {"Authorization": f"Bearer {token}"}
        # Search for cities, which is the reliable way to start a hotel search
        params = {"keyword": query, "subType": "CITY"}
        
        try:
            resp = requests.get(
                "https://test.api.amadeus.com/v1/reference-data/locations",
                headers=headers,
                params=params
            )
            resp.raise_for_status()
        except requests.exceptions.RequestException as err:
            logger.error("Amadeus city search error for '%s': %s", query, str(err))
            # Don't expose detailed external errors to the client
            return Response(
                {"error": "Failed to fetch city suggestions"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 3. Format the response for the frontend
        data = resp.json().get("data", [])
        suggestions = []
        for location in data:
            # Ensure the location has a city code before adding it
            if location.get("iataCode"):
                suggestions.append({
                    "name": f"{location.get('name')}, {location.get('address', {}).get('countryCode')}",
                    "cityCode": location.get("iataCode") # Use cityCode instead of hotelId
                })

        return Response(suggestions, status=status.HTTP_200_OK)

# Other ViewSets
class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

class ShortletViewSet(viewsets.ModelViewSet):
    queryset = Shortlet.objects.all()
    serializer_class = ShortletSerializer

class CarRentalViewSet(viewsets.ModelViewSet):
    queryset = CarRental.objects.all()
    serializer_class = CarRentalSerializer

class VacationViewSet(viewsets.ModelViewSet):
    queryset = Vacation.objects.all()
    serializer_class = VacationSerializer

class VacationDetailView(generics.RetrieveAPIView):
    queryset = Vacation.objects.all()
    serializer_class = VacationSerializer

# class BookingViewSet(viewsets.ModelViewSet):
#     queryset = Booking.objects.all()
#     serializer_class = FlightBookingSerializer

# The Amadeus API endpoint for fetching location data
AMADEUS_LOCATIONS_URL = "https://test.api.amadeus.com/v1/reference-data/locations"

class DestinationMapView(APIView):
    def get(self, request, format=None):
        # List of major city IATA codes to display on the map
        city_codes = [
            'NYC', 'LON', 'PAR', 'DXB', 'TYO', 'JNB', 'SIN', 'SYD',
            'LOS', 'IST', 'ACC', 'NBO', 'JED', 'GZU', 'MEX', 'ATL'
        ]

        try:
            # 1. Get the access token using your custom function
            token = get_amadeus_access_token()
            if not token:
                return Response({"error": "Could not retrieve Amadeus API token."}, status=500)

            # 2. Prepare the request headers and parameters
            headers = {"Authorization": f"Bearer {token}"}
            params = {
                "subType": "CITY",
                "cityCode": ",".join(city_codes)
            }

            # 3. Make the API call using requests
            response = requests.get(AMADEUS_LOCATIONS_URL, headers=headers, params=params)
            response.raise_for_status() # Raises an exception for bad status codes (4xx or 5xx)
            
            api_data = response.json()

            # 4. Format the data for the frontend
            formatted_data = []
            for city in api_data.get('data', []):
                geo_code = city.get('geoCode', {})
                formatted_data.append({
                    'name': city.get('name'),
                    # Coordinates are [longitude, latitude] for react-simple-maps
                    'coordinates': [
                        float(geo_code.get('longitude')),
                        float(geo_code.get('latitude'))
                    ]
                })
            return Response(formatted_data)

        except requests.exceptions.RequestException as e:
            # Handle network or HTTP errors from requests
            return Response({"error": f"API request failed: {e}"}, status=500)
        except Exception as e:
            # Handle other errors, like from your token function
            return Response({"error": str(e)}, status=500)