import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          phone: string | null;
          full_name: string;
          wallet_balance: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          phone?: string | null;
          full_name: string;
          wallet_balance?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string | null;
          full_name?: string;
          wallet_balance?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      raffles: {
        Row: {
          id: string;
          title: string;
          description: string;
          prize_image_url: string | null;
          ticket_price: number;
          max_tickets: number;
          tickets_sold: number;
          start_date: string;
          end_date: string;
          status: 'active' | 'completed' | 'cancelled';
          prize_value: number;
          winner_ticket_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          prize_image_url?: string | null;
          ticket_price: number;
          max_tickets: number;
          tickets_sold?: number;
          start_date: string;
          end_date: string;
          status?: 'active' | 'completed' | 'cancelled';
          prize_value: number;
          winner_ticket_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          prize_image_url?: string | null;
          ticket_price?: number;
          max_tickets?: number;
          tickets_sold?: number;
          start_date?: string;
          end_date?: string;
          status?: 'active' | 'completed' | 'cancelled';
          prize_value?: number;
          winner_ticket_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tickets: {
        Row: {
          id: string;
          raffle_id: string;
          user_id: string;
          ticket_number: string;
          purchase_date: string;
          price_paid: number;
          is_winner: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          raffle_id: string;
          user_id: string;
          ticket_number: string;
          purchase_date?: string;
          price_paid: number;
          is_winner?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          raffle_id?: string;
          user_id?: string;
          ticket_number?: string;
          purchase_date?: string;
          price_paid?: number;
          is_winner?: boolean;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          raffle_id: string | null;
          ticket_id: string | null;
          type: 'ticket_purchase' | 'wallet_topup' | 'refund' | 'prize_claim';
          amount: number;
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_provider: string | null;
          payment_reference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          raffle_id?: string | null;
          ticket_id?: string | null;
          type: 'ticket_purchase' | 'wallet_topup' | 'refund' | 'prize_claim';
          amount: number;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_provider?: string | null;
          payment_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          raffle_id?: string | null;
          ticket_id?: string | null;
          type?: 'ticket_purchase' | 'wallet_topup' | 'refund' | 'prize_claim';
          amount?: number;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_provider?: string | null;
          payment_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          message: string;
          type: 'raffle_start' | 'raffle_end' | 'winner_announcement' | 'general';
          sent_at: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          message: string;
          type: 'raffle_start' | 'raffle_end' | 'winner_announcement' | 'general';
          sent_at?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          message?: string;
          type?: 'raffle_start' | 'raffle_end' | 'winner_announcement' | 'general';
          sent_at?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
};
