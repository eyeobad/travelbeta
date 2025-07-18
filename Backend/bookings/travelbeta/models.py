# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
import uuid
class CustomUser(AbstractUser):
 

    def __str__(self):
        return self.username

class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    # Duplicate user data fields:
    username = models.CharField(max_length=150, blank=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    email = models.EmailField(blank=True)
    
    # Additional field:
    image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class Product(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True  # Ensures this model is not created in the database

class FlightBooking(models.Model):
    # Save query parameters for flight search
    origin = models.CharField(max_length=10)         # e.g., IATA code for origin city
    destination = models.CharField(max_length=10)    # e.g., IATA code for destination city
    departure_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    adults = models.PositiveIntegerField(default=1)
    children = models.PositiveIntegerField(default=0)  # New field: number of children
    
    # Flight class choices
    FLIGHT_CLASS_CHOICES = [
        ("economy", "Economy"),
        ("premium", "Premium Economy"),
        ("business", "Business"),
        ("first", "First Class"),
    ]
    flight_class = models.CharField(max_length=20, choices=FLIGHT_CLASS_CHOICES, blank=True)
    
    # Optionally, store the raw query payload as JSON
    query_payload = models.JSONField(null=True, blank=True)
    # Optionally, store the Amadeus API response (if you wish to cache the offers)
    amadeus_response = models.JSONField(null=True, blank=True)
    
    # Link the booking to the user's profile
    profile = models.ForeignKey("Profile", on_delete=models.CASCADE, related_name="flight_bookings")
    booking_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Booking by {self.profile.user.username} from {self.origin} to {self.destination}"
   
    
class Hotel(Product):
    location = models.CharField(max_length=255)
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    number_of_guests = models.PositiveIntegerField()
    room_type = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} - {self.location} ({self.check_in_date} → {self.check_out_date})"
  
class Shortlet(Product):
    location = models.CharField(max_length=255)
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    number_of_guests = models.PositiveIntegerField()
    room_type = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} - {self.location} ({self.check_in_date} → {self.check_out_date})"

def generate_pnr():
    return str(uuid.uuid4().hex[:6]).upper()  # e.g., "A1B2C3"

class Booking(models.Model):
    last_name = models.CharField(max_length=255)
    pnr_number = models.CharField(max_length=20, unique=True, default=generate_pnr)
    
    # Generic relation fields to reference any concrete product (Flight, Hotel, Shortlet)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    product = GenericForeignKey('content_type', 'object_id')
    
    def __str__(self):
        return f"Booking {self.pnr_number} for {self.last_name}"
    

class CarRental(Product):
    # Category choices
    SEDAN = 'Sedan'
    SUV = 'Suv'
    LUXURY = 'Luxury'
    VAN = 'Van'

    CATEGORY_CHOICES = [
        (SEDAN, 'Sedan'),
        (SUV, 'SUV'),
        (LUXURY, 'Luxury'),
        (VAN, 'Van'),
    ]

    city = models.CharField(max_length=255, help_text="e.g. Lagos")
    car_model = models.CharField(max_length=255)
    pick_up_date = models.DateField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    price_info = models.DecimalField(max_digits=10, decimal_places=2)

    # Customer details
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.name} - {self.category.capitalize()} in {self.city}"
    
class Vacation(Product):
    package_name = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    number_of_adults = models.PositiveIntegerField(default=2)
    
    # Basic text fields for additional details
    description = models.TextField(blank=True)
    itinerary = models.TextField(blank=True, help_text="Day-by-day itinerary details")
    
    # Optional date fields for departure/return, etc.
    departure_date = models.DateField(null=True, blank=True)
    return_date = models.DateField(null=True, blank=True)

    # Optional fields for more images
    cover_image = models.ImageField(upload_to='vacations/', blank=True, null=True)
    image_2 = models.ImageField(upload_to='vacations/', blank=True, null=True)
    image_3 = models.ImageField(upload_to='vacations/', blank=True, null=True)

    # Room/Accommodation details
    room_type = models.CharField(max_length=100, blank=True, help_text="e.g. Deluxe, Suite, etc.")
    number_of_nights = models.PositiveIntegerField(default=1)

    # Additional info: e.g. inclusions/exclusions
    inclusions = models.TextField(blank=True, help_text="List what's included in the package")
    exclusions = models.TextField(blank=True, help_text="List what's not included in the package")

    def __str__(self):
        return f"{self.package_name} - {self.destination} (₦{self.price})"
    


class Flight(Product):
    ROUND_TRIP = 'round_trip'
    ONE_WAY = 'one_way'
    MULTI_WAY = 'multi_way'
    
    TRIP_CHOICES = [
        (ROUND_TRIP, 'Round Trip'),
        (ONE_WAY, 'One Way'),
        (MULTI_WAY, 'Multi Way'),
    ]
    
    ECONOMY = 'economy'
    BUSINESS = 'business'
    PREMIUM_ECONOMY = 'premium_economy'
    FIRST_CLASS = 'first_class'
    
    CLASS_CHOICES = [
        (ECONOMY, 'Economy'),
        (BUSINESS, 'Business'),
        (PREMIUM_ECONOMY, 'Premium Economy'),
        (FIRST_CLASS, 'First Class'),
    ]
    
    trip_type = models.CharField(max_length=20, choices=TRIP_CHOICES)
    is_infant = models.BooleanField(default=False)
    is_adult = models.BooleanField(default=True)
    children_count = models.PositiveIntegerField(default=0)
    travel_class = models.CharField(max_length=15, choices=CLASS_CHOICES)
    coming_city = models.CharField(max_length=255)
    going_city = models.CharField(max_length=255)
    check_in_date = models.DateField()
    check_out_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.name} - {self.trip_type} ({self.coming_city} → {self.going_city})"
