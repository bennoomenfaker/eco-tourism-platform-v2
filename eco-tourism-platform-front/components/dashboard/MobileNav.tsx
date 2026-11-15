"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Menu, X } from "lucide-react";

/**
 * Navigation mobile des espaces connectés.
 *
 * Les tableaux de bord affichent une barre latérale fixe de 288 px. Sous `lg`,
 * elle recouvrait tout l'écran et masquait le contenu : le bouton d'ouverture
 * n'existait pas. Ce module fournit les trois pièces du tiroir — le fournisseur
 * d'état, la barre latérale qui coulisse et le bouton d'ouverture — pour que
 * les six tableaux de bord se comportent de la même manière.
 */

type DashboardNavState = {
  open: boolean;
  setOpen: (value: boolean) => void;
  close: () => void;
  toggle: () => void;
};

const DashboardNavContext = createContext<DashboardNavState | null>(null);

export function DashboardNavProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  // Tiroir ouvert : la page derrière ne défile plus, et Échap le referme.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const value = useMemo<DashboardNavState>(
    () => ({
      open,
      setOpen,
      close: () => setOpen(false),
      toggle: () => setOpen((current) => !current),
    }),
    [open],
  );

  return (
    <DashboardNavContext.Provider value={value}>
      {children}
    </DashboardNavContext.Provider>
  );
}

export function useDashboardNav(): DashboardNavState {
  const context = useContext(DashboardNavContext);
  if (!context) {
    throw new Error("useDashboardNav doit être utilisé dans DashboardNavProvider");
  }
  return context;
}

/** Barre latérale : fixe sur grand écran, tiroir coulissant sous `lg`. */
export function DashboardSidebar({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { open, close } = useDashboardNav();

  return (
    <>
      {/* Voile : ferme le tiroir au clic et empêche d'atteindre la page. */}
      <div
        role="presentation"
        onClick={close}
        className={`fixed inset-0 z-40 bg-slate-900/40 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="dashboard-sidebar"
        aria-label="Navigation principale"
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-72 max-w-[85vw] flex-col overflow-y-auto overscroll-contain border-r border-primary/10 bg-white transition-transform duration-300 dark:bg-slate-900 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${className}`}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Fermer le menu"
          className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 active:scale-95 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
        >
          <X className="size-5" />
        </button>
        {children}
      </aside>
    </>
  );
}

/** Bouton hamburger : visible uniquement quand la barre latérale est un tiroir. */
export function DashboardNavToggle({ className = "" }: { className?: string }) {
  const { open, toggle } = useDashboardNav();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
      aria-expanded={open}
      aria-controls="dashboard-sidebar"
      className={`flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 active:scale-95 dark:border-slate-700 dark:text-slate-200 lg:hidden ${className}`}
    >
      <Menu className="size-5" />
    </button>
  );
}
