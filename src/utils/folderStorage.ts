const DB_NAME = "dieta-app-fs";
const STORE_NAME = "handles";
const HANDLE_KEY = "patientsFolder";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveFolderHandle(handle: FileSystemDirectoryHandle): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(handle, HANDLE_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadFolderHandle(): Promise<FileSystemDirectoryHandle | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(HANDLE_KEY);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Verifica il permesso sulla cartella.
 * interactive=false: solo controllo silenzioso (usato all'avvio, senza gesture utente).
 * interactive=true: se non concesso, lo richiede esplicitamente (richiede un click dell'utente).
 */
export async function verifyPermission(
  handle: FileSystemDirectoryHandle,
  forWrite = true,
  interactive = true
): Promise<boolean> {
  const opts: FileSystemPermissionDescriptor = forWrite ? { mode: "readwrite" } : {};
  const current = await handle.queryPermission(opts);
  if (current === "granted") return true;
  if (!interactive) return false;
  const requested = await handle.requestPermission(opts);
  return requested === "granted";
}
