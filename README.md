# Advanced Subscription Management Platform v0.9

A comprehensive e-commerce solution with robust subscription analytics and user management capabilities.

## 🚀 Features

- **Subscription Management**
  - Create, update, and cancel subscriptions
  - Activity logging for all subscription events
  - Email notifications for key events

- **Analytics Dashboard**
  - Comprehensive subscription metrics
  - Interactive charts and visualizations
  - Key performance indicators
  - Custom report generation (CSV/JSON)

- **Payment Integration**
  - Stripe payment processing
  - Xero accounting integration
  - Secure payment handling

- **User Management**
  - Role-based access control
  - Admin dashboard
  - User activity tracking

## 🛠️ Tech Stack

- **Frontend**: Next.js, TypeScript, React Query, Recharts
- **Backend**: Node.js, Prisma
- **Authentication**: NextAuth.js
- **Payment**: Stripe
- **Accounting**: Xero
- **Styling**: Tailwind CSS

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd [repository-name]
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in the required environment variables in `.env`

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 🔧 Configuration

### Required Environment Variables

```env
# Stripe API Keys
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Xero API Keys
XERO_CLIENT_ID=
XERO_CLIENT_SECRET=
XERO_TENANT_ID=

# Database
DATABASE_URL=

# NextAuth
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Email (SMTP)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=
```

## 📈 Usage

1. **Admin Dashboard**: Access the admin dashboard at `/admin` to view analytics and manage subscriptions
2. **User Management**: Manage users and roles at `/admin/users`
3. **Reports**: Generate custom reports at `/admin/reports`
4. **Activity Logs**: View subscription activity at `/admin/activity`

## 🔒 Security

- Environment variables for sensitive data
- Role-based access control
- Secure payment processing
- Data encryption
- Regular security updates

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Support

For support, email [support@example.com](mailto:support@example.com) or create an issue in the repository.
