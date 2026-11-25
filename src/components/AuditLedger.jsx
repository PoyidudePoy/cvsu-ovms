const TYPE_COLORS = {
  CHECK_IN: "text-[#14452f]",
  CHECK_OUT: "text-[#355068]",
  DENIED: "text-[#a12626]",
  NOTE: "text-[#a85c0b]",
};

export default function AuditLedger({ audit, filter, onFilterChange }) {
  const rows = audit.filter((a) => filter === "all" || a.type === filter);

  return (
    <div>
      <div className="flex justify-between items-center gap-3 mb-3.5">
        <div>
          <h2 className="m-0 text-base font-bold">Shift Activity &amp; Security Ledger</h2>
          <p className="m-0 text-xs text-[#5a665f]">
            Chronological record of visitor passes issued, ID returns, and desk remarks.
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-2.5 py-1.5 border border-[#c8c3b4] rounded-md text-[12.5px] bg-white"
        >
          <option value="all">All Events</option>
          <option value="CHECK_IN">Check-Ins</option>
          <option value="CHECK_OUT">ID Returns &amp; Sign-Outs</option>
          <option value="DENIED">Denied Entries</option>
          <option value="NOTE">Desk Notes</option>
        </select>
      </div>

      <ul className="list-none m-0 p-0 border border-[#e1ded4] rounded-md divide-y divide-[#e1ded4]">
        {rows.length === 0 ? (
          <li className="text-center text-[#5a665f] text-[12.5px] py-6">
            No log entries found for this filter.
          </li>
        ) : (
          rows.map((a, idx) => (
            <li
              key={`${a.time}-${idx}`}
              className="grid grid-cols-1 sm:grid-cols-[140px_105px_1fr] gap-2 sm:gap-3 px-3.5 py-2.5 text-[12.5px] items-center"
            >
              <span className="text-[11px] text-[#5a665f]">
                {new Date(a.time).toLocaleString([], {
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </span>
              <span className={`text-[10.5px] font-bold ${TYPE_COLORS[a.type] || ""}`}>
                {a.type}
              </span>
              <span>
                {a.text}{" "}
                <em className="text-[11.5px] text-[#5a665f]">({a.actor})</em>
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}