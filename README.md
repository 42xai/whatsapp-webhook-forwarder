# WhatsApp Webhook Forwarder by 42xAI

## Overview

WhatsApp Webhook Forwarder is a Node.js application designed to receive webhook notifications from the WhatsApp API and forward them to multiple predefined URLs.

## Features

- Receives webhook POST requests from WhatsApp API
- Forwards received payloads to multiple configurable target URLs
- Stores and checks phone numbers in Redis
- Built with TypeScript
- Uses Express.js for handling HTTP requests
- Implements Winston for logging
- Supports environment-based configuration
- Includes Docker support

## Architecture

![WhatsApp Webhook Forwarder Architecture](https://42x-assets.s3.amazonaws.com/coworkers/diagram-export-26-8-2024-10_39_23-a.m..png)

## Prerequisites

- Node.js (v20 or later)
- npm (usually comes with Node.js)
- Docker and Docker Compose (optional, for containerized deployment)
- Redis (for storing phone numbers)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/42xai/whatsapp-webhook-forwarder
   cd whatsapp-webhook-forwarder
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your configuration:
   ```
   PORT=3000
   REDIS_URL=redis://localhost:6379
   PHONE_NUMBER_EXPIRY_HOURS=22
   API_TOKEN=your-secret-token
   TARGET_URLS=[{"url": "http://url1.com/webhook", "matchStoreNumber": true}, {"url": "http://url2.com/webhook", "matchStoreNumber": false}]
   LOG_BODY=true
   ```

## Usage

### Development

To run the application in development mode with hot-reloading:

```
npm run dev
```

### Production

To build and run the application for production:

```
npm run build
npm start
```

### Docker

To run the application using Docker:

```
docker-compose up --build
```

## Configuration

- `PORT`: (optional) The port on which the server will listen (default: 3000)
- `REDIS_URL`: The URL of the Redis instance
- `PHONE_NUMBER_EXPIRY_HOURS`: The expiry time for phone numbers stored in Redis, in hours (default: 22 hours)
- `API_TOKEN`: The token used for authenticating requests to the `/outbound-numbers` endpoint
- `TARGET_URLS`: A JSON string representing an array of objects, each with `url` (the target URL) and `matchStoreNumber` (a boolean indicating if the target should match stored numbers) properties
- `LOG_BODY`: (optional) Whether to log the request body (default: false)


### matchStoreNumber

If matchStoreNumber is *true*:
- The webhook will be forwarded to this URL only if the phone number exists in Redis.
- If the number is not in Redis, this URL will be skipped.

If matchStoreNumber is *false*:
- The webhook will be forwarded to this URL only if the phone number does NOT exist in Redis.
- If the number is in Redis, this URL will be skipped.

## API Endpoints

- `POST /outbound-numbers`: Stores an array of phone numbers in Redis with a specified expiry time. Requires authentication via a bearer token.
- `POST /webhook`: Receives webhook payloads from WhatsApp API and forwards them to the configured target URLs based on the stored phone numbers and the `matchStoreNumber` setting.
- `GET /`: Returns a welcome message.
- `GET /webhook`: Echoes back the `hub.challenge` query parameter for webhook verification.

## Logging

Logs are written to the `/logs` directory and are available in the following locations:
- Console
- `error.log` file (for error-level logs)
- `combined.log` file (for all logs)

## Project Structure

```
whatsapp-webhook-forwarder/
whatsapp-webhook-forwarder/
├── src/
│   ├── config.ts
│   ├── index.ts
│   ├── middleware/
│   │   └── auth.ts
├── tests/
│   └── index.test.ts
├── .env
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── jest.config.js
├── nodemon.json
├── package.json
├── README.md
└── tsconfig.json
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.