import { Link } from 'react-router-dom';
import { FiShoppingCart, FiChevronRight } from 'react-icons/fi';

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
        <FiShoppingCart className="text-5xl text-emerald-400 group-hover:text-emerald-600 transition-colors" />
      </div>
      <div className="p-4">
        <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
          {product.category}
        </span>
        <h3 className="mt-2 font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
          {product.name}
        </h3>
        {product.nameRw && (
          <p className="text-sm text-gray-500 italic">{product.nameRw}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-emerald-700">
            {product.price.toLocaleString()} RWF
          </span>
          <span className="text-emerald-600 group-hover:translate-x-1 transition-transform">
            <FiChevronRight size={20} />
          </span>
        </div>
      </div>
    </Link>
  );
}
