const promClient = require('prom-client');
const { logger } = require('./logger');

// Create a Registry to register metrics
const register = new promClient.Registry();

// Add default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const databaseQueryDuration = new promClient.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

const activeUsers = new promClient.Gauge({
  name: 'active_users',
  help: 'Number of active users',
});

// Register custom metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(databaseQueryDuration);
register.registerMetric(activeUsers);

// Middleware for tracking HTTP requests
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  const { method, path } = req;

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const { statusCode } = res;

    httpRequestDuration.labels(method, path, statusCode).observe(duration);
    httpRequestTotal.labels(method, path, statusCode).inc();

    // Log requests that take too long
    if (duration > 1) {
      logger.warn(`Slow request: ${method} ${path} took ${duration}s`);
    }
  });

  next();
};

// Database query tracking
const trackDatabaseQuery = (operation, table, duration) => {
  databaseQueryDuration.labels(operation, table).observe(duration);
};

// User tracking
const updateActiveUsers = (count) => {
  activeUsers.set(count);
};

// Metrics endpoint handler
const getMetrics = async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    logger.error('Error generating metrics:', error);
    res.status(500).end();
  }
};

module.exports = {
  metricsMiddleware,
  trackDatabaseQuery,
  updateActiveUsers,
  getMetrics,
};
