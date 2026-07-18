import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { orderService } from '../services/api';
import { FiPackage, FiClock, FiCreditCard, FiArrowRight } from 'react-icons/fi';

const STATUS_STYLES = {
  PAID: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    orderService
      .getMyOrders()
      .then((d) => setOrders(d.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-600">{t('profile.notLoggedIn')}</p>
        <Link to="/login" className="text-emerald-600 hover:text-emerald-700 hover:underline mt-2 inline-block font-medium">{t('auth.signIn')}</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <FiPackage className="text-gray-300 mx-auto mb-6" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('orders.empty')}</h2>
          <p className="text-gray-500 mb-6">{t('orders.emptyDesc')}</p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-xl transition shadow-lg"
          >
            <FiArrowRight /><span>{t('cart.browseProducts')}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('orders.title')}</h1>
        <p className="text-gray-500 mt-1">{t('orders.subtitle')}</p>
      </div>

      <div className="space-y-5">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FiClock />
                <span>
                  {t('orders.placedOn')} {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'}`}>
                {order.status === 'CANCELLED' ? t('orders.cancelled') : t('orders.paid')}
              </span>
            </div>

            <div className="p-6 space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <FiPackage className="text-gray-400" size={16} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.quantity} &times; {item.price.toLocaleString()} RWF</p>
                  </div>
                  <p className="font-medium text-gray-900">{(item.price * item.quantity).toLocaleString()} RWF</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FiCreditCard />
                <span>{t('orders.paymentMethod')}: <span className="font-medium">{t(`checkout.${order.paymentMethod}`)}</span></span>
              </div>
              <p className="font-bold text-lg text-emerald-700">{t('orders.total')}: {order.total.toLocaleString()} RWF</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
