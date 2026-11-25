import {
  formatTime,
  getEffectiveStatus,
  maskId,
  statusLabel,
} from "../data/cvsuData";

const PASS_STATUS_CLASSES = {
  checked_in: "bg-[#e8f1ec] text-[#14452f]",
  overdue: "bg-[#fdf2e3] text-[#a85c0b]",
  checked_out: "bg-[#f0eee7] text-[#5a665f]",
  denied: "bg-[#fcebeb] text-[#a12626]",
};

export default function PassInspector({
  visitor,
  onOpenNoteModal,
  onSignOut,
}) {
  if (!visitor) {
    return (
      <section className="bg-white border border-[#e1ded4] rounded-[10px] shadow-sm overflow-hidden">
        <div className="bg-[#f0eee7] px-3.5 py-2.5 border-b border-[#e1ded4] flex justify-between items-center text-[10.5px] font-bold tracking-[0.05em]">
          <span>CAMPUS VISITOR PASS</span>
          <span className="text-[10px] text-[#14452f]">INSPECTOR</span>
        </div>
        <div className="p-6 text-center text-[#5a665f] text-[12.5px]">
          Select a visitor row to inspect credentials or print a CvSU pass slip.
        </div>
      </section>
    );
  }

  const eff = getEffectiveStatus(visitor);
  const isActive = eff === "checked_in" || eff === "overdue";
  const idHeld = visitor.custody.startsWith("Held");

  return (
    <section className="bg-white border border-[#e1ded4] rounded-[10px] shadow-sm overflow-hidden">
      <div className="bg-[#f0eee7] px-3.5 py-2.5 border-b border-[#e1ded4] flex justify-between items-center text-[10.5px] font-bold tracking-[0.05em]">
        <span>CAMPUS VISITOR PASS</span>
        <span className="text-[10px] text-[#14452f]">INSPECTOR</span>
      </div>

      <div className="p-3.5">
        {/* Printable Pass Card */}
        <div
          id="printable-pass"
          className="border-[1.5px] border-[#14452f] rounded-lg overflow-hidden bg-white shadow-md"
        >
          <div className="bg-[#14452f] text-white px-3.5 py-2.5 flex justify-between items-center border-b-[3px] border-[#c6922c]">
            <div>
              <div className="text-[10px] tracking-[0.07em] text-[#e8cf8e]">
                CAVITE STATE UNIVERSITY
              </div>
              <div className="font-bold text-[13px]">CAMPUS VISITOR PASS</div>
            </div>
            <span className="font-bold text-sm bg-[#c6922c] text-[#142219] px-2 py-0.5 rounded">
              {visitor.tag}
            </span>
          </div>

          <div className="bg-[#e8f1ec] text-[#14452f] text-[10.5px] font-bold text-center py-1.5 px-2.5 border-b border-[#cce0d4]">
            {visitor.office.toUpperCase()}
          </div>

          <div className="p-3.5">
            <h4 className="text-[16.5px] font-bold m-0 mb-0.5">{visitor.name}</h4>
            <div className="text-xs text-[#5a665f] mb-2.5">
              {visitor.org} &bull; {visitor.category}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-dashed border-[#c8c3b4] text-[11.5px]">
              <div>
                <span className="block text-[9.5px] text-[#5a665f]">PERSON TO VISIT</span>
                <strong>{visitor.host}</strong>
              </div>
              <div>
                <span className="block text-[9.5px] text-[#5a665f]">ID CUSTODY</span>
                <strong>{idHeld && isActive ? "HELD AT DESK" : visitor.custody}</strong>
              </div>
              <div>
                <span className="block text-[9.5px] text-[#5a665f]">TIME IN</span>
                <strong>{formatTime(visitor.timeIn)}</strong>
              </div>
              <div>
                <span className="block text-[9.5px] text-[#5a665f]">VALID UNTIL</span>
                <strong>{visitor.status === "denied" ? "VOID" : formatTime(visitor.dueAt)}</strong>
              </div>
              <div>
                <span className="block text-[9.5px] text-[#5a665f]">PRESENTED ID</span>
                <strong>
                  {visitor.idType} ({maskId(visitor.idNumber)})
                </strong>
              </div>
              <div>
                <span className="block text-[9.5px] text-[#5a665f]">PLATE / ITEMS</span>
                <strong>{visitor.plate || visitor.items || "None"}</strong>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#e1ded4] flex justify-between items-center">
              <div
                aria-hidden="true"
                className="h-5 w-[135px]"
                style={{
                  background:
                    "repeating-linear-gradient(90deg, #14452f 0px, #14452f 2px, transparent 2px, transparent 4px, #14452f 4px, #14452f 6px, transparent 6px, transparent 9px, #14452f 9px, #14452f 10px, transparent 10px, transparent 13px)",
                }}
              />
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  PASS_STATUS_CLASSES[eff] || ""
                }`}
              >
                {statusLabel(eff)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {visitor.status !== "denied" && (
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white border border-[#c8c3b4] hover:bg-[#f0eee7] cursor-pointer"
            >
              Print Pass Slip
            </button>
          )}
          <button
            type="button"
            onClick={() => onOpenNoteModal(visitor)}
            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white border border-[#c8c3b4] hover:bg-[#f0eee7] cursor-pointer"
          >
            + Add Desk Note
          </button>
          {isActive && (
            <button
              type="button"
              onClick={() => onSignOut(visitor.id)}
              className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[#14452f] hover:bg-[#0e3222] text-white cursor-pointer"
            >
              {idHeld ? "Return ID & Sign Out" : "Sign Out Visitor"}
            </button>
          )}
        </div>

        {/* Notes & Metadata */}
        <div className="mt-3 pt-2.5 border-t border-[#e1ded4] text-xs space-y-1">
          <div>
            <strong>Purpose:</strong> {visitor.purpose}
          </div>
          <div>
            <strong>Declared Items:</strong> {visitor.items || "None"}
          </div>
          {visitor.notes.length > 0 && (
            <div className="pt-1">
              <strong>Desk Remarks:</strong>
              <ul className="mt-1 mb-0 pl-4 list-disc space-y-0.5">
                {visitor.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}