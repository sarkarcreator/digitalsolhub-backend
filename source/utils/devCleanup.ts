// Development-only cleanup helpers to reduce browser storage issues
const KB = 1024;
const DEFAULT_MAX_KEY_BYTES = 200 * KB;

function bytesOfString(str: string) {
  return new TextEncoder().encode(str).length;
}

export async function runDevCleanup() {
  if (import.meta.env.MODE === 'production') return;

  try {
    // Unregister service workers (if any)
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      if (regs && regs.length) {
        console.warn('DevCleanup: unregistering', regs.length, 'service worker(s)');
        await Promise.all(regs.map(r => r.unregister()));
      }
    }
  } catch (err) {
    // ignore
    // eslint-disable-next-line no-console
    console.warn('DevCleanup: service worker cleanup failed', err);
  }

  try {
    const maxKeyBytes = Number(import.meta.env.VITE_DEV_MAX_KEY_BYTES) || DEFAULT_MAX_KEY_BYTES;
    let total = 0;
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const val = String(localStorage.getItem(key));
      const b = bytesOfString(val);
      total += b;
      if (b > maxKeyBytes) toRemove.push(key);
    }

    if (toRemove.length) {
      // Remove oversized keys to avoid LevelDB / quota issues during dev
      // eslint-disable-next-line no-console
      console.warn('DevCleanup: removing oversized localStorage keys:', toRemove);
      toRemove.forEach(k => localStorage.removeItem(k));
    }

    // If total storage looks dangerously high, log instructions
    const totalKB = Math.round(total / KB);
    if (totalKB > 4000) {
      // eslint-disable-next-line no-console
      console.warn(`DevCleanup: localStorage total ~${totalKB}KB — consider clearing site data.`);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('DevCleanup: localStorage scan failed', err);
  }

  try {
    // Attempt a safe IndexedDB cleanup only when the experimental API is available.
    // This will only run in Chromium-based browsers that support indexedDB.databases().
    // We do not delete anything silently unless VITE_DEV_CLEAR_INDEXEDDB === 'true'.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof indexedDB !== 'undefined' && typeof indexedDB.databases === 'function') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const dbs = await indexedDB.databases();
      if (Array.isArray(dbs) && dbs.length) {
        const shouldClear = import.meta.env.VITE_DEV_CLEAR_INDEXEDDB === 'true';
        // eslint-disable-next-line no-console
        console.warn('DevCleanup: found IndexedDB databases:', dbs.map((d: any) => d.name));
        if (shouldClear) {
          await Promise.all(dbs.map((d: any) => d.name ? new Promise((res, rej) => {
            const req = indexedDB.deleteDatabase(d.name);
            req.onsuccess = () => res(null);
            req.onerror = () => rej(req.error);
            req.onblocked = () => res(null);
          }) : Promise.resolve(null)));
          // eslint-disable-next-line no-console
          console.warn('DevCleanup: deleted IndexedDB databases');
        }
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('DevCleanup: IndexedDB cleanup failed', err);
  }
}

export default runDevCleanup;
