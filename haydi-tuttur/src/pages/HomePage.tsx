import { useRaffles } from '../hooks/useRaffles';
import { useAuth } from '../contexts/AuthContext';
import { Ticket, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const { data: raffles, isLoading } = useRaffles();
  const { user } = useAuth();

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    if (diff <= 0) return 'Bitti';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} gün ${hours} saat`;
    return `${hours} saat`;
  };

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
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Haydi Tut-Tur
            </h1>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors"
                  >
                    Profilim
                  </Link>
                  <Link
                    to="/my-tickets"
                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Biletlerim
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Şansını Dene, Kazanmaya Başla!
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Her ay yeni ödüller! iPhone, MacBook, araba ve daha fazlası seni bekliyor.
            Bilet al, çekilişe katıl, kazanan sen ol!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Ticket className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Kolay Bilet Alımı</h3>
            </div>
            <p className="text-slate-600 text-sm">
              Güvenli ödeme sistemiyle hızlıca biletini al ve çekilişe katıl
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Anlık Sonuçlar</h3>
            </div>
            <p className="text-slate-600 text-sm">
              Çekiliş sonuçlarını anında öğren, bildirim al
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Büyüyen Ödüller</h3>
            </div>
            <p className="text-slate-600 text-sm">
              Her ay kârın %50'si yeni ödüllere yatırılıyor
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 mb-6">Aktif Çekilişler</h3>

        {!raffles || raffles.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
            <p className="text-slate-600">Şu anda aktif çekiliş bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {raffles.map((raffle) => (
              <Link
                key={raffle.id}
                to={`/raffle/${raffle.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg hover:border-emerald-300 transition-all duration-300"
              >
                <div className="aspect-video bg-gradient-to-br from-emerald-100 to-teal-100 relative overflow-hidden">
                  {raffle.prize_image_url ? (
                    <img
                      src={raffle.prize_image_url}
                      alt={raffle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Ticket className="w-16 h-16 text-emerald-600" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-emerald-600">
                    {raffle.ticket_price.toFixed(2)} ₺
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {raffle.title}
                  </h4>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{raffle.description}</p>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <div>
                      <span className="text-slate-500">Satılan Bilet</span>
                      <p className="font-semibold text-slate-900">
                        {raffle.tickets_sold} / {raffle.max_tickets}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500">Kalan Süre</span>
                      <p className="font-semibold text-slate-900">{getTimeRemaining(raffle.end_date)}</p>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(raffle.tickets_sold / raffle.max_tickets) * 100}%`,
                      }}
                    ></div>
                  </div>

                  <button className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
                    Bilet Al
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
