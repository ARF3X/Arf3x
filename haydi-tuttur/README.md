# Haydi Tut-Tur - Lottery Application

A modern, dynamic lottery application where users can purchase tickets and participate in monthly raffles to win prizes like iPhones, MacBooks, cars, and more. Half of the net profit from each raffle is automatically reinvested into next month's prizes.

## Features

### User Features
- User registration and authentication (email/password)
- Browse active raffles with real-time countdown timers
- Purchase tickets securely
- View ticket history and status
- Receive notifications for raffle results
- Prize claim system for winners

### Admin Features (Coming Soon)
- Dashboard for raffle management
- Revenue tracking and analytics
- User management
- Push notification system

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6

## Database Schema

The application uses the following main tables:
- `profiles` - User profile information
- `raffles` - Raffle configurations and prizes
- `tickets` - Individual lottery tickets
- `transactions` - Financial transaction records
- `prize_claims` - Winner prize claim information
- `revenue_tracking` - Monthly revenue and reinvestment tracking
- `notifications` - Push notification records
- `admin_users` - Admin roles and permissions

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `MIGRATION.sql` in this directory
4. Execute the SQL to create all necessary tables, policies, and sample data

### Application Setup

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── contexts/         # React contexts (Auth, etc.)
├── hooks/            # Custom React hooks
├── lib/              # Library configurations (Supabase)
├── pages/            # Page components
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── RafflePage.tsx
│   └── MyTicketsPage.tsx
├── App.tsx           # Main app component with routing
└── main.tsx          # Application entry point
```

## Key Concepts

### Raffle System
- Each raffle has a title, description, prize image, ticket price, and maximum tickets
- Tickets are sold until the maximum is reached or the end date arrives
- Winners are selected randomly from all purchased tickets

### Revenue Reinvestment
- 50% of net profit from each month automatically goes to the next month's prize budget
- This ensures continuously growing prizes and excitement

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Admin actions require special permissions
- All authentication handled securely through Supabase

## Future Enhancements

- [ ] Admin dashboard
- [ ] Payment gateway integration (iyzico, Stripe)
- [ ] Push notifications via Firebase Cloud Messaging
- [ ] Winner selection algorithm and audit trail
- [ ] Mobile responsive improvements
- [ ] Progressive Web App (PWA) support
- [ ] Social media login options
- [ ] Email notifications
- [ ] Wallet system for credits

## License

This project is proprietary and confidential.
