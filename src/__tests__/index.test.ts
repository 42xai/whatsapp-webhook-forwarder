import request from 'supertest';
import { createClient } from 'redis';
import app, { startServer, redisClient } from '../index'; // Assuming you export the app from index.ts
import { API_TOKEN, PORT } from '../config';
import { Server } from 'http';

let server: Server;

beforeAll(async () => {
  server = await startServer();
});

afterAll(async () => {
  if (redisClient) {
    await redisClient.quit(); // Properly close the Redis connection
  }
  if (server) {
    server.close(); // Close the server
    await new Promise<void>((resolve) => server.close(() => resolve())); // Ensure the server is closed before the process exits
  }
});

describe('Express Application Endpoints', () => {
  describe('POST /outbound-numbers', () => {
    it('should store phone numbers in Redis', async () => {
      const response = await request(server)
        .post('/outbound-numbers')
        .set('Authorization', `Bearer ${API_TOKEN}`)
        .send({ phone_numbers: ['1234567890', '0987654321'] });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Phone numbers stored successfully');

      const exists1 = await redisClient.exists('phone:1234567890');
      const exists2 = await redisClient.exists('phone:0987654321');
      expect(exists1).toBe(1);
      expect(exists2).toBe(1);
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(server)
        .post('/outbound-numbers')
        .set('Authorization', `Bearer ${API_TOKEN}`)
        .send({ phone_numbers: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid input. Expected an array of phone numbers.');
    });
  });

  describe('POST /webhook', () => {
    it('should forward webhook requests', async () => {
      const mockURL = 'http://mockurl.com';
      process.env.TARGET_URLS = JSON.stringify([{ url: mockURL, matchStoreNumber: false }]);

      const response = await request(server)
        .post('/webhook')
        .send({ entry: [{ changes: [{ value: { messages: [{ from: '1234567890' }] } }] }] });

      expect(response.status).toBe(200);
      // Add more expectations here as needed
    });
  });

  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(server).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('WhatsApp Webhook Forwarder');
    });
  });

  describe('GET /webhook', () => {
    it('should return hub challenge', async () => {
      const challenge = 'hub_challenge_token';
      const response = await request(server).get(`/webhook?hub.challenge=${challenge}`);
      expect(response.status).toBe(200);
      expect(response.text).toBe(challenge);
    });
  });
});
