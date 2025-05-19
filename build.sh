
pnpm install
cd common
pnpm run build
cd ..

export DOCKER_BUILDKIT=1
docker compose up -d mongodb mongodb2 mongodb3

sh ./init-replica.sh

docker compose up --build -d auth-server event-server gateway-server