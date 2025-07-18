from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    CustomUser, Profile, Flight, Hotel, Shortlet,
    Booking, CarRental, Vacation
)

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """
    Extends Django's built-in UserAdmin for CustomUser.
    """
    # If you have additional fields in CustomUser, add them here.
    # By default, UserAdmin handles username, email, password, etc.
    pass

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    """
    Admin for Profile model.
    """
    list_display = ("user", "first_name", "last_name", "email")
    search_fields = ("user__username", "first_name", "last_name", "email")

@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    """
    Admin for Flight model.
    """
    list_display = (
        "name", "trip_type", "coming_city", "going_city",
        "check_in_date", "check_out_date", "travel_class"
    )
    list_filter = ("trip_type", "travel_class", "coming_city", "going_city")
    search_fields = ("name", "coming_city", "going_city")

@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    """
    Admin for Hotel model.
    """
    list_display = (
        "name", "location", "check_in_date", "check_out_date",
        "number_of_guests", "room_type"
    )
    list_filter = ("location", "room_type")
    search_fields = ("name", "location")

@admin.register(Shortlet)
class ShortletAdmin(admin.ModelAdmin):
    """
    Admin for Shortlet model.
    """
    list_display = (
        "name", "location", "check_in_date", "check_out_date",
        "number_of_guests", "room_type"
    )
    list_filter = ("location", "room_type")
    search_fields = ("name", "location")

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    """
    Admin for Booking model.
    """
    list_display = ("pnr_number", "last_name", "product")
    search_fields = ("pnr_number", "last_name")

@admin.register(CarRental)
class CarRentalAdmin(admin.ModelAdmin):
    """
    Admin for CarRental model.
    """
    list_display = (
        "name", "category", "city", "car_model",
        "pick_up_date", "price_info", "first_name", "last_name"
    )
    list_filter = ("category", "city")
    search_fields = ("name", "car_model", "first_name", "last_name")

@admin.register(Vacation)
class VacationAdmin(admin.ModelAdmin):
    """
    Admin for Vacation model.
    """
    list_display = ("package_name", "destination", "price", "number_of_adults")
    list_filter = ("destination",)
    search_fields = ("package_name", "destination")
