import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Phone, Mail, Check, Copy } from 'lucide-react';
import { CABINET_INFO } from '../data/dentalData';

export const PracticalInfoSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(CABINET_INFO.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
            Accès & Horaires
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Venir au Cabinet Dentaire
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Situé au cœur de la Plaine Monceau (Paris 17e), notre établissement est facilement accessible en transports en commun et conforme à l’accueil des personnes à mobilité réduite (PMR).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Hours & Transports */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-teal-700" />
                <span>Horaires d’ouverture du cabinet</span>
              </h3>

              <div className="space-y-3">
                {CABINET_INFO.hours.map((h, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-2 border-b border-slate-100 last:border-none">
                    <span className="font-semibold text-slate-800">{h.days}</span>
                    <span className="text-slate-600 font-mono mt-0.5 sm:mt-0">{h.times}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-teal-700" />
                <span>Transports & Accès PMR</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <span className="font-bold text-slate-900 shrink-0">Métro & RER :</span>
                  <span>{CABINET_INFO.metro}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-bold text-slate-900 shrink-0">Lignes de Bus :</span>
                  <span>{CABINET_INFO.bus}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-bold text-slate-900 shrink-0">Stationnement :</span>
                  <span>{CABINET_INFO.parking}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-bold text-slate-900 shrink-0">Accessibilité :</span>
                  <span>{CABINET_INFO.pmrAccess}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Address Card with interactive copy */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>

              <h3 className="text-base font-bold text-slate-900">
                {CABINET_INFO.name}
              </h3>
              <p className="text-sm text-slate-700 mt-1 font-medium">
                {CABINET_INFO.address}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <span>Secrétariat : <strong>{CABINET_INFO.phone}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <span>Contact : <strong>{CABINET_INFO.email}</strong></span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-900 mb-2">Engagements & Conventions</h4>
                <ul className="text-[11px] text-slate-500 space-y-1.5">
                  {CABINET_INFO.certifications.map((c, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="text-teal-700">✓</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopyAddress}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Adresse copiée !' : 'Copier l’adresse'}</span>
              </button>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CABINET_INFO.address)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Ouvrir dans Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
