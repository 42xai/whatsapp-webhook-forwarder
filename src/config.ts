// config.ts
export const PORT = process.env.PORT || 3000;
export const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
export const PHONE_NUMBER_EXPIRY = (parseInt((Number(process.env.PHONE_NUMBER_EXPIRY_HOURS) * 60 * 60).toString()) || 22 * 60 * 60).toString();
export const API_TOKEN = process.env.API_TOKEN || 'your-secret-token';
export const TARGET_URLS = process.env.TARGET_URLS ? JSON.parse(process.env.TARGET_URLS) : [];
export const LOG_BODY = process.env.LOG_BODY?.toLowerCase() === 'true';