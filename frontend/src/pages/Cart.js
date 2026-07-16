import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const { t, lang } = useLanguage();

  const getDisplayName = (item) =>
    (lang === 'rw' && item.nameRw) || (lang === 'sw' && item.nameSw) || item.name;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <FiShoppingCart className="text-gray-300 mx-auto mb-6" size={64} />
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
      <div className="cart-header">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('cart.title')}</h1>
          <p className="text-gray-500 mt-1">{items.length} {items.length === 1 ? t('cart.itemInCart') : t('cart.itemsInCart')}</p>
        </div>
        <button onClick={clearCart} className="cart-header-clear">
          <FiTrash2 /><span>{t('cart.clearCart')}</span>
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-main">
                <Link to={`/products/${item.id}`} className="cart-item-thumb">
                  {(item.images?.[0] || item.imageUrl) ? (
                    <img
                      src={item.images?.[0] || item.imageUrl}
                      alt={getDisplayName(item)}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="cart-item-fallback" style={{ display: (item.images?.[0] || item.imageUrl) ? 'none' : 'flex' }}>
                    <span className="text-3xl text-emerald-300">📦</span>
                  </div>
                </Link>

                <div className="cart-item-info">
                  <Link to={`/products/${item.id}`} className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors line-clamp-1">
                    {getDisplayName(item)}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                </div>
              </div>

              <div className="cart-item-controls">
                <div className="cart-item-qty">
                  <div className="cart-item-qty-stepper">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      title={t('cart.decrease')}
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="cart-item-qty-value">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, Math.min((item.stock || 99), item.quantity + 1))}
                      disabled={item.quantity >= (item.stock || 99)}
                      title={t('cart.increase')}
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                  {item.stock > 0 && item.quantity >= item.stock && (
                    <span className="cart-item-max-stock">{t('cart.maxStock')}</span>
                  )}
                </div>

                <div className="cart-item-price-row">
                  <p className="cart-item-price">
                    {(item.price * item.quantity).toLocaleString()} <span className="text-sm font-medium text-gray-500">RWF</span>
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="cart-item-remove"
                    title="Remove item"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary-col">
          <div className="cart-summary-card">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <FiShoppingCart className="text-emerald-600" />
              <span>{t('cart.orderSummary')}</span>
            </h2>

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
