from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Profile


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        # Create a new Profile with data copied from the User instance.
        Profile.objects.create(
            user=instance,
            username=instance.username,
            first_name=instance.first_name,
            last_name=instance.last_name,
            email=instance.email
        )
    else:
        # Update the existing Profile with the new User data.
        profile = instance.profile
        profile.username = instance.username
        profile.first_name = instance.first_name
        profile.last_name = instance.last_name
        profile.email = instance.email
        profile.save()