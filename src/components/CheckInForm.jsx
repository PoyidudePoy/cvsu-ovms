import { useEffect, useState } from "react";
import { CVSU_OFFICES, QUICK_PURPOSES, WATCHLIST } from "../data/cvsuData";

const INITIAL_FORM = (suggestedTag) => ({
  name: "",
  org: "",
  phone: "",
  category: "Parent / Guardian",
  idType: "PhilSys National ID",
  idNumber: "",
  custody: "Held at Desk (Tag Issued)",
  tag: suggestedTag,
  office: CVSU_OFFICES[0].name,
  host: "",
  duration: "60",
  purpose: "",
  items: "",
  plate: "",
  escort: false,
});

export default function CheckInForm({
  suggestedTag,
  preFillVisit,
  onClearPreFill,
  onCheckIn,
  onRequestDeny,
}) {
  const [form, setForm] = useState(() => INITIAL_FORM(suggestedTag));
  const [clearance, setClearance] = useState({
    status: "neutral", // neutral | clear | flagged
    message: "Pending verification — check visitor ID before issuing pass.",
  });

  useEffect(() => {
    if (preFillVisit) {
      setForm({
        ...INITIAL_FORM(suggestedTag),
        name: preFillVisit.name || "",
        org: preFillVisit.org || "",
        category: preFillVisit.category || "Parent / Guardian",
        idType: preFillVisit.idType || "PhilSys National ID",
        idNumber: preFillVisit.idNumber || "",
        office: preFillVisit.office || CVSU_OFFICES[0].name,
        host: preFillVisit.host || "",
        purpose: preFillVisit.purpose || "",
        escort: Boolean(preFillVisit.escort),
        tag: suggestedTag,
      });
      setClearance({
        status: "neutral",
        message: "Pending verification — check visitor ID before issuing pass.",
      });
    } else {
      setForm((prev) => ({ ...prev, tag: suggestedTag }));
    }
  }, [preFillVisit, suggestedTag]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const runClearanceCheck = () => {
    const name = form.name.trim().toLowerCase();
    const idNum = form.idNumber.trim().toLowerCase();

    if (!name && !idNum) {
      const result = {
        status: "neutral",
        message: "Please enter visitor name or ID number first.",
      };
      setClearance(result);
      return result;
    }

    const hit = WATCHLIST.find(
      (w) => (name && name.includes(w.name)) || (idNum && idNum === w.id.toLowerCase())
    );

    if (hit) {
      const result = {
        status: "flagged",
        message: `RESTRICTED ENTRY MATCH: ${hit.reason}`,
        rawReason: hit.reason,
      };
      setClearance(result);
      return result;
    }

    const time = new Date().toLocaleTimeString([], { hour12: false });
    const result = {
      status: "clear",
      message: `CLEARED — No campus security holds found (${time}).`,
    };
    setClearance(result);
    return result;
  };

  const handleReset = () => {
    setForm(INITIAL_FORM(suggestedTag));
    setClearance({
      status: "neutral",
      message: "Pending verification — check visitor ID before issuing pass.",
    });
    onClearPreFill();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let currentClearance = clearance;
    if (clearance.status === "neutral") {
      currentClearance = runClearanceCheck();
    }
    if (currentClearance.status === "flagged") {
      alert(
        "Entry Blocked: This visitor matched the Campus Restricted List. Click 'Deny Entry & Log Reason' instead."
      );
      return;
    }
    onCheckIn(form, preFillVisit?.id);
    handleReset();
  };

  const selectedOfficeObj = CVSU_OFFICES.find((o) => o.name === form.office);
  const inputClass =
    "w-full px-2.5 py-2 border border-[#c8c3b4] rounded-md text-[13px] bg-white focus:outline-none focus:border-[#14452f] focus:ring-2 focus:ring-[#14452f]/10";

  return (
    <div>
      {preFillVisit && (
        <div className="bg-[#e8f1ec] border border-[#bdd8c9] text-[#14452f] px-3.5 py-2.5 rounded-md mb-3.5 flex justify-between items-center text-[12.5px] font-semibold">
          <span>
            Pre-filled from Scheduled Visits. Verify physical ID before issuing Visitor Tag.
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold underline cursor-pointer"
          >
            Clear Form
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Column 1 */}
          <div className="border border-[#e1ded4] rounded-md p-4 bg-[#fcfcfa]">
            <div className="text-[11px] font-bold tracking-[0.05em] text-[#14452f] uppercase mb-3.5 pb-2 border-b border-[#e1ded4]">
              1. Visitor Identity &amp; ID Custody
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g., Maria Clara Santos"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Affiliation / School / Company *
                </label>
                <input
                  type="text"
                  required
                  value={form.org}
                  onChange={(e) => updateField("org", e.target.value)}
                  placeholder="e.g., Parent of BSIT-2A"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="0917-555-0148"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Visitor Category *</label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className={inputClass}
                >
                  <option value="Parent / Guardian">Parent / Guardian</option>
                  <option value="Prospective Student">Prospective Student / Applicant</option>
                  <option value="Alumni">CvSU Alumni</option>
                  <option value="Vendor / Delivery">Vendor / Supplier / Delivery</option>
                  <option value="Official / CHED / Accreditor">Official / CHED / AACCUP</option>
                  <option value="Guest Lecturer / Partner">Guest Speaker / Partner</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Valid ID Presented *</label>
                <select
                  required
                  value={form.idType}
                  onChange={(e) => updateField("idType", e.target.value)}
                  className={inputClass}
                >
                  <option value="PhilSys National ID">PhilSys National ID</option>
                  <option value="Driver's License">LTO Driver's License</option>
                  <option value="UMID / SSS / GSIS">UMID / SSS / GSIS</option>
                  <option value="Passport">Passport</option>
                  <option value="PRC / Gov Employee ID">PRC / Gov Employee ID</option>
                  <option value="School / Company ID">School / Company ID</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  ID Reference (Last 4 / Code) *
                </label>
                <input
                  type="text"
                  required
                  value={form.idNumber}
                  onChange={(e) => updateField("idNumber", e.target.value)}
                  placeholder="e.g., PHL-4821"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">ID Custody Handling *</label>
                <select
                  required
                  value={form.custody}
                  onChange={(e) => updateField("custody", e.target.value)}
                  className={inputClass}
                >
                  <option value="Held at Desk (Tag Issued)">Held at Desk (Tag Issued)</option>
                  <option value="Verified & Returned">Verified &amp; Returned (VIP/Official)</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold mb-1">
                Assigned Physical Tag / Lanyard # *
              </label>
              <input
                type="text"
                required
                value={form.tag}
                onChange={(e) => updateField("tag", e.target.value)}
                placeholder="e.g., TAG-046"
                className={inputClass}
              />
            </div>

            {/* Clearance Box */}
            <div className="mt-2.5 p-3 border border-[#e1ded4] rounded-md bg-white">
              <div className="flex justify-between items-center gap-2.5 mb-2 text-[11px]">
                <div>
                  <strong className="block">CAMPUS CLEARANCE / RESTRICTED LIST CHECK</strong>
                  <span className="text-[#5a665f]">
                    Test flagged entry: enter &quot;Blocked Visitor&quot; or ID &quot;ID-0000&quot;
                  </span>
                </div>
                <button
                  type="button"
                  onClick={runClearanceCheck}
                  className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-white border border-[#c8c3b4] hover:bg-[#f0eee7] shrink-0 cursor-pointer"
                >
                  Verify Clearance
                </button>
              </div>
              <div
                className={`text-[11px] px-2.5 py-2 rounded ${
                  clearance.status === "clear"
                    ? "bg-[#e8f1ec] text-[#14452f]"
                    : clearance.status === "flagged"
                    ? "bg-[#fcebeb] text-[#a12626] font-bold"
                    : "bg-[#f0eee7] text-[#5a665f]"
                }`}
              >
                {clearance.message}
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="border border-[#e1ded4] rounded-md p-4 bg-[#fcfcfa]">
            <div className="text-[11px] font-bold tracking-[0.05em] text-[#14452f] uppercase mb-3.5 pb-2 border-b border-[#e1ded4]">
              2. Campus Office Routing &amp; Purpose
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold mb-1">Destination CvSU Office *</label>
              <select
                required
                value={form.office}
                onChange={(e) => updateField("office", e.target.value)}
                className={inputClass}
              >
                {CVSU_OFFICES.map((o) => (
                  <option key={o.id} value={o.name}>
                    {o.name} ({o.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Personnel / Officer to Visit *
                </label>
                <input
                  type="text"
                  required
                  value={form.host}
                  onChange={(e) => updateField("host", e.target.value)}
                  placeholder={`e.g., ${selectedOfficeObj?.contact || "Dr. E. Reyes"}`}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Expected Visit Duration *
                </label>
                <select
                  required
                  value={form.duration}
                  onChange={(e) => updateField("duration", e.target.value)}
                  className={inputClass}
                >
                  <option value="30">30 Minutes</option>
                  <option value="60">1 Hour</option>
                  <option value="120">2 Hours</option>
                  <option value="240">4 Hours (Half Day)</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold mb-1">
                Official Purpose / Transaction *
              </label>
              <input
                type="text"
                required
                value={form.purpose}
                onChange={(e) => updateField("purpose", e.target.value)}
                placeholder="e.g., Request Official Transcript of Records (TOR)"
                className={inputClass}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {QUICK_PURPOSES.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => updateField("purpose", chip.value)}
                    className="bg-[#f0eee7] hover:bg-[#e8f1ec] hover:text-[#14452f] border border-[#e1ded4] hover:border-[#b7d2c2] text-[#5a665f] text-[11px] font-semibold px-2.5 py-1 rounded-full transition cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Declared Bags / Equipment
                </label>
                <input
                  type="text"
                  value={form.items}
                  onChange={(e) => updateField("items", e.target.value)}
                  placeholder="e.g., Laptop, 3 Boxes Paper"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Vehicle Plate (If Parked)
                </label>
                <input
                  type="text"
                  value={form.plate}
                  onChange={(e) => updateField("plate", e.target.value)}
                  placeholder="e.g., NGA-4821"
                  className={inputClass}
                />
              </div>
            </div>

            <label className="flex items-start gap-2.5 p-3 border border-[#e1ded4] rounded-md bg-white cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={form.escort}
                onChange={(e) => updateField("escort", e.target.checked)}
                className="mt-1 accent-[#14452f]"
              />
              <div>
                <strong className="block text-[12.5px]">
                  Campus Escort / Safeguarding Required
                </strong>
                <span className="text-[11.5px] text-[#5a665f]">
                  Recommended for restricted labs, server rooms, or minor-related visits.
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-[#e1ded4] flex flex-wrap justify-between items-center gap-3">
          <button
            type="button"
            onClick={() => onRequestDeny(form, clearance.rawReason)}
            className="px-3.5 py-2 rounded-md text-xs font-semibold bg-white text-[#a12626] border border-[#e4b4b4] hover:bg-[#fcebeb] transition cursor-pointer"
          >
            Deny Entry &amp; Log Reason
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md text-xs font-semibold bg-[#14452f] hover:bg-[#0e3222] text-white transition cursor-pointer"
          >
            Issue Campus Pass &amp; Check In
          </button>
        </div>
      </form>
    </div>
  );
}