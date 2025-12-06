# ============================================
# MÉTRICAS Y MONITOREO
# ============================================

# Django Debug Toolbar (solo en desarrollo)
if DEBUG:
    INSTALLED_APPS += ['debug_toolbar']
    MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
    
    INTERNAL_IPS = [
        '127.0.0.1',
        'localhost',
    ]
    
    DEBUG_TOOLBAR_CONFIG = {
        'SHOW_TOOLBAR_CALLBACK': lambda request: DEBUG,
        'SHOW_TEMPLATE_CONTEXT': True,
        'ENABLE_STACKTRACES': True,
    }
    
    DEBUG_TOOLBAR_PANELS = [
        'debug_toolbar.panels.history.HistoryPanel',
        'debug_toolbar.panels.versions.VersionsPanel',
        'debug_toolbar.panels.timer.TimerPanel',
        'debug_toolbar.panels.settings.SettingsPanel',
        'debug_toolbar.panels.headers.HeadersPanel',
        'debug_toolbar.panels.request.RequestPanel',
        'debug_toolbar.panels.sql.SQLPanel',
        'debug_toolbar.panels.staticfiles.StaticFilesPanel',
        'debug_toolbar.panels.templates.TemplatesPanel',
        'debug_toolbar.panels.cache.CachePanel',
        'debug_toolbar.panels.signals.SignalsPanel',
        'debug_toolbar.panels.redirects.RedirectsPanel',
        'debug_toolbar.panels.profiling.ProfilingPanel',
    ]

# Sistema de Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs' / 'django.log',
            'formatter': 'verbose',
        },
        'performance': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs' / 'performance.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
        'store': {
            'handlers': ['file', 'performance'],
            'level': 'INFO',
            'propagate': False,
        },
        'users': {
            'handlers': ['file', 'performance'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# Métricas de rendimiento
PERFORMANCE_METRICS = {
    'TRACK_QUERIES': True,
    'SLOW_QUERY_THRESHOLD': 0.5,  # segundos
    'TRACK_RESPONSE_TIME': True,
    'LOG_SLOW_REQUESTS': True,
}

# KPIs definidos
BUSINESS_KPIS = {
    'target_conversion_rate': 0.05,  # 5%
    'target_cart_abandonment': 0.30,  # 30%
    'target_avg_order_value': 150000,  # CLP
    'target_page_load_time': 2.0,  # segundos
    'target_api_response_time': 0.3,  # segundos
}
# ============================================
# CONFIGURACIÓN DE MÉTRICAS Y LOGGING
# ============================================
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/performance.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'performance': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
