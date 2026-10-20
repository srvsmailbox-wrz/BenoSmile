import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  X, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  CalendarX, 
  CalendarClock,
  Printer
} from 'lucide-react';
import { Appointment } from '../types/dental';
import { 
  formatFrenchDate, 
  cancelStoredAppointment, 
  downloadCalendarEvent, 
  getUpcomingDays, 
  getSlotsForDateAndDoctor, 
  saveAppointment 
} from '../utils/calendarUtils';
import { CABINET_INFO } from '../data/dentalData';

interface MyAppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  onAppointmentsChange: (updated: Appointment[]) => void;
}

export const MyAppointmentsModal: React.FC<MyAppointmentsModalProps> = ({
  isOpen,
  onClose,
  appointments,
  onAppointmentsChange
}) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState<string>('');

  // Reschedule state
  const upcomingDays = getUpcomingDays(10);
  const [newDate, setNewDate] = useState<string>(upcomingDays[1]?.date || '');
  const [newTime, setNewTime] = useState<string>('');

  if (!isOpen) return null;

  const filteredAppointments = appointments.filter((apt) => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      apt.referenceCode.toLowerCase().includes(q) ||
      apt.patientInfo.lastName.toLowerCase().includes(q) ||
      apt.patientInfo.firstName.toLowerCase().includes(q) ||
      apt.practitionerName.toLowerCase().includes(q)
    );
  });

  const handleConfirmCancel = (id: string) => {
    const updated = cancelStoredAppointment(id);
    onAppointmentsChange(updated);
    setCancellingId(null);
  };

  const handleConfirmReschedule = (apt: Appointment) => {
    if (!newDate || !newTime) return;
    const updatedApt: Appointment = {
      ...apt,
      date: newDate,
      time: newTime,
      status: 'confirmed'
    };
    const updated = saveAppointment(updatedApt);
    onAppointmentsChange(updated);
    setReschedulingId(null);
  };

  const handlePrintCertificate = (apt: Appointment) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Attestation de Rendez-vous Dentaire - ${apt.referenceCode}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f172a; }
            .header { border-bottom: 2px solid #0f766e; padding-bottom: 20px; margin-bottom: 30px; }
            h1 { font-size: 20px; color: #0f766e; margin: 0 0 5px 0; }
            .meta { font-size: 13px; color: #64748b; }
            .content { font-size: 14px; line-height: 1.6; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .footer { margin-top: 50px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Cabinet Dentaire Lumina</h1>
            <div class="meta">142 Avenue de Wagram, 75017 Paris · Tél: 01 42 68 90 20</div>
          </div>
          <div class="content">
            <h2 style="font-size: 16px;">ATTESTATION DE RENDEZ-VOUS MÉDICAL</h2>
            <p>Le Cabinet Dentaire Lumina certifie que :</p>
            <div class="box">
              <strong>Patient(e) :</strong> ${apt.patientInfo.civility} ${apt.patientInfo.firstName} ${apt.patientInfo.lastName}<br>
              <strong>Date de naissance :</strong> ${apt.patientInfo.birthDate || 'Non spécifiée'}<br>
              <strong>Praticien traitant :</strong> ${apt.practitionerName}<br>
              <strong>Motif de consultation :</strong> ${apt.reasonTitle}<br>
              <strong>Date & Horaire :</strong> ${formatFrenchDate(apt.date)} à ${apt.time}<br>
              <strong>Référence dossier :</strong> ${apt.referenceCode}
            </div>
            <p>Document établi pour servir et valoir ce que de droit (justification d’absence professionnelle ou scolaire).</p>
          </div>
          <div class="footer">
            Cabinet Dentaire Lumina · SELARL au capital de 50 000 € · N° RPPS Cabinet : 10100482901 · Ordre National des Chirurgiens-Dentistes
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Mes Rendez-vous Dentaires</h3>
            <p className="text-xs text-slate-500">
              Gérez, modifiez ou téléchargez les convocations de vos consultations
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search filter */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <input
            type="text"
            placeholder="Rechercher par nom, référence (ex: LUM-4821) ou praticien..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Aucun rendez-vous trouvé</p>
              <p className="text-xs text-slate-400 mt-1">
                Vous n'avez pas de consultation prévue ou aucune référence ne correspond à votre recherche.
              </p>
            </div>
          ) : (
            filteredAppointments.map((apt) => {
              const isCancelled = apt.status === 'cancelled';
              const isReschedulingThis = reschedulingId === apt.id;

              return (
                <div
                  key={apt.id}
                  className={`border rounded-xl p-5 transition-all ${
                    isCancelled
                      ? 'border-slate-200 bg-slate-50/50 opacity-60'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                        {apt.referenceCode}
                      </span>
                      <span className="text-xs text-slate-500">
                        {isCancelled ? '· Rendez-vous annulé' : '· Confirmé'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-600 font-medium">
                      Patient : {apt.patientInfo.civility} {apt.patientInfo.firstName} {apt.patientInfo.lastName}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        <Calendar className="w-4 h-4 text-teal-700 shrink-0" />
                        <span>{formatFrenchDate(apt.date)} à {apt.time}</span>
                      </div>
                      <span className="text-xs text-slate-500 block mt-0.5">
                        Praticien : {apt.practitionerName} ({apt.durationMinutes} min)
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">
                        {apt.reasonTitle}
                      </span>
                      {apt.selectedToothName && (
                        <span className="text-xs text-teal-700 block mt-0.5">
                          Dent : {apt.selectedToothName}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>142 Av de Wagram, 75017 Paris</span>
                      </span>
                    </div>
                  </div>

                  {/* Rescheduling Form subview */}
                  {isReschedulingThis && (
                    <div className="mt-4 pt-4 border-t border-teal-100 bg-teal-50/40 -mx-5 -mb-5 p-5 rounded-b-xl">
                      <h4 className="text-xs font-bold text-teal-950 mb-2">
                        Modifier la date du rendez-vous
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">
                            Nouvelle date
                          </label>
                          <select
                            value={newDate}
                            onChange={(e) => {
                              setNewDate(e.target.value);
                              setNewTime('');
                            }}
                            className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                          >
                            {upcomingDays.map((d) => (
                              <option key={d.date} value={d.date}>
                                {d.displayDay} {d.displayDate}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">
                            Nouvel horaire
                          </label>
                          <select
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                          >
                            <option value="">Sélectionner une heure</option>
                            {getSlotsForDateAndDoctor(newDate, apt.practitionerId, appointments)
                              .morning.concat(
                                getSlotsForDateAndDoctor(newDate, apt.practitionerId, appointments).afternoon
                              )
                              .filter((s) => s.isAvailable)
                              .map((s) => (
                                <option key={s.time} value={s.time}>
                                  {s.time}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setReschedulingId(null)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                        >
                          Annuler
                        </button>
                        <button
                          type="button"
                          disabled={!newTime}
                          onClick={() => handleConfirmReschedule(apt)}
                          className="px-4 py-1.5 bg-teal-800 text-white rounded-lg text-xs font-semibold hover:bg-teal-900 disabled:opacity-40"
                        >
                          Valider le changement
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions Bar */}
                  {!isCancelled && !isReschedulingThis && (
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => downloadCalendarEvent(apt)}
                          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 hover:underline"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Exporter agenda (.ics)</span>
                        </button>
                        <span className="text-slate-300">·</span>
                        <button
                          type="button"
                          onClick={() => handlePrintCertificate(apt)}
                          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 hover:underline"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Attestation / Justificatif</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setReschedulingId(apt.id)}
                          className="px-3 py-1 text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors"
                        >
                          Déplacer
                        </button>

                        {cancellingId === apt.id ? (
                          <div className="flex items-center gap-2 bg-rose-50 p-1 rounded-md">
                            <span className="text-[11px] text-rose-700">Confirmer ?</span>
                            <button
                              type="button"
                              onClick={() => handleConfirmCancel(apt.id)}
                              className="px-2 py-0.5 bg-rose-700 text-white text-[11px] font-semibold rounded"
                            >
                              Oui
                            </button>
                            <button
                              type="button"
                              onClick={() => setCancellingId(null)}
                              className="text-[11px] text-slate-500 hover:text-slate-800 px-1"
                            >
                              Non
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setCancellingId(apt.id)}
                            className="px-3 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                          >
                            Annuler
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Besoin d'aide immédiate ? Secrétariat : {CABINET_INFO.phone}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
