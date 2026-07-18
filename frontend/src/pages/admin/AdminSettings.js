import { FiCheck } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminSettings() {
  const { lang, switchLang, languages, t } = useLanguage();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.settings')}</h1>
        <p className="text-gray-500 mt-1">{t('admin.settingsDesc')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-xl">
        <h2 className="font-semibold text-gray-900">{t('admin.language')}</h2>
        <p className="text-sm text-gray-500 mt-1 mb-4">{t('admin.languageDesc')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => switchLang(l.code)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border transition ${
                l.code === lang
                  ? 'border-purple-300 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>{l.flag}</span>
                <span className="font-medium">{l.label}</span>
              </span>
              {l.code === lang && <FiCheck size={16} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
