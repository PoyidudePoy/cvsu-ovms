import { CVSU_OFFICES } from "../data/cvsuData";

export default function OfficeRoster({ visitors }) {
  return (
    <section className="bg-white border border-[#e1ded4] rounded-[10px] shadow-sm overflow-hidden">
      <div className="bg-[#f0eee7] px-3.5 py-2.5 border-b border-[#e1ded4] flex justify-between items-center text-[10.5px] font-bold tracking-[0.05em]">
        <span>CvSU OFFICES &amp; QUEUE STATUS</span>
        <span className="text-[10px] text-[#14452f]">LIVE LOAD</span>
      </div>

      <ul className="list-none m-0 p-0 divide-y divide-[#e1ded4]">
        {CVSU_OFFICES.map((office) => {
          const activeCount = visitors.filter(
            (v) => v.office === office.name && v.status === "checked_in"
          ).length;

          const statusClass =
            office.status === "Peak Queue"
              ? "bg-[#fdf2e3] text-[#a85c0b]"
              : office.status === "Cutoff"
              ? "bg-[#f0eee7] text-[#5a665f]"
              : "bg-[#e8f1ec] text-[#14452f]";

          return (
            <li
              key={office.id}
              className="px-3.5 py-2.5 flex justify-between items-center gap-2.5 text-[12.5px]"
            >
              <div>
                <strong className="block text-[#16221c]">{office.name}</strong>
                <div className="text-[11.5px] text-[#5a665f]">
                  {office.building} &bull; Active Visitors: <strong>{activeCount}</strong>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${statusClass}`}
              >
                {office.status.toUpperCase()}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}