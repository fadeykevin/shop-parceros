from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title='Shop Parceros API',
        default_version='v1',
        description='E-commerce completo',
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('__debug__/', include('debug_toolbar.urls')),
    path('api/auth/', include('users.urls')),
    path('api/', include('store.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0)),
]
