echo "오류 대비용 10초 대기"
sleep 10

IS_INITIALIZED=$(docker exec -i mongodb mongosh --quiet --eval '
  try {
    var status = rs.status();
    if (status.ok === 1) {
      print("true");
    } else {
      print("false");
    }
  } catch(e) {
    print("false");
  }
')

if [ "$IS_INITIALIZED" = "true" ]; then
  echo "Replica Set이 이미 초기화되었습니다."
else
  echo "Replica Set 초기화 중..."
  docker exec -i mongodb mongosh --eval '
    rs.initiate({
      _id: "rs0",
      members: [
        { _id: 0, host: "mongodb:27017" },
        { _id: 1, host: "mongodb2:27017" },
        { _id: 2, host: "mongodb3:27017" }
      ]
    });
  '
fi

echo "완료"
