import { apply, setAttr, remove } from '@directus/visual-editing';

let isApplied = false;

export async function initializeVisualEditor() {
  if (typeof window !== 'undefined' && !isApplied) {
    try {
      await apply({
        directusUrl: process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost/backend',
        onSaved: async (data) => {
          console.log('✅ Content saved:', data);
          window.location.reload();
        },
      });
      console.log("🎨 Directus Visual Editor initialized");
      isApplied = true;
    } catch (error) {
      console.error('❌ Failed to initialize visual editor:', error);
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