'use client';
import { Loader2, TriangleAlert } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', loading, onConfirm, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex gap-3">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-600">
          <TriangleAlert size={18} />
        </span>
        <p className="text-sm leading-relaxed text-ink-600">{message}</p>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
        <button className="btn-danger" onClick={onConfirm} disabled={loading}>
          {loading && <Loader2 size={16} className="animate-spin" />} {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
