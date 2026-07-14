import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiArrowLeft, FiClock, FiTag, FiCheck, FiPlus, FiMinus } from 'react-icons/fi';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import ImageCarousel from '../components/ImageCarousel';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { t, lang } = useLanguage();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    productService.getById(id)
      .then(setProduct)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem(product, quantity);
    navigate('/cart');
  };

  const getLocalizedName = (p) => {
    if (lang === 'rw' && p.nameRw) return p.nameRw;
    if (lang === 'sw' && p.nameSw) return p.nameSw;
    return p.name;
  };

  const getLocalizedDescription = (p) => {
    if (lang === 'rw' && p.descriptionRw) return p.descriptionRw;
    if (lang === 'sw' && p.descriptionSw) return p.descriptionSw;
    return p.description;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded-xl" />
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-600 text-lg">Product not found.</p>
        <Link to="/products" className="text-emerald-600 hover:text-emerald-700 hover:underline mt-2 inline-block font-medium">{t('product.backToProducts')}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center space-x-1 text-gray-600 hover:text-emerald-600 mb-6 font-medium transition-colors">
        <FiArrowLeft /><span>{t('product.backToProducts')}</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-64 md:h-80 relative">
          <ImageCarousel images={product.images || []} name={product.name} />
        </div>
        <div className="p-8">
          <span className="inline-flex items-center space-x-1 text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
            <FiTag /><span>{product.category}</span>
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">{getLocalizedName(product)}</h1>
          {product.nameRw && lang !== 'rw' && <p className="text-lg text-gray-500 italic mt-1">{product.nameRw}</p>}
          <p className="text-4xl font-extrabold text-emerald-700 mt-6">{product.price.toLocaleString()} <span className="text-lg font-medium text-gray-500">RWF</span></p>
          
          <div className="mt-8">
            <h3 className="font-semibold text-gray-900 mb-2">{t('product.description')}</h3>
            <p className="text-gray-600 leading-relaxed">{getLocalizedDescription(product)}</p>
          </div>

          {lang !== 'rw' && product.descriptionRw && (
            <div className="mt-6 p-5 bg-emerald-50 rounded-xl border border-emerald-200">
              <h3 className="font-semibold text-emerald-800 mb-2">{t('product.descriptionRw')}</h3>
              <p className="text-emerald-700 leading-relaxed">{product.descriptionRw}</p>
            </div>
          )}

          <div className="mt-8 flex items-center space-x-2 text-sm text-gray-600">
            <FiClock />
            <span>{t('product.added')} {new Date(product.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <span>{t('product.stock')}: <span className={`font-semibold ${product.stock > 0 ? 'text-gray-900' : 'text-red-600'}`}>{product.stock > 0 ? product.stock : t('product.outOfStock')}</span></span>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-sm font-medium text-gray-700">{t('product.quantity')}:</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition border-r border-gray-300"
                  disabled={quantity <= 1}
                >
                  <FiMinus size={14} />
                </button>
                <span className="px-4 py-2 font-semibold text-gray-900 min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition border-l border-gray-300"
                  disabled={quantity >= (product.stock || 99)}
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`px-8 py-3 rounded-xl font-semibold transition shadow-lg flex items-center space-x-2 ${
                  added
                    ? 'bg-emerald-500 text-white'
                    : product.stock > 0
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {added ? <><FiCheck /><span>{t('product.addedExcl')}</span></> : <><FiShoppingCart /><span>{t('product.addToCart')}</span></>}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="px-8 py-3 rounded-xl font-semibold transition bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg"
              >
                {t('product.buyNow')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
