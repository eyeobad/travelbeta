from django.apps import AppConfig


class TravelbetaConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'travelbeta'

    def ready(self):
        import travelbeta.signals