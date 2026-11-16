"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Leaf, Menu, X } from "lucide-react";
import { getConsistentSession } from "@/lib/auth";

type NavbarProps = {
  variant?: "home" | "auth";
  currentPage?: "login" | "register" | null;
  backHref?: string;
};

/** Une seule source pour le menu : le rendu bureau et le tiroir mobile restent identiques. */
const LIENS = [
  { href: "/destinations", label: "Destinations" },
  { href: "/how-it-works", label: "Comment ça marche" },
  { href: "/#publications", label: "Projets Éco" },
  { href: "/#a-propos", label: "À propos" },
  { href: "/dashboard/afratim", label: "AFRATIM ODD" },
];

export default function Navbar({
  variant = "home",
  currentPage = null,
  backHref = "/",
}: NavbarProps) {
  const isAuth = variant === "auth";
  const [session, setSession] = useState<{ userId: string; role: string } | null>(null);
  const [menuOuvert, setMenuOuvert] = useState(false);

  useEffect(() => {
    setSession(getConsistentSession());
  }, []);

  // Tiroir mobile : on bloque le défilement de la page et on ferme avec Échap.
  useEffect(() => {
    if (!menuOuvert) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOuvert(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOuvert]);

  const dashboardHref =
    session?.role === "eco_traveler"
      ? "/dashboard/ecovoyageur"
      : session?.role === "guide"
        ? "/dashboard/guide"
        : session?.role === "provider"
          ? "/dashboard/provider"
          : "/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 sm:px-6 md:px-20 lg:px-40 py-4">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-4">
          {isAuth && (
            <Link
              href={backHref}
              className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Link>
          )}

          <Link
            href="/"
            className="flex items-center gap-2 text-slate-900 dark:text-slate-100"
            onClick={() => setMenuOuvert(false)}
          >
            <Leaf className="text-primary w-8 h-8 shrink-0" />
            <h2 className="text-xl font-extrabold tracking-tight">Sustainable Adventures</h2>
          </Link>
        </div>

        {!isAuth && (
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {LIENS.map((lien) => (
              <Link
                key={lien.href}
                href={lien.href}
                className="whitespace-nowrap text-sm font-semibold transition-colors hover:text-primary"
              >
                {lien.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          {session ? (
            <Link
              href={dashboardHref}
              className="flex h-11 items-center justify-center rounded-xl px-4 sm:px-5 text-sm font-bold bg-primary text-slate-900 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              Mon espace
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={`hidden sm:flex h-11 items-center justify-center rounded-xl px-5 text-sm font-bold transition-all ${
                  currentPage === "login"
                    ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200"
                }`}
              >
                Connexion
              </Link>

              <Link
                href="/auth/register"
                className={`flex h-11 items-center justify-center rounded-xl px-4 sm:px-6 text-sm font-bold transition-all ${
                  currentPage === "register"
                    ? "bg-primary text-slate-900 shadow-lg shadow-primary/20"
                    : "bg-primary text-slate-900 shadow-lg shadow-primary/20 hover:scale-105"
                }`}
              >
                S&apos;inscrire
              </Link>
            </>
          )}

          {!isAuth && (
            <button
              type="button"
              aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOuvert}
              aria-controls="menu-mobile"
              onClick={() => setMenuOuvert((v) => !v)}
              className="lg:hidden flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 active:scale-95 transition-all"
            >
              {menuOuvert ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Tiroir mobile / tablette : le menu bureau est masqué sous `lg`. */}
      {!isAuth && menuOuvert && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 top-[73px] z-40 bg-slate-900/20"
            onClick={() => setMenuOuvert(false)}
            aria-hidden
          />
          <nav
            id="menu-mobile"
            className="absolute left-0 right-0 top-full z-50 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark shadow-xl"
          >
            <ul className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-20 py-2">
              {LIENS.map((lien) => (
                <li key={lien.href}>
                  <Link
                    href={lien.href}
                    onClick={() => setMenuOuvert(false)}
                    className="block rounded-xl px-4 py-3 text-base font-semibold text-slate-800 dark:text-slate-100 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    {lien.label}
                  </Link>
                </li>
              ))}
              {!session && (
                <li className="sm:hidden">
                  <Link
                    href="/auth/login"
                    onClick={() => setMenuOuvert(false)}
                    className="mt-2 block rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-3 text-base font-bold text-slate-900 dark:text-slate-100"
                  >
                    Connexion
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
