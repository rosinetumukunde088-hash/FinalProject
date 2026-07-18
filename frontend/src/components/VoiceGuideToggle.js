import { FiVolume2, FiVolumeX, FiHelpCircle } from 'react-icons/fi';
import { useVoiceGuide } from '../context/VoiceGuideContext';
import { useLanguage } from '../context/LanguageContext';

export default function VoiceGuideToggle() {
  const { enabled, toggle, playGuide } = useVoiceGuide();
  const { t } = useLanguage();

  return (
    <>
      <button
        className="voice-guide-help"
        onClick={playGuide}
        title={t('voice.howToUse')}
      >
        <FiHelpCircle size={20} />
      </button>
      <button
        className={`voice-guide-toggle ${enabled ? 'active' : ''}`}
        onClick={toggle}
        title={enabled ? t('voice.disable') : t('voice.enable')}
      >
        {enabled ? <FiVolume2 size={20} /> : <FiVolumeX size={20} />}
      </button>
    </>
  );
}
