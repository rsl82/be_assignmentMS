if ! command -v pnpm &> /dev/null; then
    echo "pnpm 설치 후 실행해주세요."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "docker 설치 후 실행해주세요."
    exit 1
fi

pnpm install
cd common
pnpm run build
cd ..

export DOCKER_BUILDKIT=1
docker compose up -d mongodb mongodb2 mongodb3

sh ./init-replica.sh

docker compose up --build -d auth-server event-server gateway-server