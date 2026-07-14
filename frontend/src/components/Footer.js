import { FiShield, FiRefreshCw, FiTruck, FiHeadphones } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Kiramart Rwanda</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              {t('footer.companyDesc')}
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-emerald-400 transition">{t('nav.home')}</a></li>
              <li><a href="/products" className="hover:text-emerald-400 transition">{t('nav.products')}</a></li>
              <li><a href="/cart" className="hover:text-emerald-400 transition">{t('nav.cart')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.features')}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2"><FiShield className="text-emerald-400" /><span>{t('footer.securePayments')}</span></li>
              <li className="flex items-center space-x-2"><FiTruck className="text-emerald-400" /><span>{t('footer.deliveryRwanda')}</span></li>
              <li className="flex items-center space-x-2"><FiRefreshCw className="text-emerald-400" /><span>{t('footer.easyReturns')}</span></li>
              <li className="flex items-center space-x-2"><FiHeadphones className="text-emerald-400" /><span>{t('footer.kinyarwandaSupport')}</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.contact')}</h4>
            <p className="text-sm text-gray-400">Kigali, Rwanda</p>
            <p className="text-sm text-gray-400">info@kiramart.rw</p>
            <p className="text-sm text-gray-400">+250 788 000 000</p>
          </div>
        </div>
        <div className="border-t border-gray-700/50 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2026 Kiramart Rwanda. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
