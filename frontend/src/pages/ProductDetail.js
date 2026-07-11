import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiArrowLeft, FiClock, FiTag } from 'react-icons/fi';
import { productService } from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getById(id)
      .then(setProduct)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded" />
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-lg">Product not found.</p>
        <Link to="/products" className="text-emerald-600 hover:underline mt-2 inline-block">Back to products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center space-x-1 text-gray-500 hover:text-emerald-600 mb-6">
        <FiArrowLeft /><span>Back to products</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-64 md:h-80 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
          <FiShoppingCart className="text-8xl text-emerald-400" />
        </div>
        <div className="p-8">
          <span className="inline-flex items-center space-x-1 text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
            <FiTag /><span>{product.category}</span>
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">{product.name}</h1>
          {product.nameRw && <p className="text-lg text-gray-500 italic mt-1">{product.nameRw}</p>}
          <p className="text-4xl font-extrabold text-emerald-700 mt-6">{product.price.toLocaleString()} RWF</p>
          
          <div className="mt-8">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {product.descriptionRw && (
            <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <h3 className="font-semibold text-emerald-800 mb-2">Description in Kinyarwanda</h3>
              <p className="text-emerald-700">{product.descriptionRw}</p>
            </div>
          )}

          <div className="mt-8 flex items-center space-x-2 text-sm text-gray-500">
            <FiClock />
            <span>Added {new Date(product.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="mt-8 flex items-center space-x-4">
            <span className="text-sm text-gray-500">Stock: <span className="font-semibold text-gray-900">{product.stock}</span></span>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition shadow-lg flex items-center space-x-2">
              <FiShoppingCart /><span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
