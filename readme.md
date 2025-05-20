# Backend Service

## 초기 실행

1. ./build.sh를 통해서 build 파일 실행
   - 실행 전 pnpm과 docker를 설치해야 합니다. (미설치 시 설치 필요 메시지 노출과 함께 스크립트 종료)
2. 아래의 API를 통해서 실행 테스트 완료

## 프로젝트 구조

```
backend/
├── auth-server/                # 인증 서버
│   └── src/
│       ├── controllers/        # API 컨트롤러
│       ├── services/           # 비즈니스 로직
│       ├── dto/                # 데이터 전송 객체
│       └── app.module.ts       # 모듈 설정

├── event-server/               # 이벤트 서버
│   └── src/
│       ├── controllers/        # API 컨트롤러
│       ├── decorators/         # 유저 헤더 추출용 데코레이터
│       ├── services/           # 비즈니스 로직
│       ├── dto/                # 데이터 전송 객체
│       └── app.module.ts       # 모듈 설정

├── gateway-server/             # API 게이트웨이
│   └── src/
│       ├── controllers/        # API 컨트롤러
│       ├── constants/          # 인가된 루트로만 접속할 수 있도록 하는 Path
│       ├── decorators/         # roles, user 추출 데코레이터
│       ├── services/           # 비즈니스 로직
│       ├── guards/             # 역할 인가 가드
│       ├── strategies/         # Jwt 인증 전략
│       └── app.module.ts       # 모듈 설정

├── common/                     # 공통 모듈
│   └── src/
│       ├── schemas/            # MongoDB 스키마
│       ├── enums/              # 열거형
│       └── index.ts            # 모듈 진입점
│   └── package.json

├── docker-compose.yaml         # Docker 설정
├── Dockerfile                  # 서버(Auth, Event, Gateway) Docker 이미지 빌드용
├── build.sh                    # 빌드 스크립트
├── .env                        # 설정 파일들 3개
└── pnpm-workspace.yaml         # 용량 절감과 쉬운 의존성 관리를 위한 워크스페이스
```

## 1. 공통 아키텍처

### 데이터 검증 및 구조

- DTO를 통한 입력 값 검증
- 컨트롤러-서비스-모듈 구조로 구현
- 데코레이터를 활용한 깔끔한 코드 표현
- 다중 DB 작업은 트랜잭션으로 처리
- 환경 변수를 통한 프라이버시 정보 관리

## 2. Docker 구성

### 이미지 최적화

- 단일 Dockerfile로 세 서버 재사용
- 멀티 스테이지 빌드로 이미지 크기 최적화
- MongoDB Replica Set 설정으로 트랜잭션 지원

## 3. Auth 서버

### 사용자 관리

- 비밀번호 해시화 저장
- 일반 사용자만 회원가입 가능
  - 관리자/운영자 계정은 MongoDB Compass로 직접 생성

### 스키마 설계

- **User**: 기본 사용자 정보
- **UserInfo**: 이벤트 보상 자격 검증용
  - 검증 전용으로 설계했기 때문에 따로 업데이트 하는 기능은 없음
  - Compass를 통한 테스트 데이터 관리

## 4. Event 서버

### API 설계

- 쿼리 기반 요청 처리
- Role 기반 분기 처리

### 데이터베이스 구조

- **Event**: 이벤트 정보
- **Reward**: 이벤트 보상 정보
- **Request**: 이벤트 보상 요청
- User가 자신의 Request 내역을 요청할 수 있기 때문에 Request-User 사이의 관계만 구현
  - 추후 다른 관계 추가 시 수정 가능

## 5. 이벤트 유형

### 구현된 이벤트

1. **출석 이벤트**
   - 연속 출석 n일 이상 달성
2. **쿠폰 이벤트**
   - 쿠폰 코드 검증
3. **어린이 날 기념 이벤트**
   - 만 20세 이하 청소년 대상

## 6. Gateway 서버

### 인증/인가

- JWT 기반 인증
- Role 기반 접근 제어
- routes.constant.ts로 라우팅 제한
- 인증된 사용자 정보를 헤더로 전달

## 7. Common

- 여러 서버에서 쓰는 Schema 및 Schema에 필요한 enum 파일 관리

## 8. 추가로 고려하고 싶은 사항

### 시스템 개선

- 세분화된 에러 처리
- 체계적인 로깅 시스템
- JWT 리프레시 토큰 도입
- Redis를 활용한 서비스 캐싱
- API 문서화 (Swagger/OpenAPI)

# API Routes

기본적으로 http://localhost:3003/:권한레벨/:서버이름/:path 의 구성을 통해 게이트웨이로 접근가능합니다.

## Public Routes

### Auth

| Method | Path        | Description |
| ------ | ----------- | ----------- |
| POST   | `/register` | 회원가입    |
| POST   | `/login`    | 로그인      |

### Event

| Method | Path         | Description      |
| ------ | ------------ | ---------------- |
| GET    | `/event`     | 이벤트 목록 조회 |
| GET    | `/event/:id` | 이벤트 상세 조회 |

## Admin Routes

### Auth

| Method | Path    | Description      |
| ------ | ------- | ---------------- |
| PATCH  | `/role` | 사용자 권한 변경 |

## Operator Routes

### Event

| Method | Path      | Description |
| ------ | --------- | ----------- |
| POST   | `/event`  | 이벤트 생성 |
| POST   | `/reward` | 보상 생성   |

## User Routes

### Event

| Method | Path       | Description      |
| ------ | ---------- | ---------------- |
| POST   | `/request` | 이벤트 참여 요청 |

## Authorized Routes

### Event

| Method | Path       | Description         |
| ------ | ---------- | ------------------- |
| GET    | `/request` | 참여 요청 목록 조회 |

## 권한 레벨

- **Public**: 인증 없이 접근 가능
- **Admin**: 관리자 권한 필요
- **Operator**: 운영자 권한 필요
- **User**: 일반 사용자 권한 필요
- **Authorized**: 로그인한 사용자만 접근 가능
