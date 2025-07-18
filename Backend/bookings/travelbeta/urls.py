from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    register,
    login_view,
    ProfileDetailView,
    HotelViewSet,
    ShortletViewSet,
    CarRentalViewSet,
    VacationViewSet,
    VacationDetailView,  # Use RetrieveAPIView for single vacation
    FlightBookingAPIView,
    get_location,
    HotelSuggestionAPIView,
    get_shortlet_suggestions,
    HotelBookingAPIView,
    ShortletBookingAPIView,
    DestinationMapView,
)

app_name = 'travelbeta'

# Register only ViewSets in the router
router = DefaultRouter()
router.register(r'hotel', HotelViewSet)
router.register(r'shortlets', ShortletViewSet)
router.register(r'car-rentals', CarRentalViewSet)
router.register(r'vacations', VacationViewSet)  # List & Create Vacations

urlpatterns = [
    # Auth routes
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    
    # Add JWT token obtain and refresh endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/map-destinations/', DestinationMapView.as_view(), name='map-destinations'),
    # Profile (APIView, not a ViewSet)
    path('profile/', ProfileDetailView.as_view(), name='profile-detail'),

    # Flight Booking (APIView, not a ViewSet)
    path('flight-bookings/', FlightBookingAPIView.as_view(), name='flight-bookings'),

    path('hotel-bookings/', HotelBookingAPIView.as_view(), name='hotel-bookings'),
    path('shortlet-bookings/', ShortletBookingAPIView.as_view(), name='shortlet-bookings'),

    # Vacation Detail (RetrieveAPIView)
    path('vacations/<int:pk>/', VacationDetailView.as_view(), name='vacation-detail'),

    # Include all ViewSet-based API routes
    path('api/', include(router.urls)),  
    path('api/locations/', get_location, name='location-lookup'),
    path('api/hotels/', HotelSuggestionAPIView.as_view(), name='hotels-lookup'),
    path('api/shortlets/', get_shortlet_suggestions, name='shortlets-lookup'),
]
