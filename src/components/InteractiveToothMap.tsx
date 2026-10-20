import React from 'react';
import { DENTAL_TEETH_SYSTEM, COMMON_SYMPTOMS } from '../data/dentalData';
import { ToothInfo } from '../types/dental';

interface InteractiveToothMapProps {
  selectedToothNumber?: number;
  onSelectTooth: (tooth: ToothInfo | null) => void;
  selectedSymptoms: string[];
  onToggleSymptom: (symptom: string) => void;
}

export const InteractiveToothMap: React.FC<InteractiveToothMapProps> = ({
  selectedToothNumber,
  onSelectTooth,
  selectedSymptoms,
  onToggleSymptom
}) => {
  const upperArch = DENTAL_TEETH_SYSTEM.filter((t) => t.arch === 'upper');
  const lowerArch = DENTAL_TEETH_SYSTEM.filter((t) => t.arch === 'lower');

  const selectedTooth = DENTAL_TEETH_SYSTEM.find((t) => t.number === selectedToothNumber);

  const getToothLabel = (t: ToothInfo) => {
    switch (t.type) {
      case 'incisive':
        return 'I';
      case 'canine':
        return 'C';
      case 'premolaire':
        return 'P';
      case 'molaire':
        return 'M';
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 my-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Localisation de la gêne ou de la douleur (Optionnel)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Cliquez sur la dent concernée pour aider le praticien à préparer votre consultation
          </p>
        </div>
        {selectedTooth && (
          <button
            type="button"
            onClick={() => onSelectTooth(null)}
            className="text-xs font-medium text-teal-700 hover:text-teal-900 underline text-left sm:text-right"
          >
            Désélectionner
          </button>
        )}
      </div>

      {/* Selected tooth indicator banner */}
      {selectedTooth ? (
        <div className="bg-teal-50/80 border border-teal-200 rounded-lg px-3.5 py-2 mb-4 flex items-center justify-between text-xs text-teal-950">
          <span className="font-medium">
            Dent sélectionnée : Dent {selectedTooth.number} ({selectedTooth.name})
          </span>
          <span className="text-teal-700">Prise en compte dans votre dossier</span>
        </div>
      ) : (
        <div className="text-xs text-slate-400 italic mb-3">
          Aucune dent ciblée (par défaut pour bilan complet ou détartrage général)
        </div>
      )}

      {/* Dental arches visualization */}
      <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-xs space-y-4">
        {/* Upper Arch */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-1.5 px-1">
            <span>Droite</span>
            <span className="text-slate-600 font-semibold">Arcade Supérieure (Haut)</span>
            <span>Gauche</span>
          </div>
          <div className="grid grid-cols-16 gap-1 max-w-2xl mx-auto">
            {upperArch.map((tooth) => {
              const isSelected = selectedToothNumber === tooth.number;
              return (
                <button
                  key={tooth.number}
                  type="button"
                  title={`${tooth.number} - ${tooth.name}`}
                  onClick={() => onSelectTooth(isSelected ? null : tooth)}
                  className={`flex flex-col items-center justify-center py-2 px-0.5 rounded transition-all text-center ${
                    isSelected
                      ? 'bg-teal-700 text-white shadow-xs scale-105 ring-2 ring-teal-600 ring-offset-1'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-mono leading-none font-bold">
                    {tooth.number}
                  </span>
                  <span className="text-[9px] opacity-75 mt-0.5">{getToothLabel(tooth)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center line divider */}
        <div className="border-t border-dashed border-slate-200 relative my-1">
          <span className="absolute left-1/2 -top-2 -translate-x-1/2 bg-white px-2 text-[10px] text-slate-400 font-medium">
            Ligne médiane
          </span>
        </div>

        {/* Lower Arch */}
        <div>
          <div className="grid grid-cols-16 gap-1 max-w-2xl mx-auto">
            {lowerArch.map((tooth) => {
              const isSelected = selectedToothNumber === tooth.number;
              return (
                <button
                  key={tooth.number}
                  type="button"
                  title={`${tooth.number} - ${tooth.name}`}
                  onClick={() => onSelectTooth(isSelected ? null : tooth)}
                  className={`flex flex-col items-center justify-center py-2 px-0.5 rounded transition-all text-center ${
                    isSelected
                      ? 'bg-teal-700 text-white shadow-xs scale-105 ring-2 ring-teal-600 ring-offset-1'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span className="text-[9px] opacity-75 mb-0.5">{getToothLabel(tooth)}</span>
                  <span className="text-[10px] font-mono leading-none font-bold">
                    {tooth.number}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mt-1.5 px-1">
            <span>Droite</span>
            <span className="text-slate-600 font-semibold">Arcade Inférieure (Bas)</span>
            <span>Gauche</span>
          </div>
        </div>
      </div>

      {/* Associated symptoms checklist */}
      <div className="mt-4 pt-3 border-t border-slate-200">
        <label className="block text-xs font-semibold text-slate-800 mb-2">
          Symptômes ou motifs ressentis (sélectionnez ce qui correspond) :
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {COMMON_SYMPTOMS.map((symptom) => {
            const isChecked = selectedSymptoms.includes(symptom);
            return (
              <button
                key={symptom}
                type="button"
                onClick={() => onToggleSymptom(symptom)}
                className={`text-left text-xs px-3 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                  isChecked
                    ? 'border-teal-600 bg-teal-50 text-teal-900 font-medium'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] shrink-0 ${
                    isChecked
                      ? 'bg-teal-700 border-teal-700 text-white font-bold'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isChecked ? '✓' : ''}
                </span>
                <span className="truncate">{symptom}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
