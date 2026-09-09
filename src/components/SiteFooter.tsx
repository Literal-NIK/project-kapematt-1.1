import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { DEPARTMENTS, STORE } from "@/data/catalog";

const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com", Icon: Facebook },
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { label: "X", href: "https://x.com", Icon: Twitter },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-glass backdrop-blur">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:justify-items-center sm:gap-6 lg:text-left">
          <div className="col-span-2 sm:col-span-1 sm:text-center lg:text-left">
            <span className="font-display text-xl font-bold tracking-tight">
              kapematt
            </span>
            <p className="mt-3 max-w-[24ch] text-pretty text-sm text-muted-foreground">
              A single-location neighbourhood supermarket, stocked fresh every
              morning.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              {STORE.address}
              <br />
              {STORE.phone}
              <br />
              {STORE.email}
            </p>
          </div>
          <div className="min-w-0 sm:text-center lg:text-left">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Departments
            </span>
            <ul className="mt-3 space-y-2 text-sm">
              {DEPARTMENTS.slice(0, 6).map((d) => (
                <li key={d.slug}>
                  <Link
                    to="/departments/$slug"
                    params={{ slug: d.slug }}
                    className="hover:text-leaf"
                  >
                    {d.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/catalog" className="hover:text-leaf">
                  Full catalog
                </Link>
              </li>
            </ul>
          </div>
          <div className="min-w-0 sm:text-center lg:text-left">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Company
            </span>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-leaf">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-leaf">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/store" className="hover:text-leaf">
                  Find us
                </Link>
              </li>
              <li>
                <Link to="/wholesale" className="hover:text-leaf">
                  Wholesale
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-leaf">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1 sm:text-center lg:text-left">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Legal & help
            </span>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/faq" className="hover:text-leaf">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-leaf">
                  Terms & privacy
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-leaf">
                  Account (optional)
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-leaf">
                  Staff offers admin
                </Link>
              </li>
            </ul>
            <div className="mt-4 flex gap-3 text-muted-foreground">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  title={s.label}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="grid size-9 place-items-center rounded-full border border-line bg-glass transition-all duration-300 hover:-translate-y-0.5 hover:border-leaf hover:text-leaf hover:shadow-[0_0_18px_var(--leaf)]"
                >
                  <s.Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 font-mono text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Kapematt Ltd. All rights reserved.</span>
          <span>Catalog only · no online checkout</span>
        </div>
      </div>
    </footer>
  );
}
