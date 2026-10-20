import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BookingWizard } from './components/BookingWizard';
import { MyAppointmentsModal } from './components/MyAppointmentsModal';
import { CabinetProModal } from './components/CabinetProModal';
import { ServicesPricingSection } from './components/ServicesPricingSection';
import { TeamSection } from './components/TeamSection';
import { EmergencySection } from './components/EmergencySection';
import { PracticalInfoSection } from './components/PracticalInfoSection';
import { Footer } from './components/Footer';
import { Appointment } from './types/dental';
import { getStoredAppointments } from './utils/calendarUtils';
import { Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [preselectedReasonId, setPreselectedReasonId] = useState<string | undefined>(undefined);
  const [isMyAppointmentsOpen, setIsMyAppointmentsOpen] = useState(false);
  const [isCabinetProOpen, setIsCabinetProOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const bookingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial fetch from localStorage
    const stored = getStoredAppointments();
    setAppointments(stored);
  }, []);

  const handleStartBooking = (reasonId?: string) => {
    setPreselectedReasonId(reasonId);
    setTimeout(() => {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleAppointmentBooked = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev.filter((a) => a.id !== newApt.id)]);
    setToastMessage(`Rendez-vous ${newApt.referenceCode} confirmé avec succès !`);
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  const activeAppointments = appointments.filter((a) => a.status !== 'cancelled');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        onOpenBooking={() => handleStartBooking()}
        onOpenMyAppointments={() => setIsMyAppointmentsOpen(true)}
        onOpenCabinetPro={() => setIsCabinetProOpen(true)}
        appointmentsCount={activeAppointments.length}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onStartBooking={handleStartBooking}
          onOpenUrgent={() => handleStartBooking('urgence-douleur')}
        />

        {/* Dedicated Booking Section Anchor */}
        <section id="prendre-rdv" ref={bookingRef} className="py-12 px-6 max-w-7xl mx-auto scroll-mt-20">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                Service en ligne 24h/24
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-0.5">
                Prendre rendez-vous en ligne
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsMyAppointmentsOpen(true)}
              className="text-xs font-semibold text-slate-700 hover:text-teal-800 underline self-start sm:self-auto"
            >
              Déjà un rendez-vous ? Consulter ou modifier ma réservation →
            </button>
          </div>

          <BookingWizard
            key={preselectedReasonId || 'default'}
            preselectedReasonId={preselectedReasonId}
            onAppointmentBooked={handleAppointmentBooked}
            existingAppointments={appointments}
          />
        </section>

        {/* Services & Tariffs */}
        <ServicesPricingSection
          onSelectReason={(reasonId) => handleStartBooking(reasonId)}
        />

        {/* Team Section */}
        <TeamSection
          onBookWithDoctor={(docId) => {
            handleStartBooking();
          }}
        />

        {/* Emergency Guidance */}
        <EmergencySection
          onBookEmergency={() => handleStartBooking('urgence-douleur')}
        />

        {/* Practical info & Hours */}
        <PracticalInfoSection />
      </main>

      {/* Patient Appointments Management Modal */}
      <MyAppointmentsModal
        isOpen={isMyAppointmentsOpen}
        onClose={() => setIsMyAppointmentsOpen(false)}
        appointments={appointments}
        onAppointmentsChange={(updated) => setAppointments(updated)}
      />

      {/* Dentist & Medical Secretariat Pro View */}
      <CabinetProModal
        isOpen={isCabinetProOpen}
        onClose={() => setIsCabinetProOpen(false)}
        appointments={appointments}
        onAppointmentsChange={(updated) => setAppointments(updated)}
      />

      {/* Regulatory & Institutional Footer */}
      <Footer
        onOpenBooking={() => handleStartBooking()}
        onOpenMyAppointments={() => setIsMyAppointmentsOpen(true)}
        onOpenCabinetPro={() => setIsCabinetProOpen(true)}
      />
    </div>
  );
}
