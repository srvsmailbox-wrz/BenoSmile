import { CareReason, Practitioner, ToothInfo, Appointment } from '../types/dental';

export const PRACTITIONERS: Practitioner[] = [
  {
    id: 'dr-sarah-alami',
    name: 'Dr. Sarah Alami',
    title: 'Chirurgien-Dentiste',
    specialty: 'Omnipratique & Esthétique du Sourire',
    specialtyKey: 'omnipratique',
    rppsNumber: '10104829103',
    avatarUrl: '/src/assets/images/dentist_doctor_sarah_1792090289541.jpg',
    bio: 'Ancienne Interne des Hôpitaux de Paris, le Dr. Alami est diplômée de la Faculté de Chirurgie Dentaire Paris Cité. Elle privilégie une approche conservatrice et douce, particulièrement adaptée aux patients anxieux et aux soins d’esthétique mini-invasive.',
    diplomas: [
      'Doctorat d’État en Chirurgie Dentaire - Université Paris Cité',
      'D.U. d’Esthétique du Sourire et Céramique Dentaire',
      'Attestation de Formation aux Soins sous MEOPA (Sédation consciente)'
    ],
    conventionSector: 'Secteur 1 (Sans dépassement)',
    availableDays: [1, 2, 3, 4, 5], // Lundi au Vendredi
    experienceYears: 12
  },
  {
    id: 'dr-marc-benhamou',
    name: 'Dr. Marc Benhamou',
    title: 'Chirurgien-Dentiste Spécialiste',
    specialty: 'Implantologie & Parodontie',
    specialtyKey: 'implantologie',
    rppsNumber: '10105748291',
    avatarUrl: '/src/assets/images/dental_technology_chair_1792090290046.jpg',
    bio: 'Spécialisé dans la régénération osseuse et la pose d’implants guidée par ordinateur (Cone Beam 3D). Le Dr. Benhamou prend en charge les réhabilitations orales complexes et les maladies parodontales.',
    diplomas: [
      'Doctorat d’État en Chirurgie Dentaire - Université de Bordeaux',
      'Post-Graduate en Implantologie Orale & Chirurgie Avancée',
      'Certificat d’Études Supérieures (CES) de Parodontologie'
    ],
    conventionSector: 'Secteur 2 (Honoraires maîtrisés)',
    availableDays: [1, 2, 4, 5, 6], // Lundi, Mardi, Jeudi, Vendredi, Samedi
    experienceYears: 16
  },
  {
    id: 'dr-camille-renaud',
    name: 'Dr. Camille Renaud',
    title: 'Orthodontiste & Chirurgien-Dentiste',
    specialty: 'Orthodontie & Aligneurs Invisibles',
    specialtyKey: 'orthodontie',
    rppsNumber: '10106294711',
    avatarUrl: '/src/assets/images/hero_dental_clinic_1792090290304.jpg',
    bio: 'Praticienne certifiée en orthopédie dento-faciale et aligneurs transparents thermoformés. Elle reçoit les enfants pour l’interception précoce et les adultes pour l’alignement discret du sourire.',
    diplomas: [
      'Doctorat en Chirurgie Dentaire - Faculté de Lyon',
      'DU d’Orthodontie Invisible et Biomécanique',
      'Praticien Certifié Invisalign® Platinum Elite'
    ],
    conventionSector: 'Secteur 1 (Sans dépassement)',
    availableDays: [2, 3, 4, 6], // Mardi, Mercredi, Jeudi, Samedi
    experienceYears: 9
  }
];

export const CARE_REASONS: CareReason[] = [
  {
    id: 'bilan-detartrage',
    title: 'Bilan bucco-dentaire & Détartrage',
    category: 'prevention',
    categoryLabel: 'Prévention & Contrôle',
    durationMinutes: 30,
    basePrice: 28.92,
    secuCoveragePercent: 70,
    conventionInfo: 'Conventionné Secteur 1 - Pris en charge Sécurité Sociale + Mutuelle à 100%',
    description: 'Examen complet de la bouche, contrôle de l’état des gencives et de l’émail, détartrage ultrasonique et polissage doux.'
  },
  {
    id: 'urgence-douleur',
    title: 'Urgence dentaire / Douleur aiguë',
    category: 'urgence',
    categoryLabel: 'Urgence prioritaire',
    durationMinutes: 30,
    basePrice: 25.00,
    secuCoveragePercent: 70,
    conventionInfo: 'Tarif conventionné d’urgence - Radio rétro-alvéolaire incluse',
    description: 'Rage de dents, abcès, gonflement, traumatisme ou dent fracturée. Diagnostic immédiat, soulagement de la douleur et prescription.',
    isUrgent: true
  },
  {
    id: 'soin-carie',
    title: 'Traitement d’une carie / Obturation',
    category: 'soins',
    categoryLabel: 'Soins conservateurs',
    durationMinutes: 45,
    basePrice: 42.00,
    secuCoveragePercent: 70,
    conventionInfo: 'Remboursement Sécu + Mutuelle selon barème officiel',
    description: 'Nettoyage minutieux de la lésion carieuse et restauration esthétique en composite nano-hybride teinté à la couleur exacte de votre dent.'
  },
  {
    id: 'bilan-implants',
    title: 'Bilan implantaire & Scanner 3D',
    category: 'chirurgie',
    categoryLabel: 'Chirurgie & Implants',
    durationMinutes: 45,
    basePrice: 60.00,
    secuCoveragePercent: 70,
    conventionInfo: 'Devis détaillé et personnalisé remis lors de la consultation',
    description: 'Examen clinique de faisabilité pour le remplacement d’une ou plusieurs dents manquantes, analyse radiographique 3D Cone-Beam et plan de traitement.'
  },
  {
    id: 'orthodontie-aligneurs',
    title: 'Bilan Orthodontie & Aligneurs transparents',
    category: 'orthodontie',
    categoryLabel: 'Orthodontie',
    durationMinutes: 45,
    basePrice: 35.00,
    secuCoveragePercent: 70,
    conventionInfo: 'Prise en charge Sécu jusqu’à 16 ans / Devis mutuelle adultes',
    description: 'Scan intra-oral 3D haute précision sans pâte à empreinte, simulation numérique de déplacement dentaire et proposition de gouttières discrètes.'
  },
  {
    id: 'eclaircissement-esthetique',
    title: 'Éclaircissement dentaire (Blanchiment)',
    category: 'esthetique',
    categoryLabel: 'Esthétique',
    durationMinutes: 60,
    basePrice: 380.00,
    secuCoveragePercent: 0,
    conventionInfo: 'Acte hors nomenclature (HN) - Bilan préalable obligatoire',
    description: 'Séance sécurisée en cabinet sous lampe LED activatrice, élimination des colorations profondes pour redonner éclat et luminosité naturelle aux dents.'
  },
  {
    id: 'soin-enfant-m-dents',
    title: 'Consultation enfant / Programme M’T Dents',
    category: 'prevention',
    categoryLabel: 'Pédodontie',
    durationMinutes: 30,
    basePrice: 30.00,
    secuCoveragePercent: 100,
    conventionInfo: '100% pris en charge par l’Assurance Maladie sans avance de frais',
    description: 'Examen de prévention pour les enfants et adolescents (3 à 24 ans), scellement des sillons si nécessaire, éducation au brossage.'
  }
];

// Standard FDI Dental Numbering Schema (International ISO 3950 used in France)
export const DENTAL_TEETH_SYSTEM: ToothInfo[] = [
  // Quadrant 1 : Supérieur Droit (18 à 11)
  { number: 18, name: 'Dent de sagesse sup. droite', arch: 'upper', side: 'right', type: 'molaire' },
  { number: 17, name: '2e molaire sup. droite', arch: 'upper', side: 'right', type: 'molaire' },
  { number: 16, name: '1re molaire sup. droite', arch: 'upper', side: 'right', type: 'molaire' },
  { number: 15, name: '2e prémolaire sup. droite', arch: 'upper', side: 'right', type: 'premolaire' },
  { number: 14, name: '1re prémolaire sup. droite', arch: 'upper', side: 'right', type: 'premolaire' },
  { number: 13, name: 'Canine sup. droite', arch: 'upper', side: 'right', type: 'canine' },
  { number: 12, name: 'Incisive latérale sup. droite', arch: 'upper', side: 'right', type: 'incisive' },
  { number: 11, name: 'Incisive centrale sup. droite', arch: 'upper', side: 'right', type: 'incisive' },

  // Quadrant 2 : Supérieur Gauche (21 à 28)
  { number: 21, name: 'Incisive centrale sup. gauche', arch: 'upper', side: 'left', type: 'incisive' },
  { number: 22, name: 'Incisive latérale sup. gauche', arch: 'upper', side: 'left', type: 'incisive' },
  { number: 23, name: 'Canine sup. gauche', arch: 'upper', side: 'left', type: 'canine' },
  { number: 24, name: '1re prémolaire sup. gauche', arch: 'upper', side: 'left', type: 'premolaire' },
  { number: 25, name: '2e prémolaire sup. gauche', arch: 'upper', side: 'left', type: 'premolaire' },
  { number: 26, name: '1re molaire sup. gauche', arch: 'upper', side: 'left', type: 'molaire' },
  { number: 27, name: '2e molaire sup. gauche', arch: 'upper', side: 'left', type: 'molaire' },
  { number: 28, name: 'Dent de sagesse sup. gauche', arch: 'upper', side: 'left', type: 'molaire' },

  // Quadrant 4 : Inférieur Droit (48 à 41)
  { number: 48, name: 'Dent de sagesse inf. droite', arch: 'lower', side: 'right', type: 'molaire' },
  { number: 47, name: '2e molaire inf. droite', arch: 'lower', side: 'right', type: 'molaire' },
  { number: 46, name: '1re molaire inf. droite', arch: 'lower', side: 'right', type: 'molaire' },
  { number: 45, name: '2e prémolaire inf. droite', arch: 'lower', side: 'right', type: 'premolaire' },
  { number: 44, name: '1re prémolaire inf. droite', arch: 'lower', side: 'right', type: 'premolaire' },
  { number: 43, name: 'Canine inf. droite', arch: 'lower', side: 'right', type: 'canine' },
  { number: 42, name: 'Incisive latérale inf. droite', arch: 'lower', side: 'right', type: 'incisive' },
  { number: 41, name: 'Incisive centrale inf. droite', arch: 'lower', side: 'right', type: 'incisive' },

  // Quadrant 3 : Inférieur Gauche (31 à 38)
  { number: 31, name: 'Incisive centrale inf. gauche', arch: 'lower', side: 'left', type: 'incisive' },
  { number: 32, name: 'Incisive latérale inf. gauche', arch: 'lower', side: 'left', type: 'incisive' },
  { number: 33, name: 'Canine inf. gauche', arch: 'lower', side: 'left', type: 'canine' },
  { number: 34, name: '1re prémolaire inf. gauche', arch: 'lower', side: 'left', type: 'premolaire' },
  { number: 35, name: '2e prémolaire inf. gauche', arch: 'lower', side: 'left', type: 'premolaire' },
  { number: 36, name: '1re molaire inf. gauche', arch: 'lower', side: 'left', type: 'molaire' },
  { number: 37, name: '2e molaire inf. gauche', arch: 'lower', side: 'left', type: 'molaire' },
  { number: 38, name: 'Dent de sagesse inf. gauche', arch: 'lower', side: 'left', type: 'molaire' }
];

export const COMMON_SYMPTOMS = [
  'Douleur vive au chaud ou au froid',
  'Douleur pulsatile en continue (rage de dents)',
  'Gencive enflée ou saignements au brossage',
  'Dent ébréchée ou cassée après un choc',
  'Plombage ou composite décollé',
  'Sensibilité à la mastication',
  'Gêne esthétique / Alignement',
  'Mauvaise haleine persistante'
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-sample-01',
    referenceCode: 'LUM-4821',
    practitionerId: 'dr-sarah-alami',
    practitionerName: 'Dr. Sarah Alami',
    reasonId: 'bilan-detartrage',
    reasonTitle: 'Bilan bucco-dentaire & Détartrage',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // dans 2 jours
    time: '10:30',
    durationMinutes: 30,
    patientInfo: {
      civility: 'M.',
      firstName: 'Thomas',
      lastName: 'Dubois',
      email: 'thomas.dubois@email.fr',
      phone: '06 12 34 56 78',
      birthDate: '1989-06-14',
      isNewPatient: false,
      socialSecurityNumber: '1 89 06 75 104 234 12',
      medicalAlerts: []
    },
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    priceEstimate: 28.92
  },
  {
    id: 'apt-sample-02',
    referenceCode: 'LUM-9124',
    practitionerId: 'dr-marc-benhamou',
    practitionerName: 'Dr. Marc Benhamou',
    reasonId: 'bilan-implants',
    reasonTitle: 'Bilan implantaire & Scanner 3D',
    date: new Date().toISOString().split('T')[0], // Aujourd'hui
    time: '14:00',
    durationMinutes: 45,
    patientInfo: {
      civility: 'Mme',
      firstName: 'Hélène',
      lastName: 'Moreau',
      email: 'helene.moreau@email.fr',
      phone: '06 98 76 54 32',
      birthDate: '1974-11-20',
      isNewPatient: true,
      medicalAlerts: ['Allergie Pénicilline', 'Sous anticoagulants légers']
    },
    selectedTooth: 36,
    selectedToothName: '1re molaire inf. gauche (Dent 36)',
    status: 'waiting_room',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    priceEstimate: 60.00
  },
  {
    id: 'apt-sample-03',
    referenceCode: 'LUM-7650',
    practitionerId: 'dr-camille-renaud',
    practitionerName: 'Dr. Camille Renaud',
    reasonId: 'orthodontie-aligneurs',
    reasonTitle: 'Bilan Orthodontie & Aligneurs transparents',
    date: new Date().toISOString().split('T')[0], // Aujourd'hui
    time: '15:30',
    durationMinutes: 45,
    patientInfo: {
      civility: 'Mme',
      firstName: 'Léa',
      lastName: 'Girard',
      email: 'lea.girard@email.fr',
      phone: '07 65 43 21 09',
      birthDate: '2001-04-18',
      isNewPatient: true,
      medicalAlerts: []
    },
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    priceEstimate: 35.00
  }
];

export const CABINET_INFO = {
  name: 'Cabinet Dentaire Lumina',
  address: '142 Avenue de Wagram, 75017 Paris',
  metro: 'Métro Ligne 3 (Wagram ou Pereire) · RER C (Pereire-Levallois)',
  bus: 'Bus 31, 84, 92, 93',
  parking: 'Parking public sécurisé Indigo Jouffroy d’Abbans (à 80 mètres)',
  pmrAccess: 'Établissement ERP aux normes PMR (Ascenseur large & rampe d’accès)',
  phone: '01 42 68 90 20',
  emergencyPhone: '01 42 68 90 29 (Ligne directe Urgences)',
  email: 'contact@dentaire-lumina.fr',
  hours: [
    { days: 'Du Lundi au Vendredi', times: '08h30 – 19h30 sans interruption' },
    { days: 'Samedi', times: '09h00 – 14h00 (Urgences & Orthodontie)' },
    { days: 'Dimanche & Jours fériés', times: 'Fermé (Contacter le 15 ou service de garde)' }
  ],
  certifications: [
    'Conventionné Assurance Maladie (Carte Vitale acceptée)',
    'Tiers-Payant Mutuelle & CMU / C2S',
    'Plateau Technique Stérilisation Norme EN 13060 Classe B',
    'Radiographie 3D Cone-Beam & Scanner Intra-Oral Trios®'
  ]
};
