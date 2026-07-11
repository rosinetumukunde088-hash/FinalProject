import { Link } from 'react-router-dom';
import { FiShoppingCart, FiChevronRight } from 'react-icons/fi';

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group" style={{animation:'fadeIn 0.3s ease-out'}}>
      <div className="h-48 bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/60 to-teal-100/40"></div>
        <FiShoppingCart className="text-5xl text-emerald-400 group-hover:text-emerald-600 transition-colors relative z-10" />
      </div>
      <div className="p-4">
        <span className="inline-block text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
          {product.category}
        </span>
        <h3 className="mt-2 font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
          {product.name}
        </h3>
        {product.nameRw && (
          <p className="text-sm text-gray-500 italic mt-0.5">{product.nameRw}</p>
        )}
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-lg font-bold text-emerald-700">
            {product.price.toLocaleString()} <span className="text-sm font-medium text-gray-500">RWF</span>
          </span>
          <span className="text-emerald-500 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all">
            <FiChevronRight size={20} />
          </span>
        </div>
      </div>
    </Link>
  );
}
