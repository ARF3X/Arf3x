import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRaffle, usePurchaseTicket } from '../hooks/useRaffles';
import { useAuth } from '../contexts/AuthContext';
import { Ticket, Clock, Users, TrendingUp, ArrowLeft } from 'lucide-react';

export const RafflePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: raffle, isLoading } = useRaffle(id!);
  const { user } = useAuth();
  const purchaseTicket = usePurchaseTicket();
  const [ticketCount, setTicketCount] = useState(1);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const generateTicketNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `TT-${year}-${random}`;
  };

  const handlePurchase = async () => {
    if (!user || !raffle) return;

    setPurchasing(true);
    try {
      for (let i = 0; i < ticketCount; i++) {
        await purchaseTicket.mutateAsync({
          raffleId: raffle.id,
          userId: user.id,
          ticketPrice: raffle.ticket_price,
          ticketNumber: generateTicketNumber(),
        });
      }
      setShowPurchaseModal(false);
      navigate('/my-tickets');
    } catch (error: any) {
      alert('Bilet alımı başarısız: ' + error.message);
    } finally {
      setPurchasing(false);
    }
  };

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    if (diff <= 0) return { text: 'Bitti', expired: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return { text: `${days} gün ${hours} saat`, expired: false };
    if (hours > 0) return { text: `${hours} saat ${minutes} dakika`, expired: false };
    return { text: `${minutes} dakika`, expired: false };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!raffle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Çekiliş bulunamadı</h2>
          <Link to="/" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    );
  }

  const timeRemaining = getTimeRemaining(raffle.end_date);
  const totalPrice = raffle.ticket_price * ticketCount;

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 mb-6">
              <div className="aspect-video bg-gradient-to-br from-emerald-100 to-teal-100 relative">
                {raffle.prize_image_url ? (
                  <img
                    src={raffle.prize_image_url}
                    alt={raffle.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Ticket className="w-24 h-24 text-emerald-600" />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Çekiliş Detayları</h2>
              <p className="text-slate-600 leading-relaxed">{raffle.description}</p>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm">Ödül Değeri</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {raffle.prize_value.toLocaleString('tr-TR')} ₺
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <Ticket className="w-5 h-5" />
                    <span className="text-sm">Bilet Fiyatı</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{raffle.ticket_price.toFixed(2)} ₺</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
              <h1 className="text-3xl font-bold text-slate-900 mb-6">{raffle.title}</h1>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-emerald-600" />
                    <div>
                      <p className="text-sm text-slate-600">Kalan Süre</p>
                      <p className={`font-bold ${timeRemaining.expired ? 'text-red-600' : 'text-slate-900'}`}>
                        {timeRemaining.text}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-600">Satılan / Toplam Bilet</p>
                      <p className="font-bold text-slate-900">
                        {raffle.tickets_sold} / {raffle.max_tickets}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">İlerleme</span>
                  <span className="text-sm font-semibold text-slate-900">
                    %{((raffle.tickets_sold / raffle.max_tickets) * 100).toFixed(0)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${(raffle.tickets_sold / raffle.max_tickets) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {!user ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                  <p className="text-yellow-800 text-sm">
                    Bilet almak için{' '}
                    <Link to="/login" className="font-semibold underline">
                      giriş yapmalısınız
                    </Link>
                  </p>
                </div>
              ) : null}

              <button
                onClick={() => setShowPurchaseModal(true)}
                disabled={!user || timeRemaining.expired}
                className="w-full py-4 bg-emerald-600 text-white font-bold text-lg rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {timeRemaining.expired ? 'Çekiliş Sona Erdi' : 'Bilet Al'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Bilet Satın Al</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kaç bilet almak istiyorsunuz?
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={ticketCount}
                onChange={(e) => setTicketCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">Maksimum 10 bilet alabilirsiniz</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600">Bilet Fiyatı</span>
                <span className="font-semibold text-slate-900">{raffle.ticket_price.toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600">Adet</span>
                <span className="font-semibold text-slate-900">{ticketCount}</span>
              </div>
              <div className="border-t border-slate-300 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-900">Toplam</span>
                  <span className="text-2xl font-bold text-emerald-600">{totalPrice.toFixed(2)} ₺</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPurchaseModal(false)}
                disabled={purchasing}
                className="flex-1 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-slate-400"
              >
                {purchasing ? 'İşleniyor...' : 'Satın Al'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
