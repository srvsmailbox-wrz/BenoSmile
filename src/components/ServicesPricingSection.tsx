import React from 'react';
import { Clock, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { CARE_REASONS } from '../data/dentalData';

interface ServicesPricingSectionProps {
  onSelectReason: (reasonId: string) => void;
}

export const ServicesPricingSection: React.FC<ServicesPricingSectionProps> = ({ onSelectReason }) => {
  return (
    <section id="soins-tarifs" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
            Transparence & Déontologie
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Soins proposés & Tarifs conventionnés
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Le cabinet applique les tarifs conventionnels de l’Assurance Maladie (Secteur 1). 
            La télétransmission par Carte Vitale et le tiers-payant évitent l’avance des frais remboursables.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {CARE_REASONS.map((care) => (
            <div
              key={care.id}
              className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-teal-800">
                    {care.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{care.durationMinutes} min</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {care.title}
                </h3>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {care.description}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500">Tarif de référence</span>
                    <span className="text-base font-bold text-slate-900 font-mono">
                      {care.basePrice > 0 ? `${care.basePrice.toFixed(2)} €` : 'Sur devis'}
                    </span>
                  </div>

                  <div className="text-[11px] text-teal-800 font-medium mt-1">
                    {care.secuCoveragePercent > 0 
                      ? `Prise en charge Sécurité Sociale à ${care.secuCoveragePercent}%` 
                      : 'Non remboursé Sécu (Hors Nomenclature)'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {care.conventionInfo}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onSelectReason(care.id)}
                  className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Prendre RDV pour ce soin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 100% Santé Infobox */}
        <div className="bg-white rounded-xl border border-teal-200/80 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Dispositif "100% Santé Dentaire" (Reste à charge zéro)
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Conformément à la réforme réglementaire, nous proposons pour chaque plan prothétique une alternative dans le 
                panier 100% Santé (couronnes céramo-métalliques, zircone ou métalliques selon la dent) 
                intégralement remboursée sans aucun euro à votre charge grâce à votre contrat de mutuelle responsable.
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-500 shrink-0">
            <span>Devis systématique remis avant tout traitement prothétique</span>
          </div>
        </div>
      </div>
    </section>
  );
};
