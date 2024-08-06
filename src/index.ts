import express from 'express';
import winston from 'winston';


const app = express();
const PORT = process.env.PORT || 3000;
const TARGET_URLS = process.env.TARGET_URLS?.split(',') || [];

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

app.use(express.json());

app.post('/webhook', async (req, res) => {
  logger.info('Received webhook request', { body: req.body });

  try {
    const promises = TARGET_URLS.map(url => {
      logger.info(`Forwarding to ${url}`);
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
    });

    await Promise.all(promises);
    logger.info('Successfully forwarded webhook to all target URLs');
    res.sendStatus(200);
  } catch (error) {
    logger.error('Error forwarding webhook:', error);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  logger.info(`WhatsApp Webhook Forwarder running on port ${PORT}`);
});
