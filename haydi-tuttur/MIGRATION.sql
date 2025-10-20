-- Haydi Tut-Tur Database Migration
-- Run this SQL in your Supabase SQL Editor once the service is available

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text UNIQUE,
  full_name text NOT NULL,
  wallet_balance decimal(10,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Create raffles table
CREATE TABLE IF NOT EXISTS raffles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  prize_image_url text,
  ticket_price decimal(10,2) NOT NULL,
  max_tickets integer NOT NULL,
  tickets_sold integer DEFAULT 0,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  prize_value decimal(10,2) NOT NULL,
  winner_ticket_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE raffles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active raffles" ON raffles FOR SELECT USING (status = 'active' OR auth.uid() IS NOT NULL);

-- Create admin_users table first (needed for policies)
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'support' CHECK (role IN ('super_admin', 'raffle_manager', 'support')),
  permissions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view own admin profile" ON admin_users FOR SELECT TO authenticated USING (auth.uid() = id);

-- Admin policies for raffles
CREATE POLICY "Only admins can insert raffles" ON raffles FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
);

CREATE POLICY "Only admins can update raffles" ON raffles FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  raffle_id uuid NOT NULL REFERENCES raffles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ticket_number text UNIQUE NOT NULL,
  purchase_date timestamptz DEFAULT now(),
  price_paid decimal(10,2) NOT NULL,
  is_winner boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tickets" ON tickets FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tickets" ON tickets FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_tickets_raffle_id ON tickets(raffle_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_number ON tickets(ticket_number);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  raffle_id uuid REFERENCES raffles(id) ON DELETE SET NULL,
  ticket_id uuid REFERENCES tickets(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('ticket_purchase', 'wallet_topup', 'refund', 'prize_claim')),
  amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_provider text,
  payment_reference text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Create prize_claims table
CREATE TABLE IF NOT EXISTS prize_claims (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  raffle_id uuid NOT NULL REFERENCES raffles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ticket_id uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  shipping_address text NOT NULL,
  phone_number text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'shipped', 'delivered')),
  notes text,
  claimed_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE prize_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own prize claims" ON prize_claims FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own prize claims" ON prize_claims FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own prize claims" ON prize_claims FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create revenue_tracking table
CREATE TABLE IF NOT EXISTS revenue_tracking (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  month date NOT NULL UNIQUE,
  total_revenue decimal(10,2) DEFAULT 0.00,
  operating_costs decimal(10,2) DEFAULT 0.00,
  net_profit decimal(10,2) DEFAULT 0.00,
  reinvestment_amount decimal(10,2) DEFAULT 0.00,
  next_month_budget decimal(10,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE revenue_tracking ENABLE ROW LEVEL SECURITY;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('raffle_start', 'raffle_end', 'winner_announcement', 'general')),
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
    CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_raffles_updated_at') THEN
    CREATE TRIGGER update_raffles_updated_at BEFORE UPDATE ON raffles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_transactions_updated_at') THEN
    CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_prize_claims_updated_at') THEN
    CREATE TRIGGER update_prize_claims_updated_at BEFORE UPDATE ON prize_claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_revenue_tracking_updated_at') THEN
    CREATE TRIGGER update_revenue_tracking_updated_at BEFORE UPDATE ON revenue_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Insert sample raffle data
INSERT INTO raffles (title, description, prize_image_url, ticket_price, max_tickets, start_date, end_date, prize_value, status) VALUES
('iPhone 15 Pro Max', 'En yeni iPhone modeli! 256GB hafıza, Titanyum kasa, A17 Pro çip. Kazanan hemen teslim alabilir!', 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg', 25.00, 1000, now(), now() + interval '30 days', 45000.00, 'active'),
('MacBook Air M2', 'Apple MacBook Air 13 inch M2 çip, 8GB RAM, 256GB SSD. İş ve eğlence için mükemmel!', 'https://images.pexels.com/photos/18105/pexels-photo.jpg', 30.00, 800, now(), now() + interval '25 days', 35000.00, 'active'),
('PlayStation 5', 'Sony PlayStation 5 konsol + 2 oyun! Oyun tutkunları için harika bir fırsat.', 'https://images.pexels.com/photos/371924/pexels-photo-371924.jpeg', 15.00, 1500, now(), now() + interval '20 days', 15000.00, 'active')
ON CONFLICT DO NOTHING;
