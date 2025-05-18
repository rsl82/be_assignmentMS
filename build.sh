pnpm install
cd common
pnpm run build

cd ..

export DOCKER_BUILDKIT=1
docker compose up -d --build

