import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { productService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const page = parseInt(searchParams.get('page')) || 1;
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    productService.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (category) params.category = category;
    if (search) params.search = search;
    productService.getAll(params)
      .then((d) => {
        setProducts(d.products);
        setPagination(d.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, category, search]);

  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('products.title')}</h1>
          <p className="text-gray-500 mt-1">{pagination.total} {t('products.productsAvailable')}</p>
        </div>
        <div className="flex gap-3">
          <div className="products-search">
            <span className="products-search-icon"><FiSearch size={18} /></span>
            <input
              type="text"
              placeholder={t('products.search')}
              value={search}
              onChange={(e) => updateParams({ search: e.target.value, page: '' })}
              className="products-search-input"
            />
            {search && (
              <button
                onClick={() => updateParams({ search: '', page: '' })}
                className="products-search-clear"
                title={t('products.clearFilters')}
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => updateParams({ category: '', page: '' })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition border ${!category ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
          >
            {t('products.all')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParams({ category: cat === category ? '' : cat, page: '' })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition border ${category === cat ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse border border-gray-100">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-5 bg-gray-200 rounded w-40" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-md border border-gray-100">
          <p className="text-gray-600 text-lg">{t('products.noProducts')}</p>
          <Link to="/products" className="text-emerald-600 hover:text-emerald-700 hover:underline mt-2 inline-block font-medium">{t('products.clearFilters')}</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            disabled={page <= 1}
            onClick={() => updateParams({ page: String(page - 1) })}
            className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <FiChevronLeft />
          </button>
          {[...Array(pagination.pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => updateParams({ page: String(i + 1) })}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition ${page === i + 1 ? 'bg-emerald-600 text-white' : 'border hover:bg-gray-50'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page >= pagination.pages}
            onClick={() => updateParams({ page: String(page + 1) })}
            className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
