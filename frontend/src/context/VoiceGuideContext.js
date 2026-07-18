import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import translations from './translations';

const VoiceGuideContext = createContext(null);

const VOICE_STORAGE_KEY = 'kiramart_voice_guide';

const LANG_TO_SPEECH_CODE = {
  en: 'en-US',
  rw: 'rw-RW',
  sw: 'sw-KE',
};

function getSystemGuide(lang) {
  return translations[lang]?.voice?.systemGuide || translations.en.voice.systemGuide;
}

function loadEnabled() {
  try {
    return localStorage.getItem(VOICE_STORAGE_KEY) === 'on';
  } catch {
    return false;
  }
}

function pickVoice(voices, targetLang) {
  if (!voices || !voices.length) return null;
  const exact = voices.find((v) => v.lang === targetLang);
  if (exact) return exact;
  const prefix = targetLang.split('-')[0];
  const partial = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(prefix));
  if (partial) return partial;
  return voices.find((v) => v.default) || voices[0];
}

export function VoiceGuideProvider({ children }) {
  const { lang } = useLanguage();
  const [enabled, setEnabled] = useState(loadEnabled);
  const voicesRef = useRef([]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speakText = useCallback((text, langCode) => {
    if (!text || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    const targetLang = langCode || LANG_TO_SPEECH_CODE[lang] || 'en-US';

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang;
    utterance.rate = 0.95;
    utterance.pitch = 1;

    const voices = voicesRef.current.length ? voicesRef.current : synth.getVoices();
    const voice = pickVoice(voices, targetLang);
    if (voice) utterance.voice = voice;

    if (synth.speaking || synth.pending) {
      synth.cancel();
      setTimeout(() => synth.speak(utterance), 80);
    } else {
      if (synth.paused) synth.resume();
      synth.speak(utterance);
    }
  }, [lang]);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(VOICE_STORAGE_KEY, next ? 'on' : 'off');
      } catch {
        // localStorage unavailable, continue without persisting
      }
      if (next) {
        speakText(getSystemGuide(lang));
      } else if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return next;
    });
  }, [lang, speakText]);

  const speak = useCallback((text) => {
    if (!enabled) return;
    speakText(text);
  }, [enabled, speakText]);

  const announce = useCallback((text) => {
    speakText(text);
  }, [speakText]);

  const playGuide = useCallback(() => {
    speakText(getSystemGuide(lang));
  }, [lang, speakText]);

  return (
    <VoiceGuideContext.Provider value={{ enabled, toggle, speak, announce, stop, playGuide }}>
      {children}
    </VoiceGuideContext.Provider>
  );
}

export const useVoiceGuide = () => useContext(VoiceGuideContext);
