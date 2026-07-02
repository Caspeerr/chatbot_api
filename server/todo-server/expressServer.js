'use strict';

const express   = require('express');
const cors      = require('cors');
const morgan    = require('morgan');
const path      = require('path');
const fs        = require('fs');
const jsYaml    = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

const config = require('./config');
const logger = require('./logger');

const { TodosController, StatsController, ChatController } = require('./controllers');

const specPath = path.join(__dirname, 'api', 'openapi.yaml');
const apiSpec  = jsYaml.load(fs.readFileSync(specPath, 'utf8'));

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

/* ── Swagger UI — mounted at config.api.docsPath (e.g. /sambrid/api-docs) ── */
app.use(
  config.api.docsPath,
  swaggerUi.serve,
  swaggerUi.setup(apiSpec, {
    customSiteTitle: 'Chat API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 2,
      tryItOutEnabled: true,
    },
    customCss: `
      .swagger-ui .topbar { background: #0d0d0d; padding: 8px 16px; }
      .swagger-ui .topbar-wrapper .link span { display: none; }
      .swagger-ui .topbar-wrapper::after {
        content: 'CHAT API';
        letter-spacing: 0.15em;
      }
    `,
  })
);

app.get(`${config.api.docsPath}.json`, (req, res) => res.json(apiSpec));

/* ── API Router — mounted at config.api.basePath (e.g. /sambrid/api/v1) ── */
const router = express.Router();

router.get   ('/todos',        TodosController.listTodos);
router.post  ('/todos',        TodosController.createTodo);
router.post  ('/todos/bulk',   TodosController.bulkTodos);
router.get   ('/todos/:id',    TodosController.getTodo);
router.put   ('/todos/:id',    TodosController.replaceTodo);
router.patch ('/todos/:id',    TodosController.patchTodo);
router.delete('/todos/:id',    TodosController.deleteTodo);

router.post('/chat', ChatController.chat);
router.get('/stats', StatsController.getStats);

app.use(config.api.basePath, router);

/* ── Health checks — unprefixed AND prefixed alias ──
   ALB target group health checks hit the container directly.
   Keep /health available regardless of prefix config, plus a
   prefixed alias in case your target group health check path
   was set to include /sambrid. */
app.get('/health', (req, res) =>
  res.json({ status: 'ok', uptime: process.uptime(), ts: new Date().toISOString() })
);

const prefixOnly = config.api.basePath.replace('/sambrid/api/v1', '');
app.get(`${prefixOnly}/health`, (req, res) =>
  res.json({ status: 'ok', uptime: process.uptime(), ts: new Date().toISOString() })
);

app.get('/', (req, res) => res.redirect(config.api.docsPath));

app.use((req, res) =>
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: `${req.method} ${req.path} not found` },
  })
);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(err.stack || err.message);
  res.status(err.status || 500).json({
    error: { code: 'INTERNAL_ERROR', message: err.message || 'Unexpected error' },
  });
});

module.exports = app;