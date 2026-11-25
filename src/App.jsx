import { useEffect, useState } from "react";
import AuditLedger from "./components/AuditLedger";
import CheckInForm from "./components/CheckInForm";
import Header from "./components/Header";
import KpiStrip from "./components/KpiStrip";
import {
  DenyModalForm,
  Modal,
  NoteModalForm,
  ScheduleModalForm,
} from "./components/Modal";
import OfficeRoster from "./components/OfficeRoster";
import PassInspector from "./components/PassInspector";
import RegistryTable from "./components/RegistryTable";
import ScheduledVisits from "./components/ScheduledVisits";
import {
  DESK_OFFICERS,
  STORAGE_KEY,
  formatTime,
  getInitialState,
  minsFromNow,
  suggestNextTag,
} from "./data/cvsuData";

const TABS = [
  { id: "registry", label: "Active & Daily Log" },
  { id: "checkin", label: "Visitor Intake & Pass Issue" },
  { id: "expected", label: "Scheduled Visits" },
  { id: "audit", label: "Shift Audit Ledger" },
];

export default function App() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback to defaults
    }
    return getInitialState();
  });

  const [deskOfficer, setDeskOfficer] = useState(DESK_OFFICERS[0]);
  const [activeTab, setActiveTab] = useState("registry");
  const [search, setSearch] = useState("");
  const [officeFilter, setOfficeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [auditFilter, setAuditFilter] = useState("all");
  const [preFillVisit, setPreFillVisit] = useState(null);
  const [modal, setModal] = useState(null); // { type: 'note' | 'schedule' | 'deny', payload }
  const [, setTick] = useState(0); // forces overdue re-evaluation every 30s

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const createAuditEntry = (type, text) => ({
    time: new Date().toISOString(),
    type,
    actor: deskOfficer,
    text,
  });

  const handleSignOut = (visitorId) => {
    setState((prev) => {
      const target = prev.visitors.find((v) => v.id === visitorId);
      if (!target || target.status !== "checked_in") return prev;

      const idMsg = target.custody.startsWith("Held")
        ? " Held ID returned to visitor."
        : "";

      return {
        ...prev,
        visitors: prev.visitors.map((v) =>
          v.id === visitorId
            ? { ...v, status: "checked_out", timeOut: new Date().toISOString() }
            : v
        ),
        audit: [
          createAuditEntry(
            "CHECK_OUT",
            `${target.tag} (${target.name}) signed out from ${target.office}.${idMsg}`
          ),
          ...prev.audit,
        ],
      };
    });
  };

  const handleCheckIn = (form, expectedId) => {
    const durationMins = parseInt(form.duration, 10) || 60;
    const tagVal =
      form.tag.trim().toUpperCase() || suggestNextTag(state.nextTagNum);

    const newVisitor = {
      id: `VIS-${Date.now()}`,
      tag: tagVal,
      name: form.name.trim(),
      org: form.org.trim(),
      phone: form.phone.trim(),
      category: form.category,
      idType: form.idType,
      idNumber: form.idNumber.trim(),
      custody: form.custody,
      office: form.office,
      host: form.host.trim(),
      purpose: form.purpose.trim(),
      items: form.items.trim(),
      plate: form.plate.trim().toUpperCase(),
      escort: form.escort,
      timeIn: new Date().toISOString(),
      dueAt: minsFromNow(durationMins),
      timeOut: null,
      status: "checked_in",
      notes: [],
    };

    setState((prev) => ({
      ...prev,
      nextTagNum: prev.nextTagNum + 1,
      selectedVisitorId: newVisitor.id,
      visitors: [newVisitor, ...prev.visitors],
      expected: expectedId
        ? prev.expected.filter((x) => x.id !== expectedId)
        : prev.expected,
      audit: [
        createAuditEntry(
          "CHECK_IN",
          `Issued ${newVisitor.tag} to ${newVisitor.name} → ${newVisitor.office} (${newVisitor.custody}).`
        ),
        ...prev.audit,
      ],
    }));

    setPreFillVisit(null);
    setActiveTab("registry");
  };

  const handleConfirmDeny = (form, reason) => {
    const now = new Date().toISOString();
    const name = form.name.trim() || "Unidentified Visitor";

    const denied = {
      id: `VIS-${Date.now()}`,
      tag: "DENIED",
      name,
      org: form.org.trim() || "Unaffiliated",
      phone: form.phone.trim(),
      category: form.category,
      idType: form.idType,
      idNumber: form.idNumber.trim() || "N/A",
      custody: "Not Issued",
      office: form.office,
      host: form.host.trim() || "N/A",
      purpose: form.purpose.trim() || "Entry Denied",
      items: form.items.trim(),
      plate: form.plate.trim().toUpperCase(),
      escort: true,
      timeIn: now,
      dueAt: now,
      timeOut: now,
      status: "denied",
      notes: [`DENIED ENTRY: ${reason}`],
    };

    setState((prev) => ({
      ...prev,
      selectedVisitorId: denied.id,
      visitors: [denied, ...prev.visitors],
      audit: [
        createAuditEntry("DENIED", `Campus entry denied for ${name}. Reason: ${reason}`),
        ...prev.audit,
      ],
    }));

    setModal(null);
    setPreFillVisit(null);
    setActiveTab("registry");
  };

  const handleAddNote = (visitor, noteText) => {
    const stamp = formatTime(new Date().toISOString());
    setState((prev) => ({
      ...prev,
      visitors: prev.visitors.map((v) =>
        v.id === visitor.id
          ? { ...v, notes: [...v.notes, `${stamp} — ${noteText}`] }
          : v
      ),
      audit: [
        createAuditEntry(
          "NOTE",
          `Remark added on ${visitor.tag} (${visitor.name}): "${noteText}"`
        ),
        ...prev.audit,
      ],
    }));
    setModal(null);
  };

  const handleAddScheduled = (form) => {
    const item = {
      id: `EXP-${Date.now()}`,
      name: form.name.trim(),
      org: form.org.trim(),
      category: "Guest Lecturer / Partner",
      idType: "PRC / Gov Employee ID",
      idNumber: "",
      office: form.office,
      host: form.host.trim(),
      purpose: form.purpose.trim(),
      scheduledTime: form.scheduledTime,
      escort: false,
    };

    setState((prev) => ({
      ...prev,
      expected: [...prev.expected, item],
      audit: [
        createAuditEntry(
          "NOTE",
          `Scheduled appointment: ${item.name} → ${item.office} at ${item.scheduledTime}.`
        ),
        ...prev.audit,
      ],
    }));
    setModal(null);
  };

  const handleRemoveExpected = (exp) => {
    setState((prev) => ({
      ...prev,
      expected: prev.expected.filter((x) => x.id !== exp.id),
      audit: [
        createAuditEntry("NOTE", `Removed scheduled appointment for ${exp.name}.`),
        ...prev.audit,
      ],
    }));
  };

  const handleExportMuster = () => {
    const active = state.visitors.filter((v) => v.status === "checked_in");
    const headers = [
      "Tag",
      "Name",
      "Affiliation",
      "Category",
      "Destination Office",
      "Host",
      "ID Custody",
      "Time In",
      "Expected Out",
    ];
    const rows = active.map((v) => [
      v.tag,
      `"${v.name.replace(/"/g, '""')}"`,
      `"${v.org.replace(/"/g, '""')}"`,
      `"${v.category}"`,
      `"${v.office}"`,
      `"${v.host.replace(/"/g, '""')}"`,
      `"${v.custody}"`,
      formatTime(v.timeIn),
      formatTime(v.dueAt),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cvsu_campus_visitor_muster_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetDemo = () => {
    if (window.confirm("Reset CvSU prototype records back to sample campus data?")) {
      setState(getInitialState());
      setPreFillVisit(null);
    }
  };

  const selectedVisitor = state.visitors.find(
    (v) => v.id === state.selectedVisitorId
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        deskOfficer={deskOfficer}
        onDeskOfficerChange={setDeskOfficer}
        onExportMuster={handleExportMuster}
        onResetDemo={handleResetDemo}
        onQuickCheckIn={() => setActiveTab("checkin")}
      />

      <KpiStrip
        visitors={state.visitors}
        expectedCount={state.expected.length}
      />

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_370px] gap-4 px-6 py-4 pb-6 items-start">
        {/* Left Primary Card */}
        <section className="bg-white border border-[#e1ded4] rounded-[10px] shadow-sm overflow-hidden min-w-0">
          <nav
            role="tablist"
            className="flex bg-[#f0eee7] border-b border-[#e1ded4] px-2 gap-1 overflow-x-auto"
          >
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-[13px] font-semibold border-b-[2.5px] whitespace-nowrap transition cursor-pointer ${
                    active
                      ? "text-[#14452f] border-[#14452f]"
                      : "text-[#5a665f] border-transparent hover:text-[#16221c]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 sm:p-5">
            {activeTab === "registry" && (
              <RegistryTable
                visitors={state.visitors}
                selectedVisitorId={state.selectedVisitorId}
                search={search}
                onSearchChange={setSearch}
                officeFilter={officeFilter}
                onOfficeFilterChange={setOfficeFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onSelectVisitor={(id) =>
                  setState((prev) => ({ ...prev, selectedVisitorId: id }))
                }
                onSignOut={handleSignOut}
              />
            )}

            {activeTab === "checkin" && (
              <CheckInForm
                suggestedTag={suggestNextTag(state.nextTagNum)}
                preFillVisit={preFillVisit}
                onClearPreFill={() => setPreFillVisit(null)}
                onCheckIn={handleCheckIn}
                onRequestDeny={(form, defaultReason) =>
                  setModal({ type: "deny", payload: { form, defaultReason } })
                }
              />
            )}

            {activeTab === "expected" && (
              <ScheduledVisits
                expected={state.expected}
                onOpenScheduleModal={() => setModal({ type: "schedule" })}
                onCheckInExpected={(exp) => {
                  setPreFillVisit(exp);
                  setActiveTab("checkin");
                }}
                onRemoveExpected={handleRemoveExpected}
              />
            )}

            {activeTab === "audit" && (
              <AuditLedger
                audit={state.audit}
                filter={auditFilter}
                onFilterChange={setAuditFilter}
              />
            )}
          </div>
        </section>

        {/* Right Contextual Sidebar */}
        <aside className="flex flex-col gap-4">
          <PassInspector
            visitor={selectedVisitor}
            onOpenNoteModal={(v) => setModal({ type: "note", payload: v })}
            onSignOut={handleSignOut}
          />
          <OfficeRoster visitors={state.visitors} />
        </aside>
      </main>

      {/* Modals */}
      <Modal
        isOpen={Boolean(modal)}
        title={
          modal?.type === "note"
            ? `Add Desk Remark — ${modal.payload.name}`
            : modal?.type === "schedule"
            ? "Schedule CvSU Campus Visit"
            : modal?.type === "deny"
            ? "Deny Campus Entry"
            : ""
        }
        onClose={() => setModal(null)}
      >
        {modal?.type === "note" && (
          <NoteModalForm
            onCancel={() => setModal(null)}
            onSubmit={(text) => handleAddNote(modal.payload, text)}
          />
        )}
        {modal?.type === "schedule" && (
          <ScheduleModalForm
            onCancel={() => setModal(null)}
            onSubmit={handleAddScheduled}
          />
        )}
        {modal?.type === "deny" && (
          <DenyModalForm
            visitorName={modal.payload.form.name.trim() || "Unidentified Visitor"}
            defaultReason={modal.payload.defaultReason}
            onCancel={() => setModal(null)}
            onSubmit={(reason) => handleConfirmDeny(modal.payload.form, reason)}
          />
        )}
      </Modal>
    </div>
  );
}