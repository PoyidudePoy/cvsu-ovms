export const STORAGE_KEY = "cvsu_ovms_react_v1";

export const DESK_OFFICERS = [
  "Ms. A. Mendoza — Admin Lobby Desk",
  "SG R. Villanueva — Main Gate Post 1",
  "Mr. J. Dela Cruz — Registrar Front Desk",
];

export const WATCHLIST = [
  {
    name: "blocked visitor",
    id: "ID-0000",
    reason: "Campus Security Advisory #2025-14 (Unauthorized Solicitation)",
  },
  {
    name: "carlos mendiola",
    id: "DL-0099",
    reason: "Unresolved Gate Clearance Hold — Civil Security Office",
  },
];

export const CVSU_OFFICES = [
  {
    id: "REG",
    name: "Office of the University Registrar",
    building: "Admin Bldg. Ground Floor",
    contact: "Ms. L. Bautista (Registrar II)",
    status: "Peak Queue",
  },
  {
    id: "OSAS",
    name: "Office of Student Affairs & Services (OSAS)",
    building: "Student Union Bldg.",
    contact: "Dr. R. Pangilinan",
    status: "Open",
  },
  {
    id: "ADM",
    name: "Office of Admission & Testing",
    building: "Old Admin Annex",
    contact: "Mr. P. Villanueva",
    status: "Open",
  },
  {
    id: "CEIT",
    name: "CEIT — Dean's Office",
    building: "CEIT Bldg. 2nd Floor",
    contact: "Engr. M. Hernandez",
    status: "Open",
  },
  {
    id: "CASH",
    name: "Cashier & Accounting Office",
    building: "Admin Bldg. Window 1–4",
    contact: "Mrs. C. Magno",
    status: "Peak Queue",
  },
  {
    id: "PRES",
    name: "Office of the University President",
    building: "Admin Bldg. 2nd Floor",
    contact: "Exec. Sec. T. Alcaraz",
    status: "Open",
  },
  {
    id: "CSO",
    name: "Civil Security & Campus Safety Office",
    building: "Main Gatehouse",
    contact: "Chief D. Ramos",
    status: "Open",
  },
];

export const QUICK_PURPOSES = [
  { label: "TOR / Diploma", value: "Transcript / Diploma Claiming" },
  { label: "Admission Inquiry", value: "Admission & Entrance Exam Inquiry" },
  { label: "Cashier / Payment", value: "Tuition / Assessment Payment" },
  { label: "Dean Consultation", value: "Student Consultation / Dean's Office" },
  { label: "Delivery", value: "Supply / Equipment Delivery" },
];

const minsAgo = (m) => new Date(Date.now() - m * 60000).toISOString();
export const minsFromNow = (m) => new Date(Date.now() + m * 60000).toISOString();

export function getInitialState() {
  return {
    nextTagNum: 47,
    selectedVisitorId: "VIS-101",
    visitors: [
      {
        id: "VIS-101",
        tag: "TAG-042",
        name: "Clarissa D. Evangelista",
        org: "Parent of BSCS-3B Student",
        phone: "0917-442-8190",
        category: "Parent / Guardian",
        idType: "PhilSys National ID",
        idNumber: "PHL-8834",
        custody: "Held at Desk (Tag Issued)",
        office: "Office of Student Affairs & Services (OSAS)",
        host: "Dr. R. Pangilinan",
        purpose: "Scholarship Renewal & Good Moral Certificate Inquiry",
        items: "Handbag, Folder",
        plate: "",
        escort: false,
        timeIn: minsAgo(25),
        dueAt: minsFromNow(35),
        timeOut: null,
        status: "checked_in",
        notes: ["Valid PhilSys ID secured in Gatehouse Slot #42."],
      },
      {
        id: "VIS-102",
        tag: "TAG-043",
        name: "Engr. Mateo Soriano",
        org: "AACCUP Accreditation Team",
        phone: "0918-902-1124",
        category: "Official / CHED / Accreditor",
        idType: "PRC / Gov Employee ID",
        idNumber: "PRC-3319",
        custody: "Verified & Returned",
        office: "CEIT — Dean's Office",
        host: "Engr. M. Hernandez",
        purpose: "Engineering Laboratory Facilities Inspection",
        items: "Laptop, Evaluation Binder",
        plate: "NAV-5520",
        escort: true,
        timeIn: minsAgo(48),
        dueAt: minsFromNow(72),
        timeOut: null,
        status: "checked_in",
        notes: ["Escorted by CEIT Faculty Representative."],
      },
      {
        id: "VIS-103",
        tag: "TAG-044",
        name: "Jerome P. Macapagal",
        org: "Office Supply Courier",
        phone: "0926-771-0933",
        category: "Vendor / Delivery",
        idType: "Driver's License",
        idNumber: "LTO-6102",
        custody: "Held at Desk (Tag Issued)",
        office: "Office of the University Registrar",
        host: "Ms. L. Bautista (Registrar II)",
        purpose: "Delivery of 10 Boxes Official Security Paper",
        items: "10 Sealed Cartons (Delivery Receipt #884)",
        plate: "CBE-9012",
        escort: false,
        timeIn: minsAgo(75),
        dueAt: minsAgo(15), // Overdue
        timeOut: null,
        status: "checked_in",
        notes: ["Delivery vehicle parked at Admin Loading Bay."],
      },
      {
        id: "VIS-104",
        tag: "TAG-041",
        name: "Nathaniel R. Aquino",
        org: "CvSU Batch 2019 Alumnus",
        phone: "0915-204-8821",
        category: "Alumni",
        idType: "UMID / SSS / GSIS",
        idNumber: "UMD-4490",
        custody: "Verified & Returned",
        office: "Office of the University Registrar",
        host: "Window 3 — Records",
        purpose: "Claiming Authenticated Diploma & CAV",
        items: "Document Envelope",
        plate: "",
        escort: false,
        timeIn: minsAgo(135),
        dueAt: minsAgo(75),
        timeOut: minsAgo(82),
        status: "checked_out",
        notes: ["Tag returned and ID claimed."],
      },
      {
        id: "VIS-105",
        tag: "TAG-045",
        name: "Katrina Mae Tolentino",
        org: "SHS Graduate — Tanza NHS",
        phone: "0995-318-4402",
        category: "Prospective Student",
        idType: "School / Company ID",
        idNumber: "TNHS-204",
        custody: "Held at Desk (Tag Issued)",
        office: "Office of Admission & Testing",
        host: "Mr. P. Villanueva",
        purpose: "CvSU College Entrance Exam Schedule Verification",
        items: "Backpack",
        plate: "",
        escort: false,
        timeIn: minsAgo(12),
        dueAt: minsFromNow(48),
        timeOut: null,
        status: "checked_in",
        notes: [],
      },
    ],
    expected: [
      {
        id: "EXP-201",
        name: "Atty. Gabriel Cuenca",
        org: "CHED Region IV-A Legal",
        category: "Official / CHED / Accreditor",
        idType: "PRC / Gov Employee ID",
        idNumber: "CHD-710",
        office: "Office of the University President",
        host: "Exec. Sec. T. Alcaraz",
        purpose: "Regional MOA Signing & Institutional Review",
        scheduledTime: "14:00",
        escort: true,
      },
      {
        id: "EXP-202",
        name: "Rowena Villanueva",
        org: "Parent of Incoming Freshman",
        category: "Parent / Guardian",
        idType: "PhilSys National ID",
        idNumber: "",
        office: "Cashier & Accounting Office",
        host: "Mrs. C. Magno",
        purpose: "Tuition & Miscellaneous Fee Assessment",
        scheduledTime: "14:45",
        escort: false,
      },
      {
        id: "EXP-203",
        name: "Marco Polo Reyes",
        org: "Converge Fiber Enterprise",
        category: "Vendor / Delivery",
        idType: "School / Company ID",
        idNumber: "CNV-992",
        office: "CEIT — Dean's Office",
        host: "Engr. M. Hernandez",
        purpose: "Campus Fiber Node Bandwidth Testing",
        scheduledTime: "15:30",
        escort: true,
      },
    ],
    audit: [
      {
        time: minsAgo(82),
        type: "CHECK_OUT",
        actor: "Ms. A. Mendoza — Admin Lobby Desk",
        text: "TAG-041 (Nathaniel R. Aquino) returned; UMID ID reclaimed.",
      },
      {
        time: minsAgo(75),
        type: "CHECK_IN",
        actor: "SG R. Villanueva — Main Gate Post 1",
        text: "Issued TAG-044 to Jerome P. Macapagal (Registrar Delivery).",
      },
      {
        time: minsAgo(48),
        type: "CHECK_IN",
        actor: "Ms. A. Mendoza — Admin Lobby Desk",
        text: "Issued TAG-043 to Engr. Mateo Soriano (CEIT Accreditation).",
      },
      {
        time: minsAgo(25),
        type: "CHECK_IN",
        actor: "Ms. A. Mendoza — Admin Lobby Desk",
        text: "Issued TAG-042 to Clarissa D. Evangelista (OSAS — PhilSys ID held).",
      },
      {
        time: minsAgo(12),
        type: "CHECK_IN",
        actor: "SG R. Villanueva — Main Gate Post 1",
        text: "Issued TAG-045 to Katrina Mae Tolentino (Office of Admission).",
      },
    ],
  };
}

export function formatTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function maskId(val) {
  const clean = String(val || "").trim();
  if (clean.length <= 4) return clean;
  return `••••${clean.slice(-4)}`;
}

export function getEffectiveStatus(visitor) {
  if (
    visitor.status === "checked_in" &&
    new Date(visitor.dueAt).getTime() < Date.now()
  ) {
    return "overdue";
  }
  return visitor.status;
}

export function statusLabel(eff) {
  switch (eff) {
    case "checked_in":
      return "ON CAMPUS";
    case "overdue":
      return "OVERDUE";
    case "checked_out":
      return "SIGNED OUT";
    case "denied":
      return "DENIED";
    default:
      return eff;
  }
}

export function suggestNextTag(nextTagNum) {
  return `TAG-${String(nextTagNum).padStart(3, "0")}`;
}