# Stage 1: Build
FROM oven/bun:latest
WORKDIR /usr/src/app

# Copy package.json and lockfile
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Compile the application
CMD [ "bun", "run", "start" ]