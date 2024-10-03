import express from "express";
import winston from "winston";
import { createClient, RedisClientType } from "redis";
import {
  PORT,
  REDIS_URL,
  PHONE_NUMBER_EXPIRY,
  TARGET_URLS,
  LOG_BODY,
} from "./config";
import { authenticateToken } from "./middleware/auth";

const app = express();
let redisClient: RedisClientType;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    process.env.NODE_ENV === "production"
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            return `${timestamp} ${level}: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
            }`;
          })
        )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

app.use(express.json());

async function initializeRedisClient() {
  redisClient = createClient({ url: REDIS_URL });
  redisClient.on("error", (err) => logger.error("Redis Client Error", err));
  await redisClient.connect();
}

app.post("/outbound-numbers", authenticateToken, async (req, res) => {
  const { phone_numbers } = req.body;

  if (!Array.isArray(phone_numbers)) {
    return res
      .status(400)
      .json({ error: "Invalid input. Expected an array of phone numbers." });
  }

  try {
    const multi = redisClient.multi();
    for (const number of phone_numbers) {
      multi.setEx(`phone:${number}`, parseInt(PHONE_NUMBER_EXPIRY), "true");
    }
    await multi.exec();
    logger.info("Stored phone numbers in Redis", {
      count: phone_numbers.length,
    });
    res.status(200).json({ message: "Phone numbers stored successfully" });
  } catch (error) {
    logger.error("Error storing phone numbers in Redis:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/webhook", async (req, res) => {
  if (LOG_BODY) {
    logger.info("Received webhook request", { body: req.body });
  } else {
    logger.info("Received webhook request");
  }

  const fromNumber =
    req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;

  try {
    const promises = TARGET_URLS.map(
      async ({
        url,
        matchStoreNumber,
      }: {
        url: string;
        matchStoreNumber: boolean;
      }) => {
        if (fromNumber) {
          const existsInStore = await redisClient.exists(`phone:${fromNumber}`);
          if (!matchStoreNumber && existsInStore) {
            logger.info(`Skipping ${url} - number in Redis`);
            return;
          }
          if (matchStoreNumber && !existsInStore) {
            logger.info(`Skipping ${url} - number not in Redis`);
            return;
          }
        }

        logger.info(`Forwarding to ${url}`);
        return fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req.body),
        });
      }
    );

    await Promise.all(promises);
    logger.info("Successfully forwarded webhook to all matching target URLs");
    res.sendStatus(200);
  } catch (error) {
    logger.error("Error forwarding webhook:", error);
    res.sendStatus(500);
  }
});

app.get("/", (req, res) => {
  logger.info("GET /");
  res.send("WhatsApp Webhook Forwarder");
});

app.get("/webhook", (req, res) => {
  logger.info("GET /webhook", { query: req.query });
  res.send(req.query["hub.challenge"]);
});

const startServer = async () => {
  await initializeRedisClient();
  const server = app.listen(PORT, () => {
    logger.info(
      `WhatsApp Webhook Forwarder running on url http://127.0.0.1:${PORT}`
    );
  });
  return server;
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

process.on("exit", async () => {
  if (redisClient) {
    await redisClient.quit();
  }
});

export default app;
export { startServer, redisClient };
