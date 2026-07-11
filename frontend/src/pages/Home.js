import { Link } from 'react-router-dom';
import { FiPackage, FiTrendingUp, FiUsers, FiGlobe, FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    productService.getAll({ limit: 8 }).then((d) => setProducts(d.products)).catch(() => {});
    productService.getCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Murakaza neza kuri <span className="text-emerald-200">Kiramart Rwanda</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 mb-8 leading-relaxed">
              AI-powered e-commerce platform with adaptive UI, Kinyarwanda language support, and personalized shopping experience for every Rwandan user.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="inline-flex items-center space-x-2 bg-white text-emerald-700 font-semibold px-8 py-4 rounded-xl hover:bg-emerald-50 transition shadow-lg">
                <FiShoppingCart /><span>Shop Now</span>
              </Link>
              <Link to="/register" className="inline-flex items-center space-x-2 bg-emerald-500/80 text-white font-semibold px-8 py-4 rounded-xl hover:bg-emerald-400 transition border border-emerald-400/30">
                <FiUsers /><span>Get Started</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-start space-x-4 border border-gray-100">
            <div className="bg-emerald-100 p-3 rounded-lg flex-shrink-0"><FiPackage className="text-2xl text-emerald-600" /></div>
            <div><h3 className="font-bold text-gray-900">20+ Products</h3><p className="text-sm text-gray-600 mt-1">From artisan crafts to electronics</p></div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-start space-x-4 border border-gray-100">
            <div className="bg-emerald-100 p-3 rounded-lg flex-shrink-0"><FiGlobe className="text-2xl text-emerald-600" /></div>
            <div><h3 className="font-bold text-gray-900">Kinyarwanda First</h3><p className="text-sm text-gray-600 mt-1">Full Kinyarwanda language support</p></div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-start space-x-4 border border-gray-100">
            <div className="bg-emerald-100 p-3 rounded-lg flex-shrink-0"><FiTrendingUp className="text-2xl text-emerald-600" /></div>
            <div><h3 className="font-bold text-gray-900">AI-Powered</h3><p className="text-sm text-gray-600 mt-1">Adaptive UI based on user behavior</p></div>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link key={cat} to={`/products?category=${cat}`} className="bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-full font-medium hover:bg-emerald-100 transition border border-emerald-100">
                {cat}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-emerald-600 hover:text-emerald-700 flex items-center space-x-1 font-medium transition-colors">
            <span>View All</span><FiArrowRight />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
