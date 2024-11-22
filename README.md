# hono-app-boilerplate

A simple, Hono Powered Webserver designed with Bun. Can be used with MongoDB.

## Features

- Easy Configuration ([config.ts](./src/modules/config.ts))
- Authentication
- Gzip Support
- Database & Indexes (MongoDB)
- Zod Type Checking
- Multiple Instances (For running on multiple cores)
- Requests Logger

## Tech Stack

- Bun
- Hono
- Zod
- MongoDB (Optional)
- Docker (Optional)

## Running

To install dependencies:

```bash
bun install
```

To run in Development Mode: (Server is restarted when changes happen)

```bash
bun dev
```

To run in Production Mode:

```bash
bun start
```

This project was created using `bun init` in bun v1.1.34. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
