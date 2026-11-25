export default function ScheduledVisits({
  expected,
  onOpenScheduleModal,
  onCheckInExpected,
  onRemoveExpected,
}) {
  return (
    <div>
      <div className="flex justify-between items-center gap-3 mb-3.5">
        <div>
          <h2 className="m-0 text-base font-bold">Pre-Scheduled Campus Appointments</h2>
          <p className="m-0 text-xs text-[#5a665f]">
            Submitted by CvSU departments and administrative offices for today.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenScheduleModal}
          className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white border border-[#c8c3b4] hover:bg-[#f0eee7] transition cursor-pointer"
        >
          + Schedule Visit
        </button>
      </div>

      {expected.length === 0 ? (
        <div className="text-center text-[#5a665f] text-[12.5px] py-8">
          No remaining scheduled campus visits for today.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {expected.map((exp) => (
            <div
              key={exp.id}
              className="border border-[#e1ded4] border-t-[3px] border-t-[#14452f] rounded-md p-3.5 bg-[#fcfcfa] flex flex-col gap-2"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <strong className="block">{exp.name}</strong>
                  <div className="text-[11.5px] text-[#5a665f]">{exp.org}</div>
                </div>
                <span className="text-[11px] font-bold bg-[#fbf4e4] text-[#7c5811] px-2 py-0.5 rounded shrink-0">
                  ETA {exp.scheduledTime}
                </span>
              </div>

              <div className="text-xs text-[#5a665f] space-y-0.5">
                <div>
                  <strong className="text-[#16221c]">Office:</strong> {exp.office}
                </div>
                <div>
                  <strong className="text-[#16221c]">Host:</strong> {exp.host}
                </div>
                <div>
                  <strong className="text-[#16221c]">Purpose:</strong> {exp.purpose}
                </div>
              </div>

              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => onCheckInExpected(exp)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[#14452f] hover:bg-[#0e3222] text-white transition cursor-pointer"
                >
                  Check In Visitor
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveExpected(exp)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white border border-[#c8c3b4] hover:bg-[#f0eee7] transition cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}