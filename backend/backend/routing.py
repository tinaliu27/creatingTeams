from django.urls import re_path
from .consumers import TeamChangeConsumer

websocket_urlpatterns = [
    re_path(r'ws/team-change/$', TeamChangeConsumer.as_asgi()),
]
