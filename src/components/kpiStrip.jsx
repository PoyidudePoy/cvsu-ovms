import { getEffectiveStatus } from "../data/cvsuData";

export default function KpiStrip({ visitors, expectedCount }) {
  let active = 0;
  let overdue = 0;
  let completed = 0;

  visitors.forEach((v) => {
    const eff = getEffectiveStatus(v);
    if (eff === "checked_in") active++;
    if (eff === "overdue") {
      active++;
      overdue++;
    }
    if (eff === "checked_out") completed++;
  });

  const cards = [
    {
      label: "CURRENTLY ON CAMPUS",
      pill: "ACTIVE TAGS",
      pillClass: "bg-[#e8f1ec] text-[#14452f]",
      value: active,
      hint: "Inside offices & lobby",
    },
    {
      label: "OVERDUE / UNRETURNED ID",
      pill: "FOLLOW-UP",
      pillClass: "bg-[#fdf2e3] text-[#a85c0b]",
      value: overdue,
      hint: "Past expected departure",
    },
    {
      label: "SCHEDULED VISITS TODAY",
      pill: "APPOINTMENTS",
      pillClass: "bg-[#ebf1f6] text-[#355068]",
      value: expectedCount,
      hint: "Pre-registered guests",
    },
    {
      label: "COMPLETED SIGN-OUTS",
      pill: "SHIFT TOTAL",
      pillClass: "bg-[#f0eee7] text-[#5a665f]",
      value: completed,
      hint: "Tags returned & cleared",
    },
  ];

  return (
    <section
      aria-label="Campus Visitor Telemetry"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 px-6 pt-4"
    >
      {cards.map((card) => (
        <article
          key={card.label}
          className="bg-white border border-[#e1ded4] rounded-[10px] p-4 shadow-sm"
        >
          <div className="flex justify-between items-center gap-2 mb-2">
            <span className="text-[10px] font-semibold tracking-[0.06em] text-[#5a665f]">
              {card.label}
            </span>
            <span
              className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${card.pillClass}`}
            >
              {card.pill}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[26px] font-bold leading-none">{card.value}</span>
            <span className="text-[11.5px] text-[#5a665f]">{card.hint}</span>
          </div>
        </article>
      ))}
    </section>
  );
}