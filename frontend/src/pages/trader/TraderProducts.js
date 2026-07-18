import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiChevronDown } from 'react-icons/fi';

const emptyProduct = {
  name: '', nameRw: '', nameSw: '',
  description: '', descriptionRw: '', descriptionSw: '',
  price: '', category: '', stock: '', images: [],
};

export default function TraderProducts() {
  const { API } = useAuth();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const fetchProducts = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = { page, limit: 10 };
        if (search) params.search = search;
        if (categoryFilter) params.category = categoryFilter;
        const { data } = await API.get('/products/mine', { params });
        setProducts(data.products || []);
        setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    },
    [API, search, categoryFilter]
  );

  const fetchCategoryOptions = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategoryOptions(data);
    } catch (err) {
      console.error('Failed to fetch category options', err);
    }
  };

  useEffect(() => {
    fetchProducts(1);
    fetchCategoryOptions();
  }, [fetchProducts]);

  const openCreate = () => {
    setEditingProduct(null);
    setForm(emptyProduct);
    setUploadError('');
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || '',
      nameRw: product.nameRw || '',
      nameSw: product.nameSw || '',
      description: product.description || '',
      descriptionRw: product.descriptionRw || '',
      descriptionSw: product.descriptionSw || '',
      price: product.price || '',
      category: product.category || '',
      stock: product.stock ?? '',
      images: product.images?.length ? product.images : (product.imageUrl ? [product.imageUrl] : []),
    });
    setUploadError('');
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setUploadError('');
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await API.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadedUrls.push(data.url);
      }
      setForm((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price) || 0,
        stock: parseInt(form.stock) || 0,
        imageUrl: form.images[0] || '',
      };
      if (editingProduct) {
        await API.put(`/products/${editingProduct.id}`, payload);
      } else {
        await API.post('/products', payload);
      }
      setShowModal(false);
      fetchProducts(pagination.page);
    } catch (err) {
      console.error('Failed to save product', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${productId}`);
      fetchProducts(pagination.page);
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-500 mt-1">Upload and manage the products you sell</p>
        </div>
        <button onClick={openCreate} className="admin-btn admin-btn-primary">
          <FiPlus />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="flex  sm:flex-row gap-3">
            <div className="flex-1 admin-input-icon-wrap">
              <span className="admin-input-icon"><FiSearch size={16} /></span>
              <input
                type="text"
                placeholder="Search my products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchProducts(1)}
                className="admin-input"
              />
            </div>
            <div className="admin-select-wrap">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="admin-select"
              >
                <option value="">All Categories</option>
                {categoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <span className="admin-select-arrow"><FiChevronDown size={14} /></span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            You haven't added any products yet. Click "Add Product" to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Product</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Stock</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        {(p.images?.[0] || p.imageUrl) ? (
                          <img src={p.images?.[0] || p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FiImage className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{p.name}</div>
                          {p.nameRw && <div className="text-xs text-gray-400">{p.nameRw}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{p.price.toLocaleString()} RWF</td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${p.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => openEdit(p)} className="admin-icon-btn edit">
                          <FiEdit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="admin-icon-btn danger">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchProducts(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="admin-btn admin-btn-outline"
              >
                Previous
              </button>
              <button
                onClick={() => fetchProducts(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="admin-btn admin-btn-outline"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card wide">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name (EN)</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="admin-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name (RW)</label>
                  <input
                    type="text"
                    value={form.nameRw}
                    onChange={(e) => setForm({ ...form, nameRw: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name (SW)</label>
                  <input
                    type="text"
                    value={form.nameSw}
                    onChange={(e) => setForm({ ...form, nameSw: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <div className="admin-select-wrap w-full">
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="admin-select"
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      {form.category && !categoryOptions.some((c) => c.name === form.category) && (
                        <option value={form.category}>{form.category}</option>
                      )}
                      {categoryOptions.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                    <span className="admin-select-arrow"><FiChevronDown size={14} /></span>
                  </div>
                  {categoryOptions.length === 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      No categories yet — ask an admin to add one first.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="admin-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="admin-input"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-3">
                    {form.images.map((url, index) => (
                      <div key={index} className="relative w-16 h-16 flex-shrink-0">
                        <img src={url} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="admin-input"
                />
                {uploading && <p className="text-xs text-gray-400 mt-1">Uploading...</p>}
                {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (RW)</label>
                <textarea
                  value={form.descriptionRw}
                  onChange={(e) => setForm({ ...form, descriptionRw: e.target.value })}
                  rows={3}
                  className="admin-input"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="admin-btn admin-btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="admin-btn admin-btn-primary"
                >
                  {saving ? 'Saving...' : (editingProduct ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
