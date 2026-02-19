# NestJS — Auth + SQLite + Tests

Bu repo **NestJS + TypeORM (SQLite)** üzərində qurulmuş sadə backend nümunəsidir. Layihənin əsas fokusları:
- Session əsaslı auth (`cookie-session`)
- Password hashing (**scrypt + salt**)
- DTO validation (`class-validator`)
- Response serialization (`class-transformer` + custom interceptor)
- Unit və E2E testlər (Jest + Supertest)
- Swagger dokumentasiyası (`/api`)

---

## Tech Stack

- **NestJS** (`@nestjs/core`, `@nestjs/common`)
- **TypeORM** + **SQLite**
- **@nestjs/config** (environment config)
- **cookie-session** (session management)
- **class-validator** / **class-transformer**
- **Jest** + **Supertest** (unit & e2e)

---

## Başlamaq

### 1) Install
  npm install

### 2) Environment faylları
  Layihə NODE_ENV-ə görə env faylını seçir:
  .env.development
  .env.test
  Minimum tələb olunan dəyişən:
    - DB_NAME=db.sqlite
  Test üçün:
    - DB_NAME=test.sqlite
  Qeyd: TypeOrmModule.forRootAsync DB_NAME oxuyur və SQLite database faylını həmin adla açır.

### Run
  npm run start:dev
  Default port: 3000 (əgər PORT set olunmayıbsa).

* Swagger
    Swagger UI:
    http://localhost:3000/api
    Swagger config main.ts daxilində qurulub.

### Auth Sistemi (Session Based)
  Auth session-əsaslıdır (cookie-session). Login/signup zamanı session.userId set olunur.
    * Flow
      - /auth/signup → user yaradılır, session.userId = user.id
      - /auth/signin → user doğrulanır, session.userId = user.id
      - /auth/me → AuthGuard tələb edir, CurrentUser decorator ilə user qaytarır
      - /auth/signout → session.userId = null
      - Password Security
      - AuthService password-ları belə saxlayır:
      - salt (randomBytes) yaradılır
      - scrypt(password, salt, 32) ilə hash alınır
      - DB-də bu format saxlanır:
          salt.hash

### Validation & Serialization
  Validation
    Global ValidationPipe({ whitelist: true }) aktivdir (AppModule provider kimi APP_PIPE ilə).
      DTO-lar:
        CreateUserDto → email, password
        UpdateUserDto → optional email, optional password
      Serialization
        Controller @Serialize(UserDto) istifadə edir.
      UserDto yalnız bu field-ləri expose edir:
        id
        email
      Bu səbəbdən response-larda password görünmür.

### API Endpoints
  Base path: /auth

  Auth
    POST /auth/signup
      body: { "email": string, "password": string }
      201 → user (id, email)
    POST /auth/signin
      body: { "email": string, "password": string }
      201 → user (id, email)
    POST /auth/signout
      session sıfırlanır
    GET /auth/me (protected)
      AuthGuard session yoxlayır
      current user qaytarır
  
  Users
    GET /auth/:id
      user tapılmasa NotFoundException('User not found')
    GET /auth?email=...
      email-ə görə user list
    PATCH /auth/:id
      body: { "email"?: string, "password"?: string }
    DELETE /auth/:id

### Modules / Structure

├── src
│   ├── decorators
│   │   └── current-user.decorator.ts
│   ├── guards
│   │   └── auth.guard.ts
│   ├── interceptors
│   │   └── serialize.interceptor.ts
│   ├── reports
│   │   ├── report.entity.ts
│   │   ├── reports.controller.spec.ts
│   │   ├── reports.controller.ts
│   │   ├── reports.module.ts
│   │   ├── reports.service.spec.ts
│   │   └── reports.service.ts
│   ├── users
│   │   ├── dtos
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-user.dto.ts
│   │   │   └── user.dto.ts
│   │   ├── interceptors
│   │   │   └── current-user.interceptor.ts
│   │   ├── auth.service.spec.ts
│   │   ├── auth.service.ts
│   │   ├── request.http
│   │   ├── user.entity.ts
│   │   ├── users.controller.spec.ts
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   ├── users.service.spec.ts
│   │   └── users.service.ts
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│   └── setup-app.ts
├── test
│   ├── app.e2e-spec.ts
│   ├── auth.e2e-spec.ts
│   ├── jest-e2e.json
│   └── setup.ts
├── .gitignore
├── .prettierrc
├── README.md
├── eslint.config.mjs
├── myNotes.md
├── nest-cli.json
├── package-lock.json
├── package.json
└── tsconfig.json

* UsersModule daxilində CurrentUserInterceptor APP_INTERCEPTOR kimi global edilib.
  Bu interceptor session.userId oxuyur və request.currentUser set edir.
  @CurrentUser() decorator isə controller method-unda həmin user-i götürür.

### Database
  SQLite istifadə olunur.
    synchronize: true aktivdir (dev məqsədli).
  Entities:
    User (id, email, password)
  Report (id, price)
    User entity-də AfterInsert/AfterUpdate/AfterRemove hook-ları var (console log üçün).

* Tests
    Unit Tests
      npm run test
    E2E Tests
      npm run test:e2e
        - test/setup.ts hər testdən əvvəl test.sqlite faylını silir (təmiz DB üçün).
        - auth.e2e-spec.ts içində setupApp(app) çağırılır (session + validation üçün).
      
### Qeydlər / TODO
  - ReportsModule hazırda skeleton kimidir (controller/service boşdur).
  - Prod üçün:
    * synchronize söndürülməlidir
    * migrations strategiyası seçilməlidir
    * cookie-session keys secret-ları env-ə   çıxarılmalıdır

