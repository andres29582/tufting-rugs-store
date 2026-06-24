import type { Metric } from 'web-vitals';

export function initWebVitals(): void {
  if (!import.meta.env.DEV && import.meta.env.VITE_ENABLE_WEB_VITALS !== 'true') {
    return;
  }

  import('web-vitals')
    .then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      const reportMetric = (metric: Metric) => {
        console.info('[web-vitals]', metric.name, metric.value, metric.rating);
      };

      onCLS(reportMetric);
      onFCP(reportMetric);
      onINP(reportMetric);
      onLCP(reportMetric);
      onTTFB(reportMetric);
    })
    .catch((error: unknown) => {
      console.info('[web-vitals] unavailable', error);
    });
}
