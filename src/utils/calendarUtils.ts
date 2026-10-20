import { Appointment, DaySchedule, TimeSlot } from '../types/dental';
import { INITIAL_APPOINTMENTS, PRACTITIONERS } from '../data/dentalData';

const STORAGE_KEY = 'lumina_dental_appointments_v1';

export function getStoredAppointments(): Appointment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPOINTMENTS));
      return INITIAL_APPOINTMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_APPOINTMENTS;
  }
}

export function saveAppointment(appointment: Appointment): Appointment[] {
  const current = getStoredAppointments();
  const exists = current.some((a) => a.id === appointment.id);
  const updated = exists 
    ? current.map((a) => (a.id === appointment.id ? appointment : a))
    : [appointment, ...current];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function cancelStoredAppointment(id: string): Appointment[] {
  const current = getStoredAppointments();
  const updated = current.map((a) => (a.id === id ? { ...a, status: 'cancelled' as const } : a));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function updateAppointmentStatus(id: string, status: Appointment['status']): Appointment[] {
  const current = getStoredAppointments();
  const updated = current.map((a) => (a.id === id ? { ...a, status } : a));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

// Generate the next 14 days starting today or tomorrow
export function getUpcomingDays(count = 14): DaySchedule[] {
  const days: DaySchedule[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);

    // Skip Sundays (0)
    if (d.getDay() === 0) continue;

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const weekdayStr = d.toLocaleDateString('fr-FR', { weekday: 'short' });
    const capitalizedDay = weekdayStr.charAt(0).toUpperCase() + weekdayStr.slice(1);
    const dayMonthStr = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

    days.push({
      date: dateStr,
      displayDay: capitalizedDay,
      displayDate: dayMonthStr,
      availableSlotsCount: d.getDay() === 6 ? 6 : 14,
      isToday: i === 0
    });
  }

  return days;
}

// Standard daily slots generator
export function getSlotsForDateAndDoctor(
  dateStr: string,
  practitionerId: string | 'any',
  existingAppointments: Appointment[]
): { morning: TimeSlot[]; afternoon: TimeSlot[] } {
  const dateObj = new Date(dateStr);
  const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 6 is Saturday

  // If Sunday, closed
  if (dayOfWeek === 0) {
    return { morning: [], afternoon: [] };
  }

  // Base slot times
  const morningTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00'];
  const afternoonTimes = dayOfWeek === 6 
    ? ['12:30', '13:00', '13:30'] 
    : ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'];

  // Check doctors available for this day
  const activeDoctors = practitionerId === 'any'
    ? PRACTITIONERS.filter((p) => p.availableDays.includes(dayOfWeek))
    : PRACTITIONERS.filter((p) => p.id === practitionerId && p.availableDays.includes(dayOfWeek));

  const formatSlot = (time: string): TimeSlot => {
    // Check if slot is already occupied
    const isOccupied = existingAppointments.some((apt) => {
      if (apt.date !== dateStr) return false;
      if (apt.status === 'cancelled') return false;
      if (apt.time !== time) return false;
      if (practitionerId !== 'any' && apt.practitionerId !== practitionerId) return false;
      return true;
    });

    const isPastToday = (() => {
      const today = new Date();
      const isToday = dateStr === today.toISOString().split('T')[0];
      if (!isToday) return false;
      const [h, m] = time.split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(h, m, 0, 0);
      return slotTime < today;
    })();

    const hasDoctorAvailable = activeDoctors.length > 0;
    const isAvailable = !isOccupied && !isPastToday && hasDoctorAvailable;

    return {
      time,
      practitionerId: activeDoctors[0]?.id || 'dr-sarah-alami',
      isAvailable
    };
  };

  return {
    morning: morningTimes.map(formatSlot),
    afternoon: afternoonTimes.map(formatSlot)
  };
}

export function formatFrenchDate(dateStr: string): string {
  if (!dateStr) return '';
  const [yyyy, mm, dd] = dateStr.split('-').map(Number);
  const d = new Date(yyyy, mm - 1, dd);
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// Generates and triggers download of a real .ics calendar file
export function downloadCalendarEvent(appointment: Appointment) {
  const [year, month, day] = appointment.date.split('-').map(Number);
  const [hours, minutes] = appointment.time.split(':').map(Number);

  const start = new Date(Date.UTC(year, month - 1, day, hours - 2, minutes)); // Approximate UTC offset
  const end = new Date(start.getTime() + appointment.durationMinutes * 60000);

  const pad = (n: number) => String(n).padStart(2, '0');
  const formatIcsDate = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cabinet Dentaire Lumina//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${appointment.id}@dentaire-lumina.fr`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:Rendez-vous dentiste - ${appointment.reasonTitle}`,
    `DESCRIPTION:Rendez-vous avec ${appointment.practitionerName} au Cabinet Dentaire Lumina.\\nRéf: ${appointment.referenceCode}\\nAccès: 142 Avenue de Wagram, 75017 Paris\\nPensez à vous munir de votre Carte Vitale et de votre attestation mutuelle.`,
    'LOCATION:Cabinet Dentaire Lumina, 142 Avenue de Wagram, 75017 Paris',
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Rappel de votre rendez-vous dentiste dans 2 heures',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `RDV-Dentiste-${appointment.referenceCode}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
