########################################################
## Build stage
########################################################
FROM node:20 AS builder

RUN corepack enable && corepack prepare pnpm@10.19.0 --activate

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages packages

# Install dependencies
RUN pnpm install

# Build packages (fresh build ensured by .dockerignore excluding build artifacts)
RUN pnpm build

########################################################
## Runner stage
########################################################
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package.json files (IMPORTANT for module resolution)
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder /app/packages/server/package.json /app/packages/server/

# copy sources from builder stage
COPY --from=builder /app/packages/server/dist /app/packages/server/dist
COPY --from=builder /app/packages/client/dist /app/packages/server/dist/presentation/http/public

# copy dependencies from deps stage
COPY --from=builder /app/packages/server/node_modules /app/packages/server/node_modules
COPY --from=builder /app/node_modules /app/node_modules

# Set environment
ENV NODE_ENV=production
ENV HTTP_PORT=3000

# Expose the server port (adjust if needed)
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/health || exit 1

# Start the server
CMD ["node", "packages/server/dist/index.js"]