# Freeducation Platform - Modular Architecture

A modern educational platform built with Cloudflare Workers, featuring a completely modular architecture for easy maintenance and scalability.

## 🏗️ Project Structure

```
freeducation/
├── src/                          # Main source directory
│   ├── db/                       # Database layer
│   │   ├── schema.js            # Database table definitions
│   │   └── database.js          # Database utilities and migrations
│   ├── auth/                     # Authentication layer
│   │   └── auth.js              # Authentication utilities and middleware
│   ├── routes/                   # API routes
│   │   ├── index.js             # Route registry and handler
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── users.js             # User management endpoints
│   │   ├── classes.js           # Academic content endpoints
│   │   └── settings.js          # System settings endpoints
│   ├── components/               # React UI components
│   │   ├── common/              # Shared components
│   │   │   ├── NavBar.jsx
│   │   │   ├── LogoMark.jsx
│   │   │   ├── AuthForm.jsx
│   │   │   └── BackgroundArt.jsx
│   │   ├── admin/               # Admin-specific components
│   │   │   ├── AdminShell.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   └── AdminMobileNav.jsx
│   │   ├── teacher/             # Teacher-specific components
│   │   ├── student/             # Student-specific components
│   │   └── public/              # Public-facing components
│   ├── utils/                    # Utility functions
│   └── types/                    # TypeScript type definitions
├── worker.js                     # Main entry point (imports from src/)
├── worker-original.js            # Backup of original monolithic file
├── package.json                 # Dependencies and scripts
└── wrangler.toml               # Cloudflare Workers configuration
```

## 🚀 Key Features

### Modular Architecture
- **Separation of Concerns**: Each module has a specific responsibility
- **Easy Maintenance**: Update individual components without affecting others
- **Scalability**: Add new features by creating new modules
- **Reusability**: Components can be shared across different parts of the app

### Database Layer (`src/db/`)
- **Schema Management**: All table definitions in one place
- **Migration System**: Automatic database schema updates
- **Type Safety**: Structured data access patterns

### Authentication (`src/auth/`)
- **JWT-based Authentication**: Secure token-based auth
- **Role-based Access**: Admin, Teacher, Student roles
- **Middleware Protection**: Easy route protection

### API Routes (`src/routes/`)
- **RESTful Design**: Clean API endpoints
- **Error Handling**: Consistent error responses
- **Validation**: Input validation and sanitization

### UI Components (`src/components/`)
- **React Components**: Modern, reusable UI components
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components

## 🛠️ Development

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Deploy to production
npm run deploy
```

### Adding New Features

1. **New API Endpoint**: Add to appropriate file in `src/routes/`
2. **New Database Table**: Add to `src/db/schema.js`
3. **New UI Component**: Add to appropriate folder in `src/components/`
4. **New Utility Function**: Add to `src/utils/`

### Database Migrations
The system automatically handles database migrations. When you update the schema:
1. Modify table definitions in `src/db/schema.js`
2. The migration system will automatically update existing databases

### Authentication
All protected routes use the `authenticate` middleware:
```javascript
import { authenticate } from '../auth/auth.js';

const user = await authenticate(request, env);
if (!user) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
```

## 📦 Deployment

### Cloudflare Workers
The platform is designed to run on Cloudflare Workers with:
- **D1 Database**: SQLite-compatible database
- **R2 Storage**: File storage for avatars and assets
- **KV Storage**: Caching and session storage

### Environment Variables
Required environment variables:
- `JWT_SECRET`: Secret for JWT token signing
- `DATABASE_URL`: D1 database connection
- `STORAGE_BUCKET`: R2 storage bucket name

## 🔧 Configuration

### Wrangler.toml
```toml
name = "freeducation"
main = "worker.js"
compatibility_date = "2023-12-01"

[env.production.vars]
JWT_SECRET = "your-secret-key"
```

## 🧪 Testing

### Local Development
```bash
# Start with local database
wrangler dev

# Test specific endpoints
curl -X POST http://localhost:8787/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/login` - User login
- `POST /api/register-admin` - Register first admin
- `GET /api/me` - Get current user info
- `POST /api/change-password` - Change password

### User Management
- `GET /api/users` - List all users (admin only)
- `POST /api/users` - Create new user (admin only)
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Academic Content
- `GET /api/classes` - List available classes
- `GET /api/subjects` - Get subjects for a class
- `GET /api/chapters` - Get chapters for a subject

## 🔄 Migration from Monolithic

If you're migrating from the original `worker-original.js`:

1. **Database**: All existing data is preserved
2. **Authentication**: JWT tokens remain valid
3. **API Endpoints**: All endpoints maintain compatibility
4. **UI**: React components work the same way

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes in the appropriate module
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the documentation
- Review the modular structure
- Contact the development team

---

**Built with ❤️ for modern education**
