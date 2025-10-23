# PeniWise Backend

A comprehensive NestJS backend API with authentication, notifications, and event management.

## 🚀 Features

- **Authentication**: JWT-based authentication with Passport
- **Database**: PostgreSQL with Prisma ORM
- **Notifications**: Email notifications with event-driven architecture
- **API Documentation**: Swagger/OpenAPI documentation
- **Docker Support**: Complete Docker setup for development and production
- **Task Scheduling**: Automated event reminders and cleanup tasks
- **Rate Limiting**: API rate limiting for security
- **Validation**: Request validation with class-validator

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 13+
- Redis (optional, for caching)
- Docker & Docker Compose (optional)

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy the environment example file:

```bash
cp env.example .env
```

Update the `.env` file with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/peniwise"

# JWT Secret (CHANGE THIS!)
JWT_SECRET="your-super-secret-jwt-key"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed the database
npm run prisma:seed
```

### 4. Start the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 🐳 Docker Setup

### Development with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Production with Docker Compose

```bash
# Copy production environment
cp backend/env.production.example backend/.env.production

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 API Documentation

Once the application is running, visit:

- **Swagger UI**: http://localhost:3000/docs
- **API Base URL**: http://localhost:3000/api/v1

## 🔐 Authentication

The API uses JWT-based authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

### Authentication Endpoints

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile

## 📅 Events Management

### Event Endpoints

- `GET /api/v1/events` - Get user events (paginated)
- `POST /api/v1/events` - Create new event
- `GET /api/v1/events/:id` - Get event by ID
- `PUT /api/v1/events/:id` - Update event
- `DELETE /api/v1/events/:id` - Delete event
- `GET /api/v1/events/upcoming` - Get upcoming events

### Event Data Structure

```json
{
  "title": "Team Meeting",
  "description": "Weekly team sync",
  "date": "2024-01-15T10:00:00Z",
  "time": "10:00 AM",
  "location": "Conference Room A"
}
```

## 🔔 Notifications

### Notification Endpoints

- `GET /api/v1/notifications` - Get user notifications
- `GET /api/v1/notifications/unread-count` - Get unread count
- `PUT /api/v1/notifications/:id/read` - Mark as read
- `PUT /api/v1/notifications/read-all` - Mark all as read
- `DELETE /api/v1/notifications/:id` - Delete notification
- `GET /api/v1/notifications/settings` - Get notification settings
- `PUT /api/v1/notifications/settings` - Update settings

### Notification Types

- `EVENT_REMINDER` - Event reminder notifications
- `EVENT_CREATED` - Event creation notifications
- `EVENT_UPDATED` - Event update notifications
- `EVENT_DELETED` - Event deletion notifications
- `SYSTEM_MESSAGE` - System messages
- `MARKETING` - Marketing emails

## 🗄️ Database Schema

### Users Table
- `id` - Unique identifier
- `email` - User email (unique)
- `name` - User name
- `password` - Hashed password
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Events Table
- `id` - Unique identifier
- `title` - Event title
- `description` - Event description
- `date` - Event date
- `time` - Event time
- `location` - Event location
- `userId` - Foreign key to users table

### Notifications Table
- `id` - Unique identifier
- `title` - Notification title
- `message` - Notification message
- `type` - Notification type
- `read` - Read status
- `userId` - Foreign key to users table

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `SMTP_HOST` | SMTP server host | Required for emails |
| `SMTP_PORT` | SMTP server port | 587 |
| `SMTP_USER` | SMTP username | Required for emails |
| `SMTP_PASS` | SMTP password | Required for emails |

### Rate Limiting

- Default: 10 requests per minute per IP
- Configurable via `THROTTLE_TTL` and `THROTTLE_LIMIT`

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugger

# Production
npm run build              # Build the application
npm run start:prod         # Start production server

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations
npm run prisma:studio      # Open Prisma Studio
npm run prisma:seed        # Seed database

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

## 🚀 Deployment

### Docker Production Deployment

1. Set up production environment variables
2. Build and run with Docker Compose:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables
3. Start the application:
```bash
npm run start:prod
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Request validation
- Rate limiting
- CORS protection
- SQL injection protection (Prisma)

## 📊 Monitoring

- Application logs with timestamps
- Error tracking ready (Sentry integration available)
- Health check endpoints
- Database query logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
