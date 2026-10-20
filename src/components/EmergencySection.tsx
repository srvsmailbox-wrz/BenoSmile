import React from 'react';
import { AlertCircle, Phone, Clock, ArrowRight, ShieldAlert } from 'lucide-react';
import { CABINET_INFO } from '../data/dentalData';

interface EmergencySectionProps {
  onBookEmergency: () => void;
}

export const EmergencySection: React.FC<EmergencySectionProps> = ({ onBookEmergency }) => {
  return (
    <section id="urgences" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-2 text-rose-800 text-xs font-bold uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Service d’Urgences Dentaires Paris 17e</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Une douleur aiguë ou une dent cassée ?
              </h2>

              <p className="text-sm text-slate-700 leading-relaxed">
                Le Cabinet Lumina réserve chaque jour des <strong>créneaux d'urgence non programmés</strong> pour 
                soulager immédiatement les rages de dents, pulvites, abcès dentaires ou traumatismes récents.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onBookEmergency}
                  className="px-6 py-3 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
                >
                  <span>Réserver un créneau d’urgence prioritaire</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`tel:${CABINET_INFO.emergencyPhone.replace(/\s+/g, '')}`}
                  className="px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-rose-600" />
                  <span>{CABINET_INFO.emergencyPhone}</span>
                </a>
              </div>
            </div>

            {/* Quick Emergency Protocol Box */}
            <div className="w-full lg:w-96 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Gestes d’urgence immédiats</span>
              </h4>

              <div>
                <strong className="block text-slate-800">Dent définitive expulsée :</strong>
                <span className="text-slate-600">
                  Ne pas frotter la racine. La conserver impérativement dans du <strong>sérum physiologique ou du lait</strong> (jamais à sec ni dans l'eau) et consulter sous 2 heures.
                </span>
              </div>

              <div>
                <strong className="block text-slate-800">Rage de dents / Douleur pulsatile :</strong>
                <span className="text-slate-600">
                  Prendre du paracétamol selon posologie. Éviter l'aspirine ou les anti-inflammatoires sans avis en cas de suspicion d'abcès (risque de diffusion infectieuse).
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                En dehors des horaires d'ouverture (dimanches et nuits) : composez le <strong>15</strong> (SAMU) pour être orienté vers le chirurgien-dentiste de garde du Conseil de l'Ordre.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
