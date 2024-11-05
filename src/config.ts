// config.ts
export const PORT = process.env.PORT || 6100;
export const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
export const PHONE_NUMBER_EXPIRY = (parseInt((Number(process.env.PHONE_NUMBER_EXPIRY_HOURS) * 60 * 60).toString()) || 22 * 60 * 60).toString();
export const API_TOKEN = process.env.API_TOKEN || 'your-secret-token';
export const TARGET_URLS = process.env.TARGET_URLS ? JSON.parse(process.env.TARGET_URLS) : [];
export const LOG_BODY = process.env.LOG_BODY?.toLowerCase() === 'true';

export const API_TOKEN_42X = process.env.API_TOKEN_42X || 'your-secret-token';
export const SALESFORCE_URL = process.env.SALESFORCE_URL || 'https://login.salesforce.com/services/oauth2/token';
export const SALESFORCE_CLIENT_ID = process.env.SALESFORCE_CLIENT_ID || 'your-client-id';
export const SALESFORCE_CLIENT_SECRET = process.env.SALESFORCE_CLIENT_SECRET || 'your-client-secret';
