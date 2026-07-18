import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { t, lang } = useLanguage();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const image = product.images?.[0] || product.imageUrl;
  const displayName =
    (lang === 'rw' && product.nameRw) ||
    (lang === 'sw' && product.nameSw) ||
    product.name;

  return (
    <Link to={`/products/${product.id}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group relative" style={{animation:'fadeIn 0.3s ease-out'}}>
      <div className="h-48 relative overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`${image ? 'hidden' : 'flex'} w-full h-full bg-gradient-to-br from-emerald-50 to-teal-100 items-center justify-center`}>
          <span className="text-4xl text-emerald-300">📦</span>
        </div>
      </div>
      <div className="px-4 pb-4 pt-2">
        <span className="inline-block text-xs font-semibold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
          {product.category}
        </span>
        <h3 className="mt-2 font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
          {displayName}
        </h3>
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-lg font-bold text-emerald-700">
            {product.price.toLocaleString()} <span className="text-sm font-medium text-gray-500">RWF</span>
          </span>
          <button onClick={handleAdd} className="product-card-add-btn" title={t('product.addToCart')}>
            <FiPlus size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
