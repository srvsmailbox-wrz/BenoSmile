import React from 'react';
import { Calendar, UserCheck } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenMyAppointments: () => void;
  onOpenCabinetPro: () => void;
  appointmentsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenMyAppointments,
  onOpenCabinetPro,
  appointmentsCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#" 
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-teal-800 transition-colors"
        >
          Cabinet Dentaire Lumina
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a href="#prendre-rdv" onClick={onOpenBooking} className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
            Prendre RDV
          </a>
          <a href="#soins-tarifs" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
            Soins & Tarifs
          </a>
          <a href="#equipe" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
            L’Équipe
          </a>
          <a href="#urgences" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
            Urgences
          </a>
          <button
            type="button"
            onClick={onOpenMyAppointments}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer flex items-center gap-1.5"
          >
            <span>Mes Rendez-vous</span>
            {appointmentsCount > 0 && (
              <span className="text-[11px] font-mono font-bold text-teal-800">
                ({appointmentsCount})
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCabinetPro}
            className="hidden lg:inline-flex px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Espace réservé aux praticiens et au secrétariat"
          >
            Espace Cabinet
          </button>
          <button
            type="button"
            onClick={onOpenBooking}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            Prendre rendez-vous
          </button>
        </div>
      </div>
    </header>
  );
};
