import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Search,
  Activity,
  FileText
} from 'lucide-react';
import { Appointment, AppointmentStatus } from '../types/dental';
import { PRACTITIONERS } from '../data/dentalData';
import { formatFrenchDate, updateAppointmentStatus } from '../utils/calendarUtils';

interface CabinetProModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  onAppointmentsChange: (updated: Appointment[]) => void;
}

export const CabinetProModal: React.FC<CabinetProModalProps> = ({
  isOpen,
  onClose,
  appointments,
  onAppointmentsChange
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedPatientNotes, setSelectedPatientNotes] = useState<Appointment | null>(null);

  if (!isOpen) return null;

  const filteredAppointments = appointments
    .filter((a) => a.date === selectedDate)
    .filter((a) => (selectedDocId === 'all' ? true : a.practitionerId === selectedDocId))
    .sort((a, b) => a.time.localeCompare(b.time));

  const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
    const updated = updateAppointmentStatus(id, newStatus);
    onAppointmentsChange(updated);
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Prévu</span>;
      case 'waiting_room':
        return <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">En salle d’attente</span>;
      case 'in_consultation':
        return <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">En fauteuil</span>;
      case 'completed':
        return <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Terminé</span>;
      case 'cancelled':
        return <span className="text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded">Annulé</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Espace Praticien & Secrétariat Pro</h3>
                <span className="text-[10px] bg-teal-900 text-teal-200 px-1.5 py-0.5 rounded font-mono">
                  GESTION DU PLANNING
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Suivi du flux patient en temps réel et alertes cliniques
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Strip */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                Date du planning
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                Praticien
              </label>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800"
              >
                <option value="all">Tous les praticiens du cabinet</option>
                {PRACTITIONERS.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-slate-600 font-medium">
            <span>{filteredAppointments.length} consultation(s) programmée(s)</span>
          </div>
        </div>

        {/* Schedule List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 bg-white">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-slate-700">Aucun patient prévu pour cette date</p>
              <p className="text-xs text-slate-400 mt-1">Sélectionnez une autre date ou un autre praticien.</p>
            </div>
          ) : (
            filteredAppointments.map((apt) => {
              const hasAlerts = apt.patientInfo.medicalAlerts && apt.patientInfo.medicalAlerts.length > 0;

              return (
                <div
                  key={apt.id}
                  className={`border rounded-xl p-4 transition-all ${
                    apt.status === 'in_consultation'
                      ? 'border-teal-400 bg-teal-50/20 shadow-xs'
                      : apt.status === 'waiting_room'
                      ? 'border-amber-300 bg-amber-50/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-slate-900 text-white rounded-lg px-2.5 py-1.5 text-center font-mono shrink-0">
                        <span className="text-sm font-bold block">{apt.time}</span>
                        <span className="text-[10px] text-slate-400 block">{apt.durationMinutes}m</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {apt.patientInfo.civility} {apt.patientInfo.firstName} {apt.patientInfo.lastName}
                          </h4>
                          <span className="text-xs text-slate-500">
                            ({apt.patientInfo.isNewPatient ? 'Nouveau patient' : 'Suivi habituel'})
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {apt.referenceCode}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-1">
                          <span>
                            <strong>Motif :</strong> {apt.reasonTitle}
                          </span>
                          <span>·</span>
                          <span>
                            <strong>Praticien :</strong> {apt.practitionerName}
                          </span>
                          {apt.selectedToothName && (
                            <>
                              <span>·</span>
                              <span className="text-teal-800 font-semibold">
                                Dent : {apt.selectedToothName}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Medical alerts banner */}
                        {hasAlerts && (
                          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>
                              <strong>Alerte médicale :</strong> {apt.patientInfo.medicalAlerts?.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status & action buttons */}
                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(apt.status)}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(apt.id, 'waiting_room')}
                          className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                            apt.status === 'waiting_room'
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          Arrivé
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(apt.id, 'in_consultation')}
                          className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                            apt.status === 'in_consultation'
                              ? 'bg-teal-700 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          En fauteuil
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(apt.id, 'completed')}
                          className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                            apt.status === 'completed'
                              ? 'bg-emerald-700 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          Terminé
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Plateforme certifiée Hébergeur de Données de Santé (HDS)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
          >
            Fermer l'agenda
          </button>
        </div>
      </div>
    </div>
  );
};
