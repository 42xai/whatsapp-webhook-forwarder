# WhatsApp Webhook Forwarder

## Overview

WhatsApp Webhook Forwarder is a Node.js application designed to receive webhook notifications from the WhatsApp API and forward them to multiple predefined URLs.

## Features

- Receives webhook POST requests from WhatsApp API
- Forwards received payloads to multiple configurable target URLs
- Built with TypeScript
- Uses Express.js for handling HTTP requests
- Implements Winston for logging
- Supports environment-based configuration
- Includes Docker support

## Prerequisites

- Node.js (v20 or later)
- npm (usually comes with Node.js)
- Docker and Docker Compose (optional, for containerized deployment)

## Installation

1. Clone the repository:
   ```
   git clone hhttps://github.com/42xai/whatsapp-webhook-forwarder
   cd whatsapp-webhook-forwarder
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your configuration:
   ```
   PORT=3000
   TARGET_URLS=http://url1.com/webhook,http://url2.com/webhook
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

- `TARGET_URLS`: A comma-separated list of URLs to which the webhooks will be forwarded
- `PORT`: (optional) The port on which the server will listen (default: 3000)
- `LOG_BODY`: (optional) Whether to log the request body (default: false)

## API Endpoint

- `POST /webhook`: Receives webhook payloads from WhatsApp API and forwards them to the configured target URLs.

## Logging

Logs are written to /logs directory and are available in the following locations:
- Console
- `error.log` file (for error-level logs)
- `combined.log` file (for all logs)

## Project Structure

```
whatsapp-webhook-forwarder/
├── src/
│   └── index.ts
├── .env
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── nodemon.json
├── package.json
├── README.md
└── tsconfig.json
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.