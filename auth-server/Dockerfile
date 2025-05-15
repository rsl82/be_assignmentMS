FROM node:18-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./  
COPY common ./common
COPY auth-server/package.json ./
COPY auth-server/tsconfig*.json ./
COPY auth-server/src ./src

RUN pnpm install
RUN pnpm build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY auth-server/package.json ./

EXPOSE 3000

CMD ["node", "dist/main.js"]