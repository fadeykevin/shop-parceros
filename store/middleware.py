import time
import logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger('performance')

class PerformanceMetricsMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.start_time = time.time()

    def process_response(self, request, response):
        if hasattr(request, 'start_time'):
            duration = time.time() - request.start_time
            logger.info(f'{request.method} {request.path} - {duration:.3f}s')
        return response

class UserActivityTracker(MiddlewareMixin):
    def process_request(self, request):
        logger.info(f'User: {request.user.username if request.user.is_authenticated else "Anonymous"} - Path: {request.path}')
