# Upcover — Subscription Management API

A production-grade REST API built with **NestJS**, **MongoDB**, and **Stripe** for managing user subscriptions with JWT authentication and role-based access control.

## Tech Stack

- **NestJS v11** — TypeScript framework
- **MongoDB** — Database (via Mongoose v9)
- **Stripe** — Payment & subscription billing
- **JWT** — Authentication (Bearer tokens)
- **Swagger** — Interactive API docs at `/api`

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm
- MongoDB instance (local or Atlas)
- Stripe account (optional for local testing)

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_...       # optional — app runs without it
STRIPE_WEBHOOK_SECRET=whsec_...     # optional — needed for webhooks
FRONTEND_URL=http://localhost:3000
PORT=3000
```

> **Note:** The app starts without Stripe keys. Stripe-dependent endpoints (checkout, cancel, webhook) will return a `503 Service Unavailable` error, but everything else works normally.

### Running

```bash
# Development (watch mode)
pnpm start:dev

# Production build
pnpm build
pnpm start:prod
```

### Swagger Docs

Once running, open [http://localhost:3000/api](http://localhost:3000/api) to explore the API interactively.

## API Endpoints

### Auth

| Method | Endpoint    | Auth | Description                        |
| ------ | ----------- | ---- | ---------------------------------- |
| POST   | `/register` | No   | Register a new user                |
| POST   | `/login`    | No   | Login and receive a JWT token      |

### Subscriptions

| Method | Endpoint                 | Auth       | Description                         |
| ------ | ------------------------ | ---------- | ----------------------------------- |
| GET    | `/subscriptions/plans`   | No         | List all available plans             |
| GET    | `/subscriptions/me`      | JWT        | Get current user's subscription      |
| POST   | `/subscriptions/checkout`| JWT        | Create a Stripe checkout session     |
| POST   | `/subscriptions/cancel`  | JWT        | Cancel active subscription           |
| GET    | `/subscriptions/all`     | JWT + Admin| List all subscriptions (admin only)  |
| POST   | `/subscriptions/webhook` | No (Stripe)| Stripe webhook receiver              |

### Request Examples

**Register:**
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

**Get Plans:**
```bash
curl http://localhost:3000/subscriptions/plans
```

**Create Checkout (requires JWT):**
```bash
curl -X POST http://localhost:3000/subscriptions/checkout \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"planId": "basic"}'
```

## Subscription Plans

| Plan     | Price   | Features                         |
| -------- | ------- | -------------------------------- |
| Basic    | $9/mo   | 5 projects, basic analytics      |
| Standard | $29/mo  | 25 projects, advanced analytics  |
| Premium  | $99/mo  | Unlimited projects, priority support |

## Testing

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:cov

# E2E tests
pnpm test:e2e
```

## Project Structure

```
src/
├── main.ts                          # Bootstrap, Swagger, global filters
├── app.module.ts                    # Root module
├── auth/
│   ├── auth.controller.ts           # /register, /login
│   ├── auth.service.ts              # JWT auth logic
│   ├── jwt-auth.guard.ts            # Bearer token guard
│   ├── roles.guard.ts               # RBAC guard
│   ├── roles.decorator.ts           # @Roles() decorator
│   └── dto/
├── users/
│   ├── users.service.ts             # User CRUD
│   └── schemas/user.schema.ts       # User model (email, password, role)
├── subscriptions/
│   ├── subscription.controller.ts   # Subscription endpoints
│   ├── subscription.service.ts      # Business logic
│   ├── stripe.service.ts            # Stripe SDK wrapper (optional)
│   ├── plans.constant.ts            # Plan definitions
│   ├── dto/
│   └── schemas/subscription.schema.ts
└── common/
    └── filters/all-exceptions.filter.ts
```

## Stripe Webhook Events

The webhook handler processes:

- `checkout.session.completed` — Creates subscription in DB after successful payment
- `invoice.payment_succeeded` — Updates subscription period
- `customer.subscription.created` — Logs creation (handled via checkout)
- `customer.subscription.deleted` — Marks subscription as canceled

## License

UNLICENSED
