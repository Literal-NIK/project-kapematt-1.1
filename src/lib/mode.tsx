import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type BrowseMode = "retail" | "wholesale";

type ModeContextValue = {
  mode: BrowseMode;
  setMode: (mode: BrowseMode) => void;
  /** Wholesale suppresses every price in the UI layer. */
  pricesVisible: boolean;
};

const ModeContext = createContext<ModeContextValue>({
  mode: "retail",
  setMode: () => {},
  pricesVisible: true,
});

const STORAGE_KEY = "kapematt.mode";

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<BrowseMode>("retail");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "retail" || stored === "wholesale") setModeState(stored);
  }, []);

  const setMode = useCallback((next: BrowseMode) => {
    setModeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo(
    () => ({ mode, setMode, pricesVisible: mode === "retail" }),
    [mode, setMode],
  );

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export const useMode = () => useContext(ModeContext);
