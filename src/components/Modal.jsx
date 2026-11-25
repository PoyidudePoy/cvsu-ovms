import { useState } from "react";
import { CVSU_OFFICES } from "../data/cvsuData";

export function Modal({ isOpen, title, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-[#11241b]/50 backdrop-blur-[2px] grid place-items-center p-4 z-50"
    >
      <div className="bg-white border border-[#e1ded4] rounded-[10px] w-full max-w-[470px] shadow-2xl overflow-hidden">
        <div className="px-4 py-3 bg-[#f0eee7] border-b border-[#e1ded4] flex justify-between items-center">
          <h3 className="m-0 text-[15px] font-bold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-xl text-[#5a665f] hover:text-[#16221c] leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export function NoteModalForm({ onSubmit, onCancel }) {
  const [text, setText] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit(text.trim());
      }}
    >
      <div className="mb-3">
        <label className="block text-xs font-semibold mb-1">
          Remark / Escort / Delivery Update
        </label>
        <input
          type="text"
          required
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g., Confirmed arrival at Registrar Window 2"
          className="w-full px-2.5 py-2 border border-[#c8c3b4] rounded-md text-[13px] focus:outline-none focus:border-[#14452f]"
        />
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white border border-[#c8c3b4] hover:bg-[#f0eee7] cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#14452f] hover:bg-[#0e3222] text-white cursor-pointer"
        >
          Save Remark
        </button>
      </div>
    </form>
  );
}

export function ScheduleModalForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    org: "",
    scheduledTime: "15:00",
    host: "",
    office: CVSU_OFFICES[0].name,
    purpose: "",
  });

  const inputClass =
    "w-full px-2.5 py-2 border border-[#c8c3b4] rounded-md text-[13px] bg-white focus:outline-none focus:border-[#14452f]";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="mb-3">
        <label className="block text-xs font-semibold mb-1">Visitor Full Name *</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g., Prof. Elena Navarro"
          className={inputClass}
        />
      </div>
      <div className="mb-3">
        <label className="block text-xs font-semibold mb-1">Affiliation / Institution *</label>
        <input
          type="text"
          required
          value={form.org}
          onChange={(e) => setForm({ ...form, org: e.target.value })}
          placeholder="e.g., UPLB Extension Office"
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Expected Time *</label>
          <input
            type="time"
            required
            value={form.scheduledTime}
            onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Person to Visit *</label>
          <input
            type="text"
            required
            value={form.host}
            onChange={(e) => setForm({ ...form, host: e.target.value })}
            placeholder="e.g., Dr. R. Pangilinan"
            className={inputClass}
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-xs font-semibold mb-1">Destination Office *</label>
        <select
          value={form.office}
          onChange={(e) => setForm({ ...form, office: e.target.value })}
          className={inputClass}
        >
          {CVSU_OFFICES.map((o) => (
            <option key={o.id} value={o.name}>
              {o.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="block text-xs font-semibold mb-1">Purpose of Visit *</label>
        <input
          type="text"
          required
          value={form.purpose}
          onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          placeholder="e.g., Research Partnership Meeting"
          className={inputClass}
        />
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white border border-[#c8c3b4] hover:bg-[#f0eee7] cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#14452f] hover:bg-[#0e3222] text-white cursor-pointer"
        >
          Save Appointment
        </button>
      </div>
    </form>
  );
}

export function DenyModalForm({ visitorName, defaultReason, onSubmit, onCancel }) {
  const [reason, setReason] = useState(
    defaultReason || "No valid ID / Refused desk log-in"
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!reason.trim()) return;
        onSubmit(reason.trim());
      }}
    >
      <p className="text-xs text-[#5a665f] mt-0 mb-2.5">
        Logging denied entry for <strong className="text-[#16221c]">{visitorName}</strong>.
      </p>
      <div className="mb-3">
        <label className="block text-xs font-semibold mb-1">Reason for Denial *</label>
        <input
          type="text"
          required
          autoFocus
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-2.5 py-2 border border-[#c8c3b4] rounded-md text-[13px] focus:outline-none focus:border-[#a12626]"
        />
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white border border-[#c8c3b4] hover:bg-[#f0eee7] cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#a12626] hover:bg-[#841d1d] text-white cursor-pointer"
        >
          Confirm Deny Entry
        </button>
      </div>
    </form>
  );
}