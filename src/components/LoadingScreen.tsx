import { useEffect, useState } from "react";
import logoBv from "@/assets/logobv.png";

/** Branded first-load screen with a smooth fade-out. */
export function LoadingScreen() {
  const [hidden, setHidden] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setHidden(true), 1400);
    const t2 = window.setTimeout(() => setGone(true), 2000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-100 grid place-items-center bg-paper transition-opacity duration-500 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative grid place-items-center">
        <span className="pointer-events-none absolute size-52 rounded-full bg-leaf/15 blur-2xl" />
        <span className="pointer-events-none absolute size-40 translate-x-8 rounded-full bg-amber/15 blur-2xl" />
        <div className="relative grid justify-items-center text-center">
          <img
            src={logoBv}
            alt=""
            width={160}
            height={160}
            className="size-24 animate-[scale-in_0.5s_ease-out] sm:size-28"
          />
          <span className="mt-4 font-display text-2xl font-bold tracking-tight">
            kapematt ltd
          </span>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            best value
          </p>
        </div>
      </div>
    </div>
  );
}
