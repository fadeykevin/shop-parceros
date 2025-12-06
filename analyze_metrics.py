import json
import random
from datetime import datetime, timedelta

def generate_sample_metrics():
    metrics = {
        'periodo': f'{datetime.now().strftime("%Y-%m")}',
        'kpis': {
            'tiempo_carga_promedio': round(random.uniform(0.8, 2.5), 2),
            'tasa_conversion': round(random.uniform(2.5, 8.5), 2),
            'tasa_rebote': round(random.uniform(35, 65), 2),
            'productos_mas_vistos': [
                {'nombre': 'Laptop HP Pavilion', 'vistas': random.randint(250, 500)},
                {'nombre': 'Mouse Logitech MX Master 3', 'vistas': random.randint(200, 450)},
                {'nombre': 'Teclado Mecánico Razer', 'vistas': random.randint(180, 400)},
            ],
            'picos_trafico': {
                'hora_maxima': f'{random.randint(14, 20)}:00',
                'usuarios_simultaneos': random.randint(50, 150)
            }
        },
        'analisis': {
            'fortalezas': [
                'Tiempo de carga aceptable en móviles',
                'Alta interacción con ofertas',
                'Buen engagement en productos gaming'
            ],
            'areas_mejora': [
                'Optimizar imágenes (reducir tamaño 40%)',
                'Implementar lazy loading',
                'Cachear respuestas API',
                'Mejorar checkout (3 pasos → 2 pasos)'
            ]
        }
    }
    
    with open('logs/metrics_report.json', 'w', encoding='utf-8') as f:
        json.dump(metrics, f, indent=2, ensure_ascii=False)
    
    print('✅ Métricas generadas en: logs/metrics_report.json')
    return metrics

if __name__ == '__main__':
    import sys
    if '--generate' in sys.argv:
        generate_sample_metrics()
    else:
        try:
            with open('logs/metrics_report.json', 'r', encoding='utf-8') as f:
                metrics = json.load(f)
                print('\n📊 REPORTE DE MÉTRICAS')
                print('=' * 50)
                print(f'Período: {metrics["periodo"]}')
                print(f'\n🎯 KPIs:')
                print(f'  - Tiempo de carga: {metrics["kpis"]["tiempo_carga_promedio"]}s')
                print(f'  - Tasa de conversión: {metrics["kpis"]["tasa_conversion"]}%')
                print(f'  - Tasa de rebote: {metrics["kpis"]["tasa_rebote"]}%')
                print(f'\n📈 Productos más vistos:')
                for p in metrics["kpis"]["productos_mas_vistos"]:
                    print(f'  - {p["nombre"]}: {p["vistas"]} vistas')
        except FileNotFoundError:
            print('❌ No hay métricas. Ejecuta: python analyze_metrics.py --generate')
