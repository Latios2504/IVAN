# IVAN - Volunteer Management System Frontend

A comprehensive volunteer management system built with React, TypeScript, and modern UI components.

## 🚀 Features Completed

### ✅ Authentication System

- **Login/Register**: Complete authentication flow with role selection
- **Password Reset**: Forgot password and reset functionality
- **Role-based Access**: Different user roles (volunteer, organization, admin)
- **Protected Routes**: Authentication-aware route protection
- **Session Management**: Persistent login sessions with localStorage

### ✅ User Roles & Dashboards

- **Volunteer Dashboard**: Personal stats, upcoming events, activity history
- **Organization Dashboard**: Event management, volunteer statistics, verification status
- **Admin Dashboard**: System-wide management, user oversight, verification approval

### ✅ Public Pages

- **Homepage**: Modern landing page with hero section and features
- **Volunteers Listing**: Browse and search available volunteers
- **Organizations Listing**: Browse verified organizations with filtering
- **Events Listing**: Public event discovery with detailed information

### ✅ Profile Management

- **Role-specific Profiles**: Tailored profile pages for each user type
- **Volunteer Profiles**: Skills, interests, activity history, personal information
- **Organization Profiles**: Company details, verification status, event history
- **Admin Profiles**: System administration tools and user management

### ✅ UI/UX Components

- **Shadcn/UI Integration**: Modern, accessible component library
- **Responsive Design**: Mobile-first design approach
- **Dark Mode Ready**: Components support theme switching
- **Navigation**: Persistent navigation with role-aware menu items

### ✅ Events System

- **Event Discovery**: Public event listing with search and filters
- **Event Details**: Comprehensive event information display
- **Registration System**: Volunteer registration for events
- **Event Management**: Organization tools for event creation and management

### ✅ Admin Panel

- **User Management**: View, suspend, and manage all users
- **Organization Verification**: Review and approve organization applications
- **System Statistics**: Overview of platform metrics
- **Content Moderation**: Tools for managing platform content

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Modern component library
- **React Router** - Client-side routing
- **Lucide React** - Icon library

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # Shadcn/UI components
│   └── layout/       # Layout components (Navbar, ProtectedRoute)
├── hooks/            # Custom React hooks (useAuth)
├── pages/            # Page components organized by feature
│   ├── auth/         # Authentication pages
│   ├── dashboard/    # Dashboard pages
│   ├── profile/      # Profile management
│   ├── events/       # Event-related pages
│   ├── volunteers/   # Volunteer listing
│   ├── organizations/ # Organization listing
│   └── admin/        # Admin panel
├── routes/           # Route configuration
├── types/            # TypeScript type definitions
└── lib/              # Utility functions
```

## 🔧 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd front-end/ivan-ui
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🧪 Testing the Application

### Test Accounts

The application includes mock authentication for testing:

- **Volunteer Account**: Any email not containing 'org' or 'admin'
- **Organization Account**: Email containing 'org' (e.g., test@org.com)
- **Admin Account**: Email containing 'admin' (e.g., admin@test.com)

### Navigation Testing

1. **Public Pages**: Visit volunteers, organizations, and events pages
2. **Authentication**: Test login/register flows with different roles
3. **Role-based Features**: Login with different account types to see role-specific content
4. **Protected Routes**: Try accessing `/dashboard`, `/profile`, `/admin` without authentication

## 🎨 UI Components

All UI components are built with Shadcn/UI and include:

- **Forms**: Login, register, profile editing
- **Navigation**: Responsive navbar with role-aware menu
- **Cards**: Event cards, volunteer cards, organization cards
- **Badges**: Status indicators, role badges, verification badges
- **Tables**: User management, event listings
- **Tabs**: Profile sections, admin panel sections

## 🔒 Authentication Flow

1. **Registration**: Users select role (volunteer/organization) during signup
2. **Login**: Email/password authentication with role-based redirects
3. **Session**: Persistent sessions using localStorage
4. **Protection**: Routes protected based on authentication status and user role
5. **Logout**: Clean session termination

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Responsive layouts for tablet screens
- **Desktop**: Full-featured desktop experience
- **Touch Friendly**: Accessible touch targets and interactions

## 🚧 Future Enhancements

- **Backend Integration**: Connect to actual API endpoints
- **Real-time Updates**: WebSocket integration for live updates
- **File Uploads**: Profile pictures and document uploads
- **Email Notifications**: Automated email system
- **Advanced Search**: Elasticsearch integration
- **Analytics Dashboard**: Detailed analytics and reporting
- **Mobile App**: React Native mobile application

## 📝 Development Notes

- **Type Safety**: Comprehensive TypeScript coverage
- **Component Reusability**: Modular component architecture
- **Performance**: Lazy loading for pages and components
- **Accessibility**: WCAG compliant components
- **SEO Ready**: Semantic HTML structure

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
   },
   })

```

```
