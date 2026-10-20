import React from 'react';
import { ShieldCheck, CalendarCheck, Clock, Award, ArrowRight, AlertCircle } from 'lucide-react';

interface HeroSectionProps {
  onStartBooking: (preselectedReasonId?: string) => void;
  onOpenUrgent: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartBooking, onOpenUrgent }) => {
  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Zero-Pill Unboxed Trust Header */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
              <span className="text-teal-800 font-semibold">Cabinet Dentaire Lumina</span>
              <span aria-hidden="true">·</span>
              <span>Paris 17e</span>
              <span aria-hidden="true">·</span>
              <span>Conventionné Secteur 1</span>
              <span aria-hidden="true">·</span>
              <span>Carte Vitale & Tiers-Payant</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 text-balance leading-[1.15]">
              Prenez rendez-vous en ligne chez votre chirurgien-dentiste
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Soins conservateurs, détartrage prophylactique, implants 3D et esthétique du sourire. 
              Réservation immédiate 24h/24 avec confirmation par SMS et créneaux prioritaires en cas d’urgence.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onStartBooking()}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-xs"
              >
                <span>Prendre rendez-vous en ligne</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onStartBooking('urgence-douleur')}
                className="px-5 py-3 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Urgence dentaire aujourd’hui</span>
              </button>
            </div>

            {/* Practical Quick Badges */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <CalendarCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Réservation en 2 min</strong>
                  <span>Sans création de compte obligatoire</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">100% Santé & Sécu</strong>
                  <span>Zéro reste à charge sur panier 100%</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Urgences sous 24h</strong>
                  <span>Créneaux réservés chaque matin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-fidelity clinic photo */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-4/3 lg:aspect-square bg-slate-100">
              <img
                src="/src/assets/images/hero_dental_clinic_1792090290304.jpg"
                alt="Cabinet dentaire Lumina moderne et lumineux à Paris 17e"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-5 text-white">
                <div className="text-xs text-slate-300">Plateau technique de pointe</div>
                <div className="text-sm font-semibold mt-0.5">
                  Salle de stérilisation classe B & Radiographie 3D Cone-Beam
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Proof of rigor / Key figures strip */}
        <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              3
            </div>
            <div className="text-xs text-slate-500 mt-1">Chirurgiens-Dentistes spécialisés</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              &lt; 24h
            </div>
            <div className="text-xs text-slate-500 mt-1">Délai moyen d’urgence dentaire</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              100%
            </div>
            <div className="text-xs text-slate-500 mt-1">Télétransmission Carte Vitale</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              4.9 / 5
            </div>
            <div className="text-xs text-slate-500 mt-1">Note certifiée de nos patients</div>
          </div>
        </div>
      </div>
    </section>
  );
};
