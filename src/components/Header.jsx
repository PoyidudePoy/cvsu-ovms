import { useEffect, useState } from "react";
import { DESK_OFFICERS } from "../data/cvsuData";

export default function Header({
  deskOfficer,
  onDeskOfficerChange,
  onExportMuster,
  onResetDemo,
  onQuickCheckIn,
  logoSrc = "/cvsu-logo.png", // Place your CvSU logo in /public/cvsu-logo.png
}) {
  const [now, setNow] = useState(() => new Date());
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const clockTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const clockDate = now
    .toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .toUpperCase();

  return (
    <header className="bg-gradient-to-br from-[#0e3222] to-[#14452f] text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 border-b-[3px] border-[#c6922c]">
      {/* Brand & Seal */}
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-full bg-white/10 border-[1.5px] border-[#c6922c]/75 grid place-items-center text-[#f3d285] shrink-0 overflow-hidden">
          {!imgError ? (
            <img
              src={logoSrc}
              alt="CvSU Seal"
              className="w-6 h-6 object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" />
              <path d="M8 11h8M12 7v9" />
            </svg>
          )}
        </div>

        <div>
          <div className="text-[10.5px] tracking-[0.09em] text-[#e6cb8b] font-semibold">
            CAVITE STATE UNIVERSITY &bull; MAIN CAMPUS (INDANG)
          </div>
          <h1 className="m-0 text-xl sm:text-2xl font-medium tracking-tight leading-tight">
            Office Visitor Management System
          </h1>
        </div>
      </div>

      {/* Desk Controls & Clock */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col gap-0.5">
          <label
            htmlFor="duty-officer-select"
            className="text-[9.5px] tracking-[0.07em] text-[#bdd1c5]"
          >
            DESK POST / OFFICER-IN-CHARGE
          </label>
          <select
            id="duty-officer-select"
            value={deskOfficer}
            onChange={(e) => onDeskOfficerChange(e.target.value)}
            className="bg-white/10 text-white border border-white/25 px-2.5 py-1.5 rounded-md text-xs focus:outline-none focus:border-[#c6922c]"
          >
            {DESK_OFFICERS.map((officer) => (
              <option key={officer} value={officer} className="text-[#16221c] bg-white">
                {officer}
              </option>
            ))}
          </select>
        </div>

        <div className="text-right px-3.5 border-x border-white/20 hidden sm:block">
          <div className="text-base font-bold tracking-wider">{clockTime}</div>
          <div className="text-[10.5px] text-[#bdd1c5]">{clockDate}</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExportMuster}
            title="Download active campus visitor list as CSV"
            className="px-3.5 py-2 rounded-md text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/25 transition cursor-pointer"
          >
            Export Muster CSV
          </button>
          <button
            type="button"
            onClick={onResetDemo}
            title="Restore sample CvSU visitor records"
            className="px-2.5 py-2 rounded-md text-xs font-semibold text-[#cde0d5] hover:text-white transition cursor-pointer"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onQuickCheckIn}
            className="px-3.5 py-2 rounded-md text-xs font-bold bg-[#c6922c] hover:bg-[#d8a236] text-[#142219] transition cursor-pointer"
          >
            + Log New Visitor
          </button>
        </div>
      </div>
    </header>
  );
}