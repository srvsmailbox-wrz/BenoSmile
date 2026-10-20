import React from 'react';
import { CABINET_INFO } from '../data/dentalData';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenMyAppointments: () => void;
  onOpenCabinetPro: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenMyAppointments,
  onOpenCabinetPro
}) => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & info */}
          <div className="md:col-span-1 space-y-3">
            <span className="text-base font-bold text-slate-900 block">
              Cabinet Dentaire Lumina
            </span>
            <p className="text-slate-500 text-xs leading-relaxed">
              Cabinet d’omnipratique, implantologie et esthétique dentaire conventionné Secteur 1.
            </p>
            <div className="text-slate-500 text-xs">
              142 Avenue de Wagram, 75017 Paris
              <br />
              Tél : {CABINET_INFO.phone}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Accès rapide
            </h4>
            <ul className="space-y-1.5">
              <li>
                <a href="#prendre-rdv" onClick={onOpenBooking} className="hover:text-slate-900 transition-colors">
                  Prendre un rendez-vous
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenMyAppointments}
                  className="hover:text-slate-900 transition-colors text-left"
                >
                  Gérer mes consultations prévues
                </button>
              </li>
              <li>
                <a href="#soins-tarifs" className="hover:text-slate-900 transition-colors">
                  Soins & Grille des honoraires
                </a>
              </li>
              <li>
                <a href="#equipe" className="hover:text-slate-900 transition-colors">
                  Chirurgiens-Dentistes
                </a>
              </li>
              <li>
                <a href="#urgences" className="hover:text-slate-900 transition-colors">
                  Guide des urgences dentaires
                </a>
              </li>
            </ul>
          </div>

          {/* Soins courants */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Actes & Spécialités
            </h4>
            <ul className="space-y-1.5 text-slate-500">
              <li>• Bilan complet & Détartrage ultrasonique</li>
              <li>• Soins conservateurs & Traitement de caries</li>
              <li>• Implants dentaires guidés par ordinateur 3D</li>
              <li>• Orthodontie invisible par gouttières thermoformées</li>
              <li>• Éclaircissement dentaire au fauteuil</li>
              <li>• Prévention bucco-dentaire M'T Dents</li>
            </ul>
          </div>

          {/* Legal and Pro Access */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Déontologie & Espace Pro
            </h4>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Site d’information médicale conforme à la charte ordinale et aux articles R.4127-201 et suivants du Code de la Santé Publique.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenCabinetPro}
                className="text-slate-800 hover:text-teal-800 underline text-xs font-medium cursor-pointer"
              >
                Accès Professionnels (Médecins & Secrétariat)
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} Cabinet Dentaire Lumina. Tous droits réservés.
          </div>
          <div className="flex items-center gap-4">
            <span>Inscrit au Conseil National de l’Ordre des Chirurgiens-Dentistes</span>
            <span aria-hidden="true">·</span>
            <span>Hébergement Certifié HDS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
