FROM node:18-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY common ./common
COPY event-server ./event-server

RUN pnpm install
RUN cd event-server && pnpm build

FROM node:18-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/common ./common
COPY --from=builder /app/event-server/dist ./dist
COPY --from=builder /app/event-server/package.json ./

# 프로덕션 종속성만 설치
RUN pnpm install --prod

EXPOSE 3000

CMD ["node", "dist/main.js"]