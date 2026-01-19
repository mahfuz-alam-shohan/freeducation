# Free Education Platform

A comprehensive, free education platform for NCTB Bangladesh students (classes 6-12) with social features, gamification, and multi-role user management.

## 🚀 Features

### Core Platform
- **Multi-Role User System**: Admin, Student, Teacher, Writer, Publisher roles
- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **Automatic Database Setup**: Zero manual database configuration required
- **Modular Architecture**: Extensible design for future enhancements

### Educational Features
- **Subject Management**: Complete NCTB curriculum support (classes 6-12)
- **Chapter & Lesson System**: Structured content organization
- **Assessment Platform**: Tests, quizzes, and exams with automatic grading
- **Study Session Tracking**: Monitor learning time and progress

### Social Features
- **Social Feed**: Posts, likes, and comments system
- **Community Learning**: Student interaction and collaboration
- **Facebook-like Moderation**: User reports with admin review system

### Gamification
- **Credit Economy**: Earn credits through study time, tests, and contributions
- **Social Usage Gating**: Use credits to limit social media time
- **Achievement System**: Reward student engagement and progress

## 🏗️ Architecture

### Technology Stack
- **Backend**: Hono framework + TypeScript
- **Database**: Cloudflare D1 with automatic migrations
- **Storage**: Cloudflare R2 for media files
- **Authentication**: JWT tokens with secure password hashing
- **Frontend**: Tailwind CSS + vanilla JavaScript
- **Deployment**: Cloudflare Workers with automatic deployment

### Database Schema (15 tables)
- **Users & Profiles**: Authentication and extended user information
- **Educational Content**: Subjects, chapters, lessons, assessments
- **Social Features**: Posts, likes, comments
- **Gamification**: Credit transactions, study sessions
- **System Management**: Settings, audit logs

## 📋 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Cloudflare account with Workers and D1 database
- GitHub account (for auto-deployment)

### Quick Start

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd freeducation
   npm install
   ```

2. **Configure Cloudflare**
   - Update `wrangler.toml` with your D1 database ID
   - Set environment variables in Cloudflare dashboard
   - Configure R2 bucket for file storage

3. **Deploy Platform**
   ```bash
   npm run deploy
   ```

4. **Initial Admin Setup**
   - Visit your deployed URL
   - Fill out the admin creation form
   - Platform automatically initializes database and creates admin account

## 🔧 Configuration

### Environment Variables
- `JWT_SECRET`: Secret key for JWT token signing
- `GMAIL_CLIENT_ID`: Gmail OAuth for email features
- `GMAIL_CLIENT_SECRET`: Gmail OAuth secret
- `GMAIL_REFRESH_TOKEN`: Gmail OAuth refresh token

### Database Settings
All database operations are handled automatically:
- **Schema Creation**: Automatic table creation on first run
- **Migrations**: Handle schema updates seamlessly
- **Data Seeding**: Default settings and configurations

## 📚 User Roles & Permissions

### Admin
- Complete platform management
- User administration
- Content moderation
- System configuration
- Analytics and reporting

### Student
- Access educational content
- Take assessments
- Earn credits through learning
- Participate in social features

### Teacher
- Create and manage content
- Conduct assessments
- Monitor student progress
- Class management

### Writer
- Publish educational content
- Content analytics
- Collaborative writing tools

### Publisher
- Content distribution management
- Revenue tracking
- Publication analytics

## 🚀 Deployment

### Automatic Deployment
Platform is configured for automatic deployment via GitHub Actions:
1. Push changes to GitHub
2. Cloudflare Workers automatically builds and deploys
3. Database migrations run automatically
4. Platform is immediately available

### Manual Deployment
```bash
# Deploy to Cloudflare Workers
npm run deploy

# Run database migrations (if needed)
npm run migrate

# View real-time logs
npm run tail
```

## 🔒 Security Features

- **Password Security**: bcrypt hashing with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive form validation
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Proper cross-origin resource sharing
- **Audit Logging**: Complete action tracking

## 📊 Monitoring & Analytics

### Built-in Analytics
- User registration and activity tracking
- Study session analytics
- Assessment performance metrics
- Social engagement statistics
- Credit economy monitoring

### Admin Dashboard
- Real-time platform statistics
- User management interface
- System health monitoring
- Activity logs and audit trails

## 🎯 Future Enhancements

The modular architecture allows for easy extension:

### Phase 2: Advanced Features
- Video streaming integration
- Live classroom functionality
- Advanced assessment types
- Mobile applications

### Phase 3: AI Integration
- Personalized learning paths
- AI-powered content recommendations
- Automated assessment generation
- Intelligent tutoring system

### Phase 4: Enterprise Features
- School management system
- Advanced reporting
- Integration with educational tools
- Multi-tenant architecture

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
- Create an issue in the GitHub repository
- Check the documentation
- Review the admin dashboard for system status

---

**Free Education Platform** - Empowering Bangladesh's students with quality, accessible education.
