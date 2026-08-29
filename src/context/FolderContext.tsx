import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { loadFolderHandle, saveFolderHandle, verifyPermission } from "../utils/folderStorage";

type FolderContextValue = {
  folderHandle: FileSystemDirectoryHandle | null;
  folderName: string | null;
  supported: boolean;
  pickFolder: () => Promise<void>;
};

const FolderContext = createContext<FolderContextValue | null>(null);

export function FolderProvider({ children }: { children: ReactNode }) {
  const [folderHandle, setFolderHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const supported = typeof window !== "undefined" && !!window.showDirectoryPicker;

  // All'avvio, prova a recuperare la cartella salvata in precedenza (solo controllo silenzioso)
  useEffect(() => {
    if (!supported) return;
    (async () => {
      const saved = await loadFolderHandle();
      if (saved) {
        const granted = await verifyPermission(saved, true, false);
        if (granted) setFolderHandle(saved);
      }
    })();
  }, [supported]);

  const pickFolder = async () => {
    if (!supported || !window.showDirectoryPicker) return;
    const handle = await window.showDirectoryPicker({ mode: "readwrite" });
    const ok = await verifyPermission(handle, true, true);
    if (ok) {
      setFolderHandle(handle);
      await saveFolderHandle(handle);
    }
  };

  return (
    <FolderContext.Provider
      value={{ folderHandle, folderName: folderHandle?.name ?? null, supported, pickFolder }}
    >
      {children}
    </FolderContext.Provider>
  );
}

export function useFolder() {
  const ctx = useContext(FolderContext);
  if (!ctx) throw new Error("useFolder must be used within FolderProvider");
  return ctx;
}
