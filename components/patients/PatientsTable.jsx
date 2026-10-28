import { memo } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { formatDate } from '@/lib/format';

const genderTone = { male: 'bg-[#E3ECF8] text-[#3E6FB0]', female: 'bg-rose-50 text-rose-600', other: 'bg-ink-100 text-ink-600' };

function PatientsTable({ patients, showDoctor = true, onEdit, onDelete, deleteLabel = 'Delete patient' }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead className="border-b border-ink-100 bg-ink-50/70">
          <tr>
            <th className="th">Patient</th>
            <th className="th">Condition</th>
            <th className="th hidden md:table-cell">Contact</th>
            {showDoctor && <th className="th hidden lg:table-cell">Doctor</th>}
            <th className="th hidden sm:table-cell">Added</th>
            <th className="th w-24 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {patients.map((p) => (
            <tr key={p._id} className="hover:bg-ink-50/60">
              <td className="td">
                <div className="flex items-center gap-3">
                  <Avatar name={p.name} />
                  <div>
                    <p className="font-medium text-ink-900">{p.name}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-ink-500">
                      {p.age} yrs <span className={`badge capitalize ${genderTone[p.gender]}`}>{p.gender}</span>
                    </p>
                  </div>
                </div>
              </td>
              <td className="td"><span className="badge bg-brand-50 text-brand-700">{p.condition}</span></td>
              <td className="td hidden md:table-cell">
                <p>{p.phone}</p>
                {p.email && <p className="text-xs text-ink-500">{p.email}</p>}
              </td>
              {showDoctor && (
                <td className="td hidden lg:table-cell">
                  {p.doctor?._id ? (
                    <Link href={`/doctors/${p.doctor._id}`} className="font-medium text-ink-800 hover:text-brand-700">{p.doctor.name}</Link>
                  ) : '—'}
                  {p.doctor?.specialization && <p className="text-xs text-ink-500">{p.doctor.specialization}</p>}
                </td>
              )}
              <td className="td hidden whitespace-nowrap sm:table-cell">{formatDate(p.createdAt)}</td>
              <td className="td">
                <div className="flex justify-end gap-1">
                  {onEdit && (
                    <button className="btn-ghost" onClick={() => onEdit(p)} aria-label={`Edit ${p.name}`}><Pencil size={16} /></button>
                  )}
                  <button className="btn-ghost hover:!bg-rose-50 hover:!text-rose-600" onClick={() => onDelete(p)} aria-label={`${deleteLabel}: ${p.name}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default memo(PatientsTable);
