import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  User, 
  MapPin, 
  AlertCircle, 
  Download,
  CalendarPlus,
  Stethoscope,
  Smile
} from 'lucide-react';
import { CARE_REASONS, PRACTITIONERS, CABINET_INFO } from '../data/dentalData';
import { CareReason, Practitioner, PatientInfo, Appointment, ToothInfo } from '../types/dental';
import { 
  getUpcomingDays, 
  getSlotsForDateAndDoctor, 
  formatFrenchDate, 
  saveAppointment, 
  downloadCalendarEvent 
} from '../utils/calendarUtils';
import { InteractiveToothMap } from './InteractiveToothMap';

interface BookingWizardProps {
  onAppointmentBooked: (appointment: Appointment) => void;
  preselectedReasonId?: string;
  onCancel?: () => void;
  existingAppointments: Appointment[];
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  onAppointmentBooked,
  preselectedReasonId,
  onCancel,
  existingAppointments
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Care Reason & Tooth Map
  const [selectedReason, setSelectedReason] = useState<CareReason>(() => {
    return CARE_REASONS.find((r) => r.id === preselectedReasonId) || CARE_REASONS[0];
  });
  const [showToothMap, setShowToothMap] = useState<boolean>(false);
  const [selectedTooth, setSelectedTooth] = useState<ToothInfo | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  // Step 2: Practitioner
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('any');

  // Step 3: Date & Slot
  const upcomingDays = getUpcomingDays(14);
  const [selectedDate, setSelectedDate] = useState<string>(upcomingDays[0]?.date || '');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Step 4: Patient details
  const [patientData, setPatientData] = useState<PatientInfo>({
    civility: 'Mme',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    isNewPatient: true,
    socialSecurityNumber: '',
    medicalAlerts: [],
    notes: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Step 5: Confirmed appointment state
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [smsSentNotice, setSmsSentNotice] = useState<boolean>(true);

  // Computed slots for selected date & doctor
  const slots = getSlotsForDateAndDoctor(selectedDate, selectedDoctorId, existingAppointments);

  const selectedDoctor = PRACTITIONERS.find((p) => p.id === selectedDoctorId);

  const handleToggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleToggleMedicalAlert = (alertItem: string) => {
    setPatientData((prev) => {
      const current = prev.medicalAlerts || [];
      const updated = current.includes(alertItem)
        ? current.filter((a) => a !== alertItem)
        : [...current, alertItem];
      return { ...prev, medicalAlerts: updated };
    });
  };

  const validateStep4 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!patientData.firstName.trim()) errors.firstName = 'Veuillez saisir votre prénom';
    if (!patientData.lastName.trim()) errors.lastName = 'Veuillez saisir votre nom';
    if (!patientData.phone.trim()) {
      errors.phone = 'Numéro de téléphone requis';
    } else if (!/^[0-9+ \-.]{8,15}$/.test(patientData.phone.trim())) {
      errors.phone = 'Numéro de téléphone invalide';
    }
    if (!patientData.email.trim()) {
      errors.email = 'Adresse email requise';
    } else if (!/\S+@\S+\.\S+/.test(patientData.email)) {
      errors.email = 'Format d’email invalide';
    }
    if (!patientData.birthDate) {
      errors.birthDate = 'Date de naissance requise';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmBooking = () => {
    if (!validateStep4()) return;

    // Pick practitioner name
    let finalDocName = 'Dr. Sarah Alami';
    let finalDocId = 'dr-sarah-alami';

    if (selectedDoctorId !== 'any' && selectedDoctor) {
      finalDocName = selectedDoctor.name;
      finalDocId = selectedDoctor.id;
    } else {
      // Automatic assignment to first available
      finalDocName = 'Dr. Sarah Alami';
      finalDocId = 'dr-sarah-alami';
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      referenceCode: `LUM-${randomSuffix}`,
      practitionerId: finalDocId,
      practitionerName: finalDocName,
      reasonId: selectedReason.id,
      reasonTitle: selectedReason.title,
      date: selectedDate,
      time: selectedTime,
      durationMinutes: selectedReason.durationMinutes,
      patientInfo: { ...patientData },
      selectedTooth: selectedTooth?.number,
      selectedToothName: selectedTooth ? `${selectedTooth.number} - ${selectedTooth.name}` : undefined,
      symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : undefined,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      priceEstimate: selectedReason.basePrice
    };

    saveAppointment(newAppointment);
    setConfirmedAppointment(newAppointment);
    onAppointmentBooked(newAppointment);
    setCurrentStep(5);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Stepper Progress Bar */}
      <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {[
            { step: 1, label: 'Motif' },
            { step: 2, label: 'Praticien' },
            { step: 3, label: 'Créneau' },
            { step: 4, label: 'Coordonnées' },
            { step: 5, label: 'Confirmation' }
          ].map((item, idx) => {
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;
            return (
              <React.Fragment key={item.step}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                      isCompleted
                        ? 'bg-teal-700 text-white'
                        : isCurrent
                        ? 'bg-slate-900 text-white ring-2 ring-slate-900/10'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? '✓' : item.step}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:inline ${
                      isCurrent ? 'text-slate-900 font-semibold' : 'text-slate-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {idx < 4 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 sm:mx-3 transition-colors ${
                      currentStep > item.step ? 'bg-teal-600' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="p-6 sm:p-8 max-w-4xl mx-auto">
        {/* ==================== STEP 1: CARE REASON ==================== */}
        {currentStep === 1 && (
          <div>
            <div className="mb-6">
              <span className="text-xs font-medium text-teal-700 uppercase tracking-wider">
                Étape 1 sur 4
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
                Choisissez le motif de votre consultation
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Sélectionnez l’acte pour adapter la durée de votre rendez-vous et préparer le matériel adapté.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-6">
              {CARE_REASONS.map((reason) => {
                const isSelected = selectedReason.id === reason.id;
                return (
                  <button
                    key={reason.id}
                    type="button"
                    onClick={() => setSelectedReason(reason)}
                    className={`text-left p-4 rounded-xl border transition-all relative ${
                      isSelected
                        ? 'border-teal-700 bg-teal-50/40 ring-1 ring-teal-700 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-medium text-teal-800">
                            {reason.categoryLabel}
                          </span>
                          {reason.isUrgent && (
                            <span className="text-[11px] font-semibold text-rose-600">
                              · Priorité Urgence
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                          {reason.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {reason.description}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-semibold text-slate-900 font-mono">
                          {reason.basePrice > 0 ? `${reason.basePrice.toFixed(2)} €` : 'Sur devis'}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3 inline text-slate-400" />
                          <span>{reason.durationMinutes} min</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="truncate">{reason.conventionInfo}</span>
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                        isSelected ? 'bg-teal-700 border-teal-700 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && '✓'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Optional Tooth & Symptom mapper toggle */}
            <div className="mb-8">
              <button
                type="button"
                onClick={() => setShowToothMap(!showToothMap)}
                className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Smile className="w-4 h-4 text-teal-700" />
                  <span className="text-xs font-semibold text-slate-800">
                    {showToothMap ? 'Masquer le schéma dentaire interactif' : 'Préciser une dent douloureuse ou un symptôme particulier ? (Optionnel)'}
                  </span>
                </div>
                <span className="text-xs font-medium text-teal-700">
                  {showToothMap ? 'Fermer' : 'Ouvrir l’odontogramme'}
                </span>
              </button>

              {showToothMap && (
                <InteractiveToothMap
                  selectedToothNumber={selectedTooth?.number}
                  onSelectTooth={(tooth) => setSelectedTooth(tooth)}
                  selectedSymptoms={selectedSymptoms}
                  onToggleSymptom={handleToggleSymptom}
                />
              )}
            </div>

            {/* Step 1 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {onCancel ? (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Annuler
                </button>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ml-auto shadow-xs"
              >
                <span>Continuer vers le choix du praticien</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ==================== STEP 2: PRACTITIONER ==================== */}
        {currentStep === 2 && (
          <div>
            <div className="mb-6">
              <span className="text-xs font-medium text-teal-700 uppercase tracking-wider">
                Étape 2 sur 4
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
                Choisissez votre praticien
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Tous les praticiens du cabinet partagent le même dossier médical sécurisé et les mêmes normes d’hygiène.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {/* Option: Any doctor */}
              <button
                type="button"
                onClick={() => setSelectedDoctorId('any')}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                  selectedDoctorId === 'any'
                    ? 'border-teal-700 bg-teal-50/40 ring-1 ring-teal-700 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      Premier praticien disponible
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Recommandé pour obtenir un créneau plus rapide ou en cas d’urgence
                    </p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  selectedDoctorId === 'any' ? 'bg-teal-700 border-teal-700 text-white text-xs' : 'border-slate-300'
                }`}>
                  {selectedDoctorId === 'any' && '✓'}
                </div>
              </button>

              {/* Individual doctors */}
              {PRACTITIONERS.map((doc) => {
                const isSelected = selectedDoctorId === doc.id;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDoctorId(doc.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSelected
                        ? 'border-teal-700 bg-teal-50/40 ring-1 ring-teal-700 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <img
                        src={doc.avatarUrl}
                        alt={doc.name}
                        referrerPolicy="no-referrer"
                        className="w-13 h-13 rounded-full object-cover border border-slate-200 shrink-0 bg-slate-100"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-slate-900">{doc.name}</h4>
                          <span className="text-[11px] text-slate-500">· {doc.conventionSector}</span>
                        </div>
                        <p className="text-xs font-medium text-teal-800 mt-0.5">{doc.specialty}</p>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 max-w-xl">
                          {doc.bio}
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 self-end sm:self-center ${
                      isSelected ? 'bg-teal-700 border-teal-700 text-white text-xs' : 'border-slate-300'
                    }`}>
                      {isSelected && '✓'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Step 2 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour au motif</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
              >
                <span>Choisir la date et l’horaire</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ==================== STEP 3: DATE & SLOT ==================== */}
        {currentStep === 3 && (
          <div>
            <div className="mb-6">
              <span className="text-xs font-medium text-teal-700 uppercase tracking-wider">
                Étape 3 sur 4
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
                Choisissez votre créneau horaire
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Consultation avec{' '}
                <span className="font-semibold text-slate-900">
                  {selectedDoctor ? selectedDoctor.name : 'Le premier praticien disponible'}
                </span>{' '}
                pour <span className="font-semibold text-slate-900">{selectedReason.title}</span> ({selectedReason.durationMinutes} min).
              </p>
            </div>

            {/* Date selection bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-teal-700" />
                  <span>Prochains jours disponibles au cabinet</span>
                </label>
                <span className="text-[11px] text-slate-500">
                  Date sélectionnée : <strong className="text-slate-800">{formatFrenchDate(selectedDate)}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {upcomingDays.map((day) => {
                  const isDaySelected = selectedDate === day.date;
                  return (
                    <button
                      key={day.date}
                      type="button"
                      onClick={() => {
                        setSelectedDate(day.date);
                        setSelectedTime(''); // reset slot when day changes
                      }}
                      className={`flex-shrink-0 w-20 py-2.5 px-2 rounded-xl border text-center transition-all ${
                        isDaySelected
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className={`block text-[11px] font-medium uppercase ${isDaySelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {day.isToday ? 'Auj.' : day.displayDay}
                      </span>
                      <span className="block text-sm font-bold font-mono my-0.5">
                        {day.displayDate}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots Area */}
            <div className="bg-slate-50/60 rounded-xl border border-slate-200 p-5 mb-8">
              {/* Morning Slots */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <span>Matinée (09h00 - 12h30)</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {slots.morning.filter((s) => s.isAvailable).length} créneaux libres
                  </span>
                </div>
                {slots.morning.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {slots.morning.map((slot) => {
                      const isSlotSelected = selectedTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.isAvailable}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`py-2 px-1 rounded-lg text-xs font-mono font-medium border text-center transition-all ${
                            isSlotSelected
                              ? 'bg-teal-700 text-white border-teal-700 ring-2 ring-teal-600/30'
                              : slot.isAvailable
                              ? 'bg-white hover:bg-teal-50 text-slate-900 border-slate-200 hover:border-teal-600'
                              : 'bg-slate-100 text-slate-300 border-transparent cursor-not-allowed line-through'
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Aucun créneau ce matin.</p>
                )}
              </div>

              {/* Afternoon Slots */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <span>Après-midi (14h00 - 19h00)</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {slots.afternoon.filter((s) => s.isAvailable).length} créneaux libres
                  </span>
                </div>
                {slots.afternoon.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {slots.afternoon.map((slot) => {
                      const isSlotSelected = selectedTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.isAvailable}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`py-2 px-1 rounded-lg text-xs font-mono font-medium border text-center transition-all ${
                            isSlotSelected
                              ? 'bg-teal-700 text-white border-teal-700 ring-2 ring-teal-600/30'
                              : slot.isAvailable
                              ? 'bg-white hover:bg-teal-50 text-slate-900 border-slate-200 hover:border-teal-600'
                              : 'bg-slate-100 text-slate-300 border-transparent cursor-not-allowed line-through'
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Cabinet fermé l’après-midi ce jour.</p>
                )}
              </div>

              {selectedTime && (
                <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-teal-900 bg-teal-50/70 -mx-5 -mb-5 p-4 rounded-b-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-700" />
                    <span>
                      Créneau retenu : <strong>{formatFrenchDate(selectedDate)} à {selectedTime}</strong>
                    </span>
                  </div>
                  <span className="font-semibold text-slate-900">Durée : {selectedReason.durationMinutes} min</span>
                </div>
              )}
            </div>

            {/* Step 3 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour au praticien</span>
              </button>
              <button
                type="button"
                disabled={!selectedTime}
                onClick={() => setCurrentStep(4)}
                className={`px-6 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs ${
                  selectedTime
                    ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Renseigner mes informations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ==================== STEP 4: PATIENT INFO ==================== */}
        {currentStep === 4 && (
          <div>
            <div className="mb-6">
              <span className="text-xs font-medium text-teal-700 uppercase tracking-wider">
                Étape 4 sur 4
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
                Informations du patient
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Vos données sont strictement protégées et transmises au secrétariat médical selon le secret professionnel (RGPD Santé).
              </p>
            </div>

            {/* Patient status selector */}
            <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-semibold text-slate-800 mb-2">
                Avez-vous déjà consulté au Cabinet Dentaire Lumina ?
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPatientData({ ...patientData, isNewPatient: true })}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                    patientData.isNewPatient
                      ? 'bg-white border-slate-900 text-slate-900 shadow-xs font-semibold'
                      : 'bg-transparent border-slate-200 text-slate-600'
                  }`}
                >
                  Nouveau patient (Première visite)
                </button>
                <button
                  type="button"
                  onClick={() => setPatientData({ ...patientData, isNewPatient: false })}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                    !patientData.isNewPatient
                      ? 'bg-white border-slate-900 text-slate-900 shadow-xs font-semibold'
                      : 'bg-transparent border-slate-200 text-slate-600'
                  }`}
                >
                  Déjà patient du cabinet
                </button>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {/* Civility, First Name, Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Civilité</label>
                  <select
                    value={patientData.civility}
                    onChange={(e) => setPatientData({ ...patientData, civility: e.target.value as 'M.' | 'Mme' })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                  >
                    <option value="Mme">Mme</option>
                    <option value="M.">M.</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={patientData.firstName}
                    placeholder="Ex: Sophie"
                    onChange={(e) => setPatientData({ ...patientData, firstName: e.target.value })}
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 ${
                      formErrors.firstName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.firstName && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.firstName}</span>
                  )}
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nom de famille *
                  </label>
                  <input
                    type="text"
                    value={patientData.lastName}
                    placeholder="Ex: Martin"
                    onChange={(e) => setPatientData({ ...patientData, lastName: e.target.value })}
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 ${
                      formErrors.lastName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.lastName && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.lastName}</span>
                  )}
                </div>
              </div>

              {/* Phone, Email, BirthDate */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Numéro de téléphone portable *
                  </label>
                  <input
                    type="tel"
                    value={patientData.phone}
                    placeholder="06 12 34 56 78"
                    onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 font-mono ${
                      formErrors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                    }`}
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Pour le SMS de confirmation et de rappel
                  </span>
                  {formErrors.phone && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.phone}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Adresse email *
                  </label>
                  <input
                    type="email"
                    value={patientData.email}
                    placeholder="sophie.martin@email.fr"
                    onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 ${
                      formErrors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.email && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.email}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Date de naissance *
                  </label>
                  <input
                    type="date"
                    value={patientData.birthDate}
                    onChange={(e) => setPatientData({ ...patientData, birthDate: e.target.value })}
                    className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 ${
                      formErrors.birthDate ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.birthDate && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.birthDate}</span>
                  )}
                </div>
              </div>

              {/* Optional Social Security Number */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Numéro de Sécurité Sociale (Optionnel - pour télétransmission Carte Vitale)
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={patientData.socialSecurityNumber || ''}
                  placeholder="1 89 06 75 104 234 12"
                  onChange={(e) => setPatientData({ ...patientData, socialSecurityNumber: e.target.value })}
                  className="w-full sm:w-1/2 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 font-mono"
                />
              </div>

              {/* Medical safety checklist */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Antécédents ou situations médicales particulières (sélectionnez si concerné) :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    'Allergie Pénicilline / Latex',
                    'Traitement Anticoagulant',
                    'Femme enceinte',
                    'Diabète / Suivi cardiaque',
                    'Forte anxiété dentaire (Phobie)',
                    'Porteur de stimulateur (Pacemaker)'
                  ].map((alertItem) => {
                    const isChecked = patientData.medicalAlerts?.includes(alertItem);
                    return (
                      <button
                        key={alertItem}
                        type="button"
                        onClick={() => handleToggleMedicalAlert(alertItem)}
                        className={`text-left text-xs p-2.5 rounded-lg border transition-colors flex items-center gap-2 ${
                          isChecked
                            ? 'border-amber-400 bg-amber-50 text-amber-950 font-medium'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] shrink-0 ${
                          isChecked ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300'
                        }`}>
                          {isChecked && '✓'}
                        </span>
                        <span className="truncate">{alertItem}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Commentaire ou précision pour l’équipe soignante (optionnel)
                </label>
                <textarea
                  rows={2}
                  value={patientData.notes || ''}
                  placeholder="Ex : J’ai un bridge qui bouge, ou je souhaite grouper avec un détartrage..."
                  onChange={(e) => setPatientData({ ...patientData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
            </div>

            {/* Step 4 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour au créneau</span>
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="px-7 py-3 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmer mon rendez-vous</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== STEP 5: CONFIRMATION ==================== */}
        {currentStep === 5 && confirmedAppointment && (
          <div>
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="w-14 h-14 bg-teal-50 text-teal-700 border border-teal-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-xs font-mono font-bold text-teal-800 tracking-wider">
                RÉFÉRENCE : {confirmedAppointment.referenceCode}
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
                Votre rendez-vous est confirmé !
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Un e-mail de confirmation détaillé et un SMS récapitulatif viennent d’être envoyés à{' '}
                <strong className="text-slate-900">{confirmedAppointment.patientInfo.email}</strong>.
              </p>
            </div>

            {/* SMS Notification Banner Simulation */}
            {smsSentNotice && (
              <div className="bg-slate-900 text-white rounded-xl p-4 mb-6 flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-teal-600 text-white flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                    SMS
                  </div>
                  <div>
                    <span className="font-semibold text-teal-300">Notification automatique Cabinet Lumina</span>
                    <p className="text-slate-300 mt-0.5 leading-relaxed">
                      "Bonjour {confirmedAppointment.patientInfo.firstName}, RDV confirmé le {formatFrenchDate(confirmedAppointment.date)} à {confirmedAppointment.time} avec {confirmedAppointment.practitionerName} au 142 Av de Wagram 75017 Paris. Un SMS de rappel vous sera envoyé la veille."
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSmsSentNotice(false)}
                  className="text-slate-400 hover:text-white text-xs shrink-0"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Appointment Recap Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[11px] text-slate-400 font-medium">Date & Heure</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-teal-700" />
                    <span>{formatFrenchDate(confirmedAppointment.date)} à {confirmedAppointment.time}</span>
                  </div>
                  <span className="text-xs text-slate-500">Durée prévue : {confirmedAppointment.durationMinutes} minutes</span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 font-medium">Praticien</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-teal-700" />
                    <span>{confirmedAppointment.practitionerName}</span>
                  </div>
                  <span className="text-xs text-slate-500">Chirurgien-Dentiste conventionné</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 font-medium">Motif & Acte</span>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">
                    {confirmedAppointment.reasonTitle}
                  </div>
                  {confirmedAppointment.selectedToothName && (
                    <span className="text-xs text-teal-800 font-medium block mt-0.5">
                      Dent ciblée : {confirmedAppointment.selectedToothName}
                    </span>
                  )}
                  {confirmedAppointment.symptoms && confirmedAppointment.symptoms.length > 0 && (
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Symptômes signalés : {confirmedAppointment.symptoms.join(', ')}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 font-medium">Lieu de consultation</span>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>{CABINET_INFO.address}</span>
                  </div>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    {CABINET_INFO.metro}
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist: What to bring */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 mb-6">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>Documents indispensables le jour de votre visite :</span>
              </h4>
              <ul className="text-xs text-amber-950 space-y-1">
                <li>• Votre <strong>Carte Vitale à jour</strong> (ou attestation papier de droits)</li>
                <li>• Votre <strong>carte de mutuelle</strong> / complémentaire santé en cours de validité</li>
                <li>• Vos <strong>radiographies panoramiques récentes</strong> (si vous en possédez)</li>
                <li>• La liste de vos <strong>traitements médicaux en cours</strong> (notamment fluidifiants sanguins)</li>
              </ul>
            </div>

            {/* Action buttons: Download .ics calendar file, view appointments */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => downloadCalendarEvent(confirmedAppointment)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Ajouter à mon agenda (.ICS Google / Apple / Outlook)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  setConfirmedAppointment(null);
                  setSelectedTime('');
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                Prendre un autre rendez-vous
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
