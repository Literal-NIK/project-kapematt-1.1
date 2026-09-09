import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { DEPARTMENTS } from "@/data/catalog";
import { useMode } from "@/lib/mode";
import { suggest, type Suggestion } from "@/lib/search-suggest";
import { Moon, Sun } from "lucide-react";
import heroLogo from "@/assets/herologo.png";

const RETAIL_LINKS = [
  { to: "/catalog", label: "Catalog" },
  { to: "/offers", label: "Offers" },
  { to: "/deli", label: "Deli" },
  { to: "/bakery", label: "Bakery" },
  { to: "/bakery", label: "Cake inquiry", hash: "cake-inquiry" },
  { to: "/notifications", label: "Notifications" },
  { to: "/store", label: "Find us" },
] as const;

const WHOLESALE_LINKS = [
  { to: "/wholesale", label: "Overview" },
  { to: "/wholesale/catalog", label: "Catalog" },
  { to: "/wholesale/offers", label: "Bulk terms" },
  { to: "/store", label: "Find us" },
] as const;

export function SiteHeader() {
  const { mode, setMode } = useMode();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("kapematt.theme");
    const next = stored === "dark";
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const links = mode === "wholesale" ? WHOLESALE_LINKS : RETAIL_LINKS;

  const suggestions = useMemo(() => suggest(query), [query]);
  const showSuggestions = focused && suggestions.length > 0;

  const runSearch = (q?: string) => {
    const value = (q ?? query) || undefined;
    setFocused(false);
    if (mode === "wholesale") {
      navigate({ to: "/wholesale/catalog", search: { q: value } });
    } else {
      navigate({ to: "/catalog", search: { q: value } });
    }
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch();
  };

  const pickSuggestion = (s: Suggestion) => {
    setFocused(false);
    setOpen(false);
    if (s.kind === "department") {
      if (mode === "wholesale") {
        navigate({ to: "/wholesale/catalog", search: { dept: s.slug } });
      } else {
        navigate({ to: "/departments/$slug", params: { slug: s.slug } });
      }
      return;
    }
    if (s.kind === "product") {
      if (mode === "wholesale") {
        navigate({ to: "/wholesale/$productId", params: { productId: s.id } });
      } else {
        navigate({ to: "/product/$productId", params: { productId: s.id } });
      }
      return;
    }
    setQuery(s.label);
    runSearch(s.label);
  };

  const suggestionList = (
    <ul className="max-h-80 overflow-auto py-1">
      {suggestions.map((s, i) => (
        <li key={`${s.kind}-${s.label}-${i}`}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => pickSuggestion(s)}
            className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-muted"
          >
            <span className="truncate">{s.label}</span>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {s.kind === "department" ? "Department" : s.sub}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );



  const switchMode = (next: "retail" | "wholesale") => {
    setMode(next);
    if (next === "wholesale" && !pathname.startsWith("/wholesale")) {
      navigate({ to: "/wholesale" });
    }
    if (next === "retail" && pathname.startsWith("/wholesale")) {
      navigate({ to: "/" });
    }
  };

  const toggleTheme = () => {
    setDark((current) => {
      const next = !current;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("kapematt.theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line backdrop-blur-md transition-all duration-300 ${
        scrolled ? "bg-paper/85 shadow-sm shadow-foreground/5" : "bg-paper/70"
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-[1400px] items-center gap-2 px-4 transition-all duration-300 sm:gap-4 sm:px-6 ${
          scrolled ? "h-14" : "h-16"
        }`}
      >
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-foreground p-1.5 transition-colors sm:size-10 dark:bg-transparent dark:p-0">
            <img
              src={heroLogo}
              alt="Kapematt logo"
              width={64}
              height={64}
              className="size-full object-contain"
            />
          </span>
          <span className="min-w-0 leading-none">
            <span className="block truncate font-display text-xl font-bold tracking-tight sm:text-2xl">
              kapematt
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              best value
            </span>
          </span>
        </Link>

        <div className="relative hidden max-w-md flex-1 md:block">
          <form
            onSubmit={submitSearch}
            role="search"
            className="flex items-center gap-2 rounded-full border border-line bg-glass px-4 py-2"
          >
            <span aria-hidden="true" className="font-mono text-xs text-muted-foreground">
              ⌕
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              autoComplete="off"
              aria-label={`Search ${mode} catalog`}
              placeholder={
                mode === "wholesale"
                  ? "Search cases, packs, MOQ…"
                  : "Search rice, avocado, milk…"
              }
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </form>
          {showSuggestions && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-line bg-popover shadow-xl">
              {suggestionList}
            </div>
          )}
        </div>


        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-3">
          <div
            role="group"
            aria-label="Browsing mode"
            className="flex rounded-full border border-line bg-glass p-0.5 font-mono text-[10px] sm:text-[11px]"
          >
            {(["retail", "wholesale"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                aria-pressed={mode === m}
                className={`rounded-full px-2 py-1.5 capitalize transition-colors sm:px-3 ${
                  mode === m
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={dark ? "Use light mode" : "Use dark mode"}
            title={dark ? "Light mode" : "Dark mode"}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-glass text-muted-foreground transition-colors hover:text-foreground"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <Link
            to="/login"
            aria-label="Account"
            className="hidden size-9 shrink-0 place-items-center rounded-full border border-line bg-glass font-mono text-sm text-muted-foreground sm:grid"
          >
            A
          </Link>

          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-glass font-mono text-sm lg:hidden"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <nav
        aria-label="Primary"
        className="mx-auto hidden max-w-[1400px] gap-6 px-4 pb-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground sm:px-6 lg:flex"
      >
        {links.map((l) => (
          <Link
            key={`${l.to}-${l.label}`}
            to={l.to}
            {...("hash" in l ? { hash: l.hash } : {})}
            activeProps={{ className: "text-foreground" }}
            className="transition-colors hover:text-foreground"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {open && (
        <div className="border-t border-line bg-paper/95 px-4 py-4 backdrop-blur lg:hidden">
          <form onSubmit={submitSearch} role="search" className="mb-2 flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              autoComplete="off"
              aria-label={`Search ${mode} catalog`}
              placeholder="Search the catalog…"
              className="w-full rounded-full border border-line bg-glass px-4 py-2 text-sm outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-foreground px-4 py-2 text-sm text-background"
            >
              Go
            </button>
          </form>
          <Link
            to="/bakery"
            hash="cake-inquiry"
            className="mb-3 block rounded-full bg-amber px-4 py-2 text-center text-sm font-medium text-foreground"
          >
            Custom cake inquiry
          </Link>
          {suggestions.length > 0 && (
            <div className="mb-4 overflow-hidden rounded-xl border border-line bg-popover">
              {suggestionList}
            </div>
          )}

          <ul className="grid grid-cols-2 gap-2 text-sm">
            <li className="sm:hidden">
              <Link
                to="/login"
                className="block rounded-lg border border-line bg-glass px-3 py-2"
              >
                Account
              </Link>
            </li>
            {links.map((l) => (
              <li key={`${l.to}-${l.label}`}>
                <Link
                  to={l.to}
                  {...("hash" in l ? { hash: l.hash } : {})}
                  className="block rounded-lg border border-line bg-glass px-3 py-2"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {mode === "retail" &&
              DEPARTMENTS.slice(0, 6).map((d) => (
                <li key={d.slug}>
                  <Link
                    to="/departments/$slug"
                    params={{ slug: d.slug }}
                    className="block rounded-lg border border-line bg-glass px-3 py-2"
                  >
                    {d.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      )}
    </header>
  );
}
