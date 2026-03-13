import { apply, setAttr, remove } from '@directus/visual-editing';

type UUIDString = `${string}-${string}-${string}-${string}-${string}`;

function createFallbackUUID(): UUIDString {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  }) as UUIDString;
}

// Polyfill dla crypto.randomUUID (starsze Safari / starszy Node)
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = {} as Crypto;
}

if (typeof globalThis.crypto.randomUUID !== 'function') {
  globalThis.crypto.randomUUID = createFallbackUUID;
}

let isApplied = false;

export async function initializeVisualEditor() {
  if (typeof window !== 'undefined' && !isApplied) {
    try {
      const currentOrigin = window.location.origin;
      const backendUrl =
        process.env.NEXT_PUBLIC_DIRECTUS_URL?.replace(/\/$/, '') ||
        `${currentOrigin}/backend`;

      await apply({
        directusUrl: backendUrl,
        onSaved: async (data) => {
          console.log('Content saved:', data);
          window.location.reload();
        },
      });

      console.log('Directus Visual Editor initialized');
      isApplied = true;
    } catch (error) {
      console.error('Failed to initialize visual editor:', error);
    }
  }
}

export function cleanupVisualEditor() {
  if (typeof window !== 'undefined' && isApplied) {
    remove();
    isApplied = false;
  }
}

export { setAttr };