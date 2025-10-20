import { useAuth } from '../contexts/AuthContext';
import { useUserTickets } from '../hooks/useRaffles';
import { Link } from 'react-router-dom';
import { Ticket, Award, Clock, ArrowLeft } from 'lucide-react';

export const MyTicketsPage = () => {
  const { user } = useAuth();
  const { data: tickets, isLoading } = useUserTickets(user?.id || '');

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Giriş Yapmalısınız</h2>
          <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Ana Sayfa</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Biletlerim</h1>
          <p className="text-slate-600">Satın aldığınız tüm biletleri buradan görüntüleyebilirsiniz</p>
        </div>

        {!tickets || tickets.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
            <Ticket className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Henüz biletiniz yok</h3>
            <p className="text-slate-600 mb-6">
              Aktif çekilişlere katılmak için bilet satın alın
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Çekilişlere Göz At
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket: any) => (
              <div
                key={ticket.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {ticket.is_winner ? (
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Award className="w-5 h-5 text-yellow-600" />
                        </div>
                      ) : (
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <Ticket className="w-5 h-5 text-emerald-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {ticket.raffles?.title || 'Çekiliş'}
                        </h3>
                        <p className="text-sm text-slate-600">Bilet No: {ticket.ticket_number}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm mt-3">
                      <div>
                        <span className="text-slate-500">Satın Alma Tarihi:</span>
                        <span className="ml-2 font-semibold text-slate-900">
                          {new Date(ticket.purchase_date).toLocaleDateString('tr-TR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Ödenen Tutar:</span>
                        <span className="ml-2 font-semibold text-slate-900">
                          {ticket.price_paid.toFixed(2)} ₺
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {ticket.is_winner ? (
                      <div className="px-4 py-2 bg-yellow-100 text-yellow-800 font-semibold rounded-lg">
                        Kazandınız!
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {ticket.raffles?.status === 'active' ? 'Çekiliş Devam Ediyor' : 'Sonuçlandı'}
                        </span>
                      </div>
                    )}

                    <Link
                      to={`/raffle/${ticket.raffle_id}`}
                      className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
                    >
                      Çekilişi Görüntüle →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <Ticket className="w-6 h-6 text-emerald-600" />
              <h3 className="font-semibold text-slate-900">Toplam Bilet</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{tickets?.length || 0}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-slate-900">Aktif Çekilişler</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {tickets?.filter((t: any) => t.raffles?.status === 'active').length || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6 text-yellow-600" />
              <h3 className="font-semibold text-slate-900">Kazandığınız</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {tickets?.filter((t: any) => t.is_winner).length || 0}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
