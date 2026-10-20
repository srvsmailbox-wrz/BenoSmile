import React from 'react';
import { Award, GraduationCap, CheckCircle2, Shield } from 'lucide-react';
import { PRACTITIONERS } from '../data/dentalData';

interface TeamSectionProps {
  onBookWithDoctor: (doctorId: string) => void;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ onBookWithDoctor }) => {
  return (
    <section id="equipe" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
            Praticiens diplômés & Assistantes dentaires
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
            L’Équipe Médicale du Cabinet
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Nos chirurgiens-dentistes et assistantes médico-techniques qualifiées vous accueillent avec écoute et bienveillance 
            dans un cadre serein et à la pointe des technologies de santé.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {PRACTITIONERS.map((doc) => (
            <div
              key={doc.id}
              className="rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all bg-white shadow-xs"
            >
              <div>
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-semibold text-slate-900">
                    {doc.conventionSector}
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-xs font-medium text-teal-800 uppercase tracking-wide">
                    {doc.specialty}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {doc.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    N° RPPS : {doc.rppsNumber} · {doc.experienceYears} ans d’expérience
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {doc.bio}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-800 flex items-center gap-1 mb-2">
                      <GraduationCap className="w-3.5 h-3.5 text-teal-700" />
                      <span>Titres & Diplômes universitaires</span>
                    </span>
                    <ul className="text-[11px] text-slate-500 space-y-1">
                      {doc.diplomas.map((d, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-teal-700 font-bold shrink-0">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={() => onBookWithDoctor(doc.id)}
                  className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                >
                  Prendre rendez-vous avec {doc.name.split(' ')[1]}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Tech & Sterilization Featurette */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl bg-slate-50 border border-slate-200">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-teal-800 uppercase tracking-wide">
              Plateau Technique
            </span>
            <h4 className="text-base font-bold text-slate-900">
              Imagerie numérique 3D & Scanner intra-oral Trios®
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fini les pâtes à empreinte désagréables en bouche : notre caméra numérique 3D réalise une cartographie optique instantanée de vos dents avec une précision microscopique. Notre radio Cone-Beam 3D permet une visualisation osseuse immédiate sur place.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-teal-800 uppercase tracking-wide">
              Sécurité Sanitaire
            </span>
            <h4 className="text-base font-bold text-slate-900">
              Chaîne de stérilisation hospitalière Classe B (Norme EN 13060)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Chaque instrument fait l’objet d’un cycle rigoureux : décontamination ultrasonique, mise sous sachet thermoscellé individuel et passage en autoclave sous vide de classe B avec traçabilité informatique par code-barres.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
