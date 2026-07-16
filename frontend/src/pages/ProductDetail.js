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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="pd-grid animate-pulse">
          <div className="pd-skeleton-line" style={{ height: 320, borderRadius: '1rem' }} />
          <div className="space-y-4">
            <div className="pd-skeleton-line" style={{ height: 24, width: '30%' }} />
            <div className="pd-skeleton-line" style={{ height: 36, width: '75%' }} />
            <div className="pd-skeleton-line" style={{ height: 28, width: '40%' }} />
            <div className="pd-skeleton-line" style={{ height: 100, width: '100%' }} />
          </div>
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center space-x-1 text-gray-600 hover:text-emerald-600 mb-6 font-medium transition-colors">
        <FiArrowLeft /><span>{t('product.backToProducts')}</span>
      </Link>

      <div className="pd-grid">
        <div className="pd-gallery">
          <ImageCarousel images={product.images || []} name={product.name} />
        </div>

        <div className="pd-info">
          <div>
            <span className="pd-badge">
              <FiTag size={14} /><span>{product.category}</span>
            </span>
            <h1 className="pd-title" style={{ marginTop: '1rem' }}>{getLocalizedName(product)}</h1>
            {product.nameRw && lang !== 'rw' && <p className="pd-alt-name">{product.nameRw}</p>}
          </div>

          <div className="pd-price-row">
            <span className="pd-price">{product.price.toLocaleString()}</span>
            <span className="pd-price-currency">RWF</span>
          </div>

          <div className="pd-section">
            <h3 className="pd-section-title">{t('product.description')}</h3>
            <p className="pd-section-text">{getLocalizedDescription(product)}</p>
          </div>

          {lang !== 'rw' && product.descriptionRw && (
            <div className="pd-translation-card">
              <h3 className="pd-translation-title">{t('product.descriptionRw')}</h3>
              <p className="pd-translation-text">{product.descriptionRw}</p>
            </div>
          )}

          <div className="pd-meta">
            <FiClock />
            <span>{t('product.added')} {new Date(product.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="pd-buybox">
            <p className="pd-stock-row">
              {t('product.stock')}: <span className={`pd-stock-value ${product.stock <= 0 ? 'pd-stock-out' : ''}`}>{product.stock > 0 ? product.stock : t('product.outOfStock')}</span>
            </p>

            <div className="pd-qty-row">
              <span className="pd-qty-label">{t('product.quantity')}:</span>
              <div className="pd-qty-stepper">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <FiMinus size={14} />
                </button>
                <span className="pd-qty-value">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  disabled={quantity >= (product.stock || 99)}
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>

            <div className="pd-actions">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`pd-btn pd-btn-primary ${added ? 'added' : ''}`}
              >
                {added ? <><FiCheck /><span>{t('product.addedExcl')}</span></> : <><FiShoppingCart /><span>{t('product.addToCart')}</span></>}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="pd-btn pd-btn-secondary"
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
