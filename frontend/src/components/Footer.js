import { FiShield, FiRefreshCw, FiTruck, FiHeadphones } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">KiKUU Rwanda</h3>
            <p className="text-sm leading-relaxed">
              AI-Assisted e-commerce platform tailored for Rwandan users, with Kinyarwanda language support and adaptive UI.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-emerald-400 transition">Home</a></li>
              <li><a href="/products" className="hover:text-emerald-400 transition">Products</a></li>
              <li><a href="/about" className="hover:text-emerald-400 transition">About Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2"><FiShield className="text-emerald-400" /><span>Secure Payments</span></li>
              <li className="flex items-center space-x-2"><FiTruck className="text-emerald-400" /><span>Delivery Across Rwanda</span></li>
              <li className="flex items-center space-x-2"><FiRefreshCw className="text-emerald-400" /><span>Easy Returns</span></li>
              <li className="flex items-center space-x-2"><FiHeadphones className="text-emerald-400" /><span>Kinyarwanda Support</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <p className="text-sm">Kigali, Rwanda</p>
            <p className="text-sm">info@kikuu.rw</p>
            <p className="text-sm">+250 788 000 000</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 KiKUU Rwanda. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
