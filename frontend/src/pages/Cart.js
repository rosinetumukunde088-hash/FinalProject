import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <FiShoppingCart className="text-6xl text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('cart.empty')}</h2>
          <p className="text-gray-500 mb-6">{t('cart.emptyDesc')}</p>
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('cart.title')}</h1>
          <p className="text-gray-500 mt-1">{items.length} {items.length === 1 ? t('cart.itemInCart') : t('cart.itemsInCart')}</p>
        </div>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center space-x-1 transition-colors"
        >
          <FiTrash2 /><span>{t('cart.clearCart')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4 border border-gray-100">
              <div className="flex-shrink-0 w-full md:w-24 h-24 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-lg flex items-center justify-center">
                <FiShoppingCart className="text-3xl text-emerald-300" />
              </div>

              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.id}`} className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors line-clamp-1">
                  {item.name}
                </Link>
                {item.nameRw && (
                  <p className="text-sm text-gray-500 italic">{item.nameRw}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">{item.category}</p>
              </div>

              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-3 py-2 hover:bg-gray-100 transition border-r border-gray-300"
                >
                  <FiMinus size={14} />
                </button>
                <span className="px-4 py-2 font-semibold text-gray-900 min-w-[3rem] text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, Math.min((item.stock || 99), item.quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition border-l border-gray-300"
                  disabled={item.quantity >= (item.stock || 99)}
                >
                  <FiPlus size={14} />
                </button>
              </div>

              <div className="flex items-center justify-between md:flex-col md:items-end gap-2 flex-shrink-0">
                <p className="text-lg font-bold text-emerald-700">
                  {(item.price * item.quantity).toLocaleString()} <span className="text-sm font-medium text-gray-500">RWF</span>
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                  title="Remove item"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('cart.orderSummary')}</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('cart.subtotal')} ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-medium text-gray-900">{totalPrice.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('cart.shipping')}</span>
                <span className="font-medium text-emerald-600">{t('cart.free')}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">{t('cart.total')}</span>
                <span className="font-bold text-xl text-emerald-700">{totalPrice.toLocaleString()} RWF</span>
              </div>
            </div>

            {user ? (
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition shadow-lg">
                {t('cart.proceedCheckout')}
              </button>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition shadow-lg text-center"
                >
                  {t('cart.signInToCheckout')}
                </Link>
                <p className="text-xs text-gray-500 text-center">{t('cart.signInDesc')}</p>
              </div>
            )}

            <Link
              to="/products"
              className="mt-4 w-full flex items-center justify-center space-x-1 text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors py-2"
            >
              <FiArrowLeft /><span>{t('cart.continueShopping')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
