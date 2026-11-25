import {
  CVSU_OFFICES,
  formatTime,
  getEffectiveStatus,
  maskId,
  statusLabel,
} from "../data/cvsuData";

const STATUS_BADGE_STYLES = {
  checked_in: "bg-[#e8f1ec] text-[#14452f]",
  overdue: "bg-[#fdf2e3] text-[#a85c0b]",
  checked_out: "bg-[#f0eee7] text-[#5a665f]",
  denied: "bg-[#fcebeb] text-[#a12626]",
};

const FILTER_PILLS = [
  { id: "all", label: "All" },
  { id: "checked_in", label: "On Campus" },
  { id: "overdue", label: "Overdue" },
  { id: "checked_out", label: "Signed Out" },
  { id: "denied", label: "Denied" },
];

export default function RegistryTable({
  visitors,
  selectedVisitorId,
  search,
  onSearchChange,
  officeFilter,
  onOfficeFilterChange,
  statusFilter,
  onStatusFilterChange,
  onSelectVisitor,
  onSignOut,
}) {
  const q = search.toLowerCase().trim();

  const filtered = visitors.filter((v) => {
    const eff = getEffectiveStatus(v);
    if (statusFilter === "checked_in" && eff !== "checked_in" && eff !== "overdue")
      return false;
    if (statusFilter === "overdue" && eff !== "overdue") return false;
    if (statusFilter === "checked_out" && eff !== "checked_out") return false;
    if (statusFilter === "denied" && eff !== "denied") return false;

    if (officeFilter !== "all" && v.office !== officeFilter) return false;

    if (!q) return true;
    const hay =
      `${v.tag} ${v.name} ${v.org} ${v.office} ${v.host} ${v.plate} ${v.purpose}`.toLowerCase();
    return hay.includes(q);
  });

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
        <div className="relative flex-1 min-w-[220px] flex items-center">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute left-2.5 text-[#5a665f] pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search visitor name, tag #, office, host, or vehicle plate..."
            className="w-full py-2 pl-8 pr-3 border border-[#c8c3b4] rounded-md text-[13px] bg-[#fcfcfa] focus:outline-none focus:border-[#14452f] focus:bg-white focus:ring-2 focus:ring-[#14452f]/10"
          />
        </div>

        <select
          value={officeFilter}
          onChange={(e) => onOfficeFilterChange(e.target.value)}
          aria-label="Filter by destination office"
          className="px-2.5 py-2 border border-[#c8c3b4] rounded-md text-[12.5px] bg-white focus:outline-none focus:border-[#14452f]"
        >
          <option value="all">All Campus Offices</option>
          {CVSU_OFFICES.map((o) => (
            <option key={o.id} value={o.name}>
              {o.name}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap gap-1" role="group" aria-label="Filter by visit status">
          {FILTER_PILLS.map((pill) => {
            const active = statusFilter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => onStatusFilterChange(pill.id)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-semibold border transition cursor-pointer ${
                  active
                    ? "bg-[#14452f] text-white border-[#14452f]"
                    : "bg-[#f6f5f0] text-[#5a665f] border-[#e1ded4] hover:bg-[#f0eee7]"
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-[#e1ded4] rounded-md">
        <table className="w-full border-collapse text-[12.5px]">
          <thead>
            <tr className="bg-[#f0eee7] text-left text-[10px] tracking-[0.06em] text-[#5a665f] border-b border-[#e1ded4]">
              <th className="py-2.5 px-3 whitespace-nowrap">TAG #</th>
              <th className="py-2.5 px-3 whitespace-nowrap">VISITOR &amp; AFFILIATION</th>
              <th className="py-2.5 px-3 whitespace-nowrap">CATEGORY</th>
              <th className="py-2.5 px-3 whitespace-nowrap">DESTINATION OFFICE / HOST</th>
              <th className="py-2.5 px-3 whitespace-nowrap">ID CUSTODY</th>
              <th className="py-2.5 px-3 whitespace-nowrap">TIME IN / DUE</th>
              <th className="py-2.5 px-3 whitespace-nowrap">STATUS</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-[#5a665f] py-6 px-3">
                  No campus visitor logs match your current search or filters.
                </td>
              </tr>
            ) : (
              filtered.map((v) => {
                const eff = getEffectiveStatus(v);
                const isSelected = v.id === selectedVisitorId;
                const isActive = eff === "checked_in" || eff === "overdue";
                const idHeld = v.custody.startsWith("Held");

                return (
                  <tr
                    key={v.id}
                    onClick={() => onSelectVisitor(v.id)}
                    className={`border-b border-[#e1ded4] last:border-b-0 cursor-pointer transition ${
                      isSelected ? "bg-[#e8f1ec]" : "hover:bg-[#faf9f5]"
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-[11.5px] bg-[#fbf4e4] text-[#7c5811] border border-[#ead4a0] px-2 py-0.5 rounded whitespace-nowrap inline-block">
                        {v.tag}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-[#16221c]">{v.name}</div>
                      <div className="text-[11.5px] text-[#5a665f]">{v.org}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div>{v.category}</div>
                      <div className="text-[11.5px] text-[#5a665f]">
                        {v.escort ? "Escort Req." : "Standard"}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-[#16221c]">{v.office}</div>
                      <div className="text-[11.5px] text-[#5a665f]">Host: {v.host}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div>{maskId(v.idNumber)}</div>
                      <div className="text-[11.5px] text-[#5a665f]">
                        {idHeld && isActive ? "ID Held at Desk" : "ID Returned"}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[11.5px] whitespace-nowrap">
                      <div>IN {formatTime(v.timeIn)}</div>
                      <div className="text-[#5a665f]">
                        {v.timeOut ? `OUT ${formatTime(v.timeOut)}` : `DUE ${formatTime(v.dueAt)}`}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap inline-block ${
                          STATUS_BADGE_STYLES[eff] || ""
                        }`}
                      >
                        {statusLabel(eff)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {isActive && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSignOut(v.id);
                          }}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white border border-[#c8c3b4] hover:bg-[#f0eee7] text-[#16221c] transition cursor-pointer"
                        >
                          Sign Out
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}