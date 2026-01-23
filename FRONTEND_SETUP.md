# Alhamdulillah Foundation - Frontend Setup

A modern, professional Next.js frontend for the Alhamdulillah Foundation investment management platform.

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to view the application.

---

## Project Structure

```
app/
├── page.tsx                 # Landing page with features
├── layout.tsx               # Root layout with metadata
├── globals.css              # Theme colors and styles
│
├── auth/                    # Authentication pages
│   ├── layout.tsx           # Auth layout wrapper
│   ├── login/page.tsx       # Login page
│   └── signup/page.tsx      # Signup page
│
├── dashboard/               # User dashboard
│   ├── layout.tsx           # Dashboard sidebar navigation
│   ├── page.tsx             # Dashboard overview
│   ├── projects/
│   │   ├── page.tsx         # Projects listing
│   │   └── [id]/page.tsx    # Project details
│   ├── members/page.tsx     # Members & join requests
│   ├── payments/page.tsx    # Payment history
│   └── settings/page.tsx    # User settings
│
├── admin/                   # Admin control panel
│   ├── layout.tsx           # Admin sidebar navigation
│   ├── page.tsx             # Admin dashboard
│   ├── users/page.tsx       # User management
│   ├── projects/page.tsx    # Project administration
│   └── settings/page.tsx    # System settings
│
└── api/                     # API routes
    └── auth/
        ├── login/route.ts   # Login endpoint
        └── register/route.ts # Registration endpoint

components/
├── ui/                      # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── tabs.tsx
│   └── ... (other UI components)

hooks/
├── use-mobile.tsx           # Mobile detection hook
└── use-toast.ts             # Toast notifications hook

lib/
└── utils.ts                 # Utility functions
```

---

## Key Features Implemented

### 1. Landing Page
- Modern hero section with clear value proposition
- Feature cards highlighting platform benefits
- How-it-works section with step-by-step guide
- Call-to-action sections for signup
- Professional navigation bar

### 2. Authentication
- **Signup Page**: Collect user details (first/last name, email, phone, password)
- **Login Page**: Email and password authentication
- JWT token storage in localStorage
- Session management with API routes

### 3. User Dashboard
- **Overview**: Key statistics and recent projects
- **Projects**: Browse and manage investment projects
- **Members**: Manage join requests and memberships
- **Payments**: View payment history and investment details
- **Settings**: Update profile, change password, notification preferences

### 4. Project Management
- Project listing with search and filters
- Detailed project pages with:
  - Funding progress tracking
  - Member management
  - Project timeline
  - Investment details
- Project creation interface (UI ready for backend integration)

### 5. Admin Panel
- **Dashboard**: System statistics and analytics
  - Charts for funding trends
  - Project distribution
  - Recent user activity
- **Users Management**: 
  - User listing with roles and status
  - Role assignment
  - User suspension/deletion
- **Projects Administration**:
  - Project overview and management
  - Funding tracking
  - Member count tracking
- **Settings**:
  - Platform configuration
  - Payment gateway setup (SSLCommerz)
  - Email (SMTP) configuration
  - Database backup settings

### 6. Design System
- **Color Scheme** (Trust-focused professional):
  - Primary: Deep Teal (#0ea5e9)
  - Secondary: Light Slate Blue (#06b6d4)
  - Accent: Bright Blue (#52d4ed)
  - Neutrals: White, grays, off-blacks
- **Typography**: Geist font family
- **Components**: shadcn/ui components for consistency
- **Responsive Design**: Mobile-first approach

---

## Configuration

### API Integration

Replace mock API calls with actual backend endpoints. Update `/app/api/auth/` route handlers:

```typescript
// Example: Connecting to your NestJS backend
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000  # Your backend API URL
```

---

## User Roles & Permissions

### Super Admin
- Access to complete admin dashboard
- System configuration
- User and project management
- Database backup controls

### Admin
- Project management
- User oversight
- Payment processing
- Member approvals

### Moderator
- Join request approvals
- Member position assignment
- Project moderation

### User
- View and join projects
- Make investments
- Manage profile
- Access personal dashboard

---

## Integration with NestJS Backend

The frontend API routes currently use mock responses. To connect with your NestJS backend:

1. **Update API URLs** in environment variables
2. **Modify route handlers** in `/app/api/` to call your backend
3. **Implement authentication** with JWT tokens from your backend
4. **Add error handling** for backend responses

Example integration:

```typescript
// /app/api/auth/login/route.ts
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})

const data = await response.json()

if (!response.ok) {
  return NextResponse.json(data, { status: response.status })
}

return NextResponse.json({
  token: data.access_token,
  user: data.user,
}, { status: 200 })
```

---

## Payment Integration (SSLCommerz)

The frontend includes a payments page ready for SSLCommerz integration:

1. Configure SSLCommerz credentials in admin settings
2. Implement payment initiation in `/app/api/payments/`
3. Handle payment callbacks from SSLCommerz
4. Update payment status in your database

---

## Development Tips

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
npm start
```

### Code Quality
```bash
npm run lint
npm run format
```

### Dashboard Navigation
- User Dashboard: `/dashboard`
- Projects: `/dashboard/projects`
- Members: `/dashboard/members`
- Payments: `/dashboard/payments`
- Settings: `/dashboard/settings`

### Admin Navigation
- Admin Panel: `/admin`
- Users: `/admin/users`
- Projects: `/admin/projects`
- Settings: `/admin/settings`

---

## Security Considerations

1. **JWT Tokens**: Stored in localStorage (consider using httpOnly cookies for production)
2. **CORS**: Configure proper CORS headers in your backend
3. **Input Validation**: All form inputs are validated client-side
4. **API Security**: Implement proper authentication and authorization on backend
5. **Rate Limiting**: Configure rate limiting on your backend API

---

## Performance Optimization

- Server-side rendering (SSR) with Next.js App Router
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- CSS-in-JS with Tailwind CSS
- Recharts for efficient data visualization

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Troubleshooting

### CORS Issues
- Ensure your backend has proper CORS configuration
- Check API URL in environment variables

### Authentication Failing
- Verify JWT token is stored correctly
- Check backend authentication endpoint
- Ensure credentials match backend expectations

### Styling Issues
- Clear `.next` folder and rebuild
- Check Tailwind CSS configuration in `globals.css`

---

## Future Enhancements

- [ ] Real-time notifications (WebSocket)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Profit distribution system
- [ ] Document upload/sharing
- [ ] Video integration for projects
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Multi-language support
- [ ] Dark mode toggle (currently supports system preference)

---

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create detailed issue reports
3. Contact: support@alhamdulillah.com

---

## License

MIT License - See LICENSE file for details
