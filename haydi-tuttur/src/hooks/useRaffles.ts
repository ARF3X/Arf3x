import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Raffle = Database['public']['Tables']['raffles']['Row'];

export const useRaffles = () => {
  return useQuery({
    queryKey: ['raffles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('raffles')
        .select('*')
        .eq('status', 'active')
        .order('end_date', { ascending: true });

      if (error) throw error;
      return data as Raffle[];
    },
  });
};

export const useRaffle = (id: string) => {
  return useQuery({
    queryKey: ['raffle', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('raffles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Raffle | null;
    },
  });
};

export const useUserTickets = (userId: string) => {
  return useQuery({
    queryKey: ['tickets', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*, raffles(*)')
        .eq('user_id', userId)
        .order('purchase_date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const usePurchaseTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      raffleId,
      userId,
      ticketPrice,
      ticketNumber
    }: {
      raffleId: string;
      userId: string;
      ticketPrice: number;
      ticketNumber: string;
    }) => {
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          raffle_id: raffleId,
          user_id: userId,
          ticket_number: ticketNumber,
          price_paid: ticketPrice,
        })
        .select()
        .single();

      if (ticketError) throw ticketError;

      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          raffle_id: raffleId,
          ticket_id: ticket.id,
          type: 'ticket_purchase',
          amount: ticketPrice,
          status: 'completed',
        });

      if (transactionError) throw transactionError;

      const { error: raffleError } = await supabase.rpc('increment_tickets_sold', {
        raffle_id: raffleId,
      });

      if (raffleError) console.error('Failed to increment tickets_sold:', raffleError);

      return ticket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['raffles'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};
