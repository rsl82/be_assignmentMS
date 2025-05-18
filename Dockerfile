FROM node:18-alpine AS builder

ARG SERVICE_NAME

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY common/package.json ./common/
COPY ${SERVICE_NAME}/package.json ./${SERVICE_NAME}/

# .npmrc 추가
COPY .npmrc ./

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm install

COPY common ./common
COPY ${SERVICE_NAME} ./${SERVICE_NAME}

RUN cd common && pnpm build

RUN cd ${SERVICE_NAME} && pnpm build




FROM node:18-alpine AS production

ARG SERVICE_NAME

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=builder /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=builder /app/.npmrc ./
COPY --from=builder /app/common/package.json ./common/
COPY --from=builder /app/${SERVICE_NAME}/package.json ./
COPY --from=builder /app/${SERVICE_NAME}/dist ./dist
COPY --from=builder /app/common/dist ./common/dist

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm install --prod

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main.js"]