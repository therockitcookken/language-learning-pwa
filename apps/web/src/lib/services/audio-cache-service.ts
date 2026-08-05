/**
 * Audio Cache Service
 * Handles audio URL caching with strict versioning and checksum validation.
 * Auto-purges legacy audio caches when pronunciationAudioVersion bumps to 4.
 */

export const CURRENT_AUDIO_VERSION = 4;

class AudioCacheService {
  constructor() {
    if (typeof window !== 'undefined') {
      this.verifyVersionAndPurge();
    }
  }

  public verifyVersionAndPurge(): void {
    if (typeof window === 'undefined') return;

    const cachedVersion = localStorage.getItem('pronunciationAudioVersion');
    if (cachedVersion !== CURRENT_AUDIO_VERSION.toString()) {
      // 1. Purge old audio cache keys from localStorage
      Object.keys(localStorage).forEach((key) => {
        if (
          key.startsWith('audio_cache_') ||
          key.startsWith('pronunciation_v') ||
          key.startsWith('pronunciation_cache') ||
          key.includes('voice_cache')
        ) {
          localStorage.removeItem(key);
        }
      });

      // 2. Clear CacheStorage if supported
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            if (name.includes('audio') || name.includes('pronunciation')) {
              caches.delete(name);
            }
          });
        });
      }

      localStorage.setItem('pronunciationAudioVersion', CURRENT_AUDIO_VERSION.toString());
    }
  }

  public getCacheKey(
    language: string,
    accent: string,
    recordId: string,
    contentType: 'phoneme' | 'syllable' | 'word' | 'sentence',
    speed: number,
    textChecksum: string
  ): string {
    return `audio_cache_v${CURRENT_AUDIO_VERSION}_${language}_${accent}_${recordId}_${contentType}_${speed}_${textChecksum}`;
  }

  public getCachedAudioUrl(cacheKey: string): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(cacheKey);
  }

  public setCachedAudioUrl(cacheKey: string, url: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(cacheKey, url);
    } catch {
      // Quota exceeded
    }
  }
}

export const audioCacheService = new AudioCacheService();
