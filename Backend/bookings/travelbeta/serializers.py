from rest_framework import serializers
from django.contrib.auth import get_user_model,authenticate
from .models import *


User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password', 'password2')
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 8},
            'email': {'required': True},
        }
    
    def validate(self, data):
        """
        Ensure the two password fields match.
        """
        if data.get('password') != data.get('password2'):
            raise serializers.ValidationError("Passwords do not match.")
        return data
    
    def create(self, validated_data):
        """
        Create the user with a properly hashed password.
        """
        # Remove password2 from the validated data as it's not needed for user creation.
        validated_data.pop('password2')
        password = validated_data.pop('password')
        
        # Create the user instance
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):

    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            # Attempt to authenticate the user
            user = authenticate(username=username, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                else:
                    raise serializers.ValidationError("This user has been deactivated.")
            else:
                raise serializers.ValidationError("Unable to log in with provided credentials.")
        else:
            raise serializers.ValidationError("Must include both username and password.")
        
        return data
    


class ProfileSerializer(serializers.ModelSerializer):
    # These fields are stored in the Profile model directly
    username = serializers.CharField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ('username', 'first_name', 'last_name', 'email', 'image')
    
    def get_image(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            return obj.image.url
    



# Base serializer for common Product fields.
class BaseProductSerializer(serializers.ModelSerializer):
    class Meta:
        # We don't set model here because Product is abstract.
        fields = ('name', 'created_at', 'updated_at')



# class FlightBookingSerializer(serializers.ModelSerializer):
#     # If your model has a JSONField for the Amadeus response:
#     amadeus_response = serializers.JSONField(required=False)

#     class Meta:
#         model = FlightBooking
  
#         fields = ['origin', 'destination', 'departure_date', 'adults', 'amadeus_response',]  # include all necessary fields


class HotelSerializer(BaseProductSerializer):
    class Meta(BaseProductSerializer.Meta):
        model = Hotel
        fields =('id',) + BaseProductSerializer.Meta.fields + (
            'location',
            'check_in_date',
            'check_out_date',
            'number_of_guests',
            'room_type',
        )

class ShortletSerializer(BaseProductSerializer):
    class Meta(BaseProductSerializer.Meta):
        model = Shortlet
        fields =('id',) + BaseProductSerializer.Meta.fields + (
            'location',
            'check_in_date',
            'check_out_date',
            'number_of_guests',
            'room_type',
        )

class CarRentalSerializer(BaseProductSerializer):
    class Meta(BaseProductSerializer.Meta):
        model = CarRental
        fields =('id',) + BaseProductSerializer.Meta.fields + (
            'city',
            'car_model',
            'pick_up_date',
            'category',
            'price_info',
            'first_name',
            'last_name',
            'email',
            'phone_number',
        )

class VacationSerializer(BaseProductSerializer):
    class Meta(BaseProductSerializer.Meta):
        model = Vacation
        fields = ('id',) + BaseProductSerializer.Meta.fields + (
            'package_name',
            'destination',
            'price',
            'number_of_adults',
            'description',
            'cover_image',
        )

# Serializer for Booking model with GenericForeignKey reference.
class BookingSerializer(serializers.ModelSerializer):
    # Use SerializerMethodField to display a simple representation of the product.
    product = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = ('last_name', 'pnr_number', 'product')

    def get_product(self, obj):
        # Customize this to return a nested representation if needed.
        return str(obj.product)
