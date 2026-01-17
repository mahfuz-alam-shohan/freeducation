# freeducation

An innovative ed-tech platform with integrated social media features, built entirely on Cloudflare Workers.

## 🎯 Overview

**freeducation** is a comprehensive educational platform designed for the Bangladeshi education system that combines:

- **Educational Content Management**: Subject-wise materials for different classes
- **Assessment System**: MCQ tests, practice questions, previous year papers
- **Credit System**: Earn credits through studying, spend on social media time
- **Social Integration**: Controlled social media access based on educational engagement
- **Multi-Stakeholder Support**: Students, teachers, writers, publishers, and institutions

## 🏗️ Architecture

### Technology Stack
- **Backend**: Cloudflare Workers + Hono.js
- **Database**: Cloudflare D1 (SQLite)
- **Frontend**: React + Vite + TailwindCSS
- **Authentication**: JWT with bcrypt password hashing
- **File Storage**: Cloudflare R2 (for educational content)

### Key Features
- ✅ **First-time Admin Setup**: Secure one-time admin registration
- ✅ **Responsive Design**: Separate mobile and desktop components
- ✅ **Modern UI/UX**: Professional, compact interface
- ✅ **Secure Authentication**: Industry-standard security practices
- ✅ **Code-based Database**: All schema managed through code

## 📁 Project Structure

```
freeducation/
├── src/                          # Backend (Cloudflare Workers)
│   ├── index.js                  # Main worker entry point
│   ├── routes/                   # API routes
│   │   ├── auth.js              # Authentication endpoints
│   │   └── admin.js             # Admin management
│   └── db/                      # Database layer
│       ├── index.js             # Database connection
│       └── schema.js            # Database schema
├── client/                       # Frontend (React)
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── mobile/         # Mobile-specific components
│   │   │   ├── desktop/        # Desktop-specific components
│   │   │   ├── layout/         # Layout components
│   │   │   └── ui/             # Reusable UI components
│   │   ├── contexts/           # React contexts
│   │   ├── services/           # API services
│   │   └── App.jsx             # Main App component
│   ├── package.json
│   └── vite.config.js
├── database/
│   └── schema.sql              # Database schema
├── package.json                 # Root package.json
├── wrangler.toml               # Cloudflare Workers config
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Cloudflare account with Workers and D1 enabled
- Wrangler CLI installed

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd freeducation
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Setup Database**
   ```bash
   # Create D1 database
   wrangler d1 create freeducation
   
   # Update database_id in wrangler.toml
   
   # Run migrations
   wrangler d1 execute freeducation --file=./database/schema.sql
   ```

4. **Environment Setup**
   ```bash
   # Copy wrangler.toml.example to wrangler.toml
   # Update your database_id and secrets
   ```

5. **Start Development**
   ```bash
   # Start backend (in one terminal)
   npm run dev
   
   # Start frontend (in another terminal)
   cd client
   npm run dev
   ```

## 📱 Responsive Design

The platform features **separate mobile and desktop components**:

- **Mobile Components**: Located in `client/src/components/mobile/`
- **Desktop Components**: Located in `client/src/components/desktop/`
- **Automatic Detection**: Responsive design based on screen width
- **Optimized UX**: Tailored experience for each device type

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **First-time Setup**: One-time admin registration with form disable
- **Environment Variables**: Secure configuration management
- **Input Validation**: Comprehensive form validation

## 📊 Database Schema

### Core Tables
- `system_config`: System configuration and flags
- `admins`: Administrator accounts
- `users`: Future user accounts (students, teachers, etc.)
- `sessions`: Authentication sessions

### Key Features
- **Code-based Schema**: All database changes through SQL files
- **Migration Ready**: Structured for future migrations
- **Secure Design**: Proper indexing and constraints

## 🎨 UI/UX Principles

- **Professional Design**: Clean, modern interface
- **International Standards**: Following modern admin panel patterns
- **User Experience Focused**: Intuitive navigation and interactions
- **Compact Layout**: Efficient use of screen space
- **Accessibility**: WCAG compliant design

## 🔧 Development Commands

```bash
# Backend development
npm run dev              # Start Cloudflare Workers dev server
npm run deploy           # Deploy to production

# Frontend development
cd client
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Database operations
wrangler d1 execute freeducation --file=./database/schema.sql
wrangler d1 execute freeducation --command="SELECT * FROM admins"
```

## 🌐 Deployment

### Production Deployment
```bash
# Build frontend
cd client && npm run build

# Deploy to Cloudflare Workers
cd .. && npm run deploy
```

### Environment Configuration
- **Development**: Uses local development database
- **Production**: Uses production D1 database
- **Environment Variables**: Configured in wrangler.toml

## 📈 Future Roadmap

### Phase 1 (Current)
- ✅ Admin authentication system
- ✅ First-time setup flow
- ✅ Responsive design
- ✅ Basic dashboard

### Phase 2 (Next)
- 🔄 User management system
- 🔄 Content management
- 🔄 Assessment system
- 🔄 Credit system implementation

### Phase 3 (Future)
- 📱 Social media features
- 📚 Advanced content types
- 🎓 Gamification elements
- 📊 Analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**freeducation** - Empowering education through technology 🎓
