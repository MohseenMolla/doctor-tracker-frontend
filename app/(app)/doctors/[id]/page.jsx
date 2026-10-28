'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { ArrowLeft, Building2, Mail, Phone, Pencil, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getJson, errorMessage } from '@/lib/api';
import { formatDate } from '@/lib/format';
import Avatar from '@/components/ui/Avatar';
import Pagination from '@/components/ui/Pagination';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { TableSkeleton, EmptyState, ErrorState } from '@/components/ui/States';
import DoctorModal from '@/components/doctors/DoctorModal';
import PatientModal from '@/components/patients/PatientModal';
import PatientsTable from '@/components/patients/PatientsTable';

export default function DoctorDetailPage() {
  const { id } = useParams();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [editDoctor, setEditDoctor] = useState(false);
  const [addPatient, setAddPatient] = useState(false);
  const [toRemove, setToRemove] = useState(null);

  const doctorQ = useQuery({ queryKey: ['doctor', id], queryFn: () => getJson(`/doctors/${id}`), select: (r) => r.data });
  const patientsQ = useQuery({
    queryKey: ['doctor-patients', id, page],
    queryFn: () => getJson(`/doctors/${id}/patients`, { page, limit: 8 }),
    placeholderData: keepPreviousData,
  });

  const remove = useMutation({
    mutationFn: (patientId) => api.delete(`/doctors/${id}/patients/${patientId}`),
    onSuccess: () => {
      toast.success('Patient removed');
      setToRemove(null);
      // If the last patient on the page was removed, step back one page.
      if (patientsQ.data?.data.length === 1 && page > 1) setPage(page - 1);
      qc.invalidateQueries();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  if (doctorQ.isError) {
    return (
      <div className="panel">
        <ErrorState message={errorMessage(doctorQ.error)} onRetry={doctorQ.refetch} />
      </div>
    );
  }
  const d = doctorQ.data;
  const patients = patientsQ.data?.data || [];

  return (
    <>
      <Link href="/doctors" className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900">
        <ArrowLeft size={16} /> All doctors
      </Link>

      <section className="panel mb-6 p-5 sm:p-6">
        {!d ? (
          <div className="h-20 animate-pulse rounded-lg bg-ink-100" />
        ) : (
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <Avatar name={d.name} size={56} />
              <div>
                <h1 className="text-2xl font-semibold">{d.name}</h1>
                <p className="mt-0.5 text-sm font-medium text-brand-700">{d.specialization}</p>
                <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-600">
                  <div className="flex items-center gap-2"><Building2 size={15} className="text-ink-400" /><dd>{d.hospital}</dd></div>
                  <div className="flex items-center gap-2"><Phone size={15} className="text-ink-400" /><dd>{d.phone}</dd></div>
                  <div className="flex items-center gap-2"><Mail size={15} className="text-ink-400" /><dd>{d.email}</dd></div>
                </dl>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-brand-50 px-4 py-2 text-center">
                <p className="font-display text-2xl font-semibold text-brand-700">{d.patientCount}</p>
                <p className="text-xs text-brand-700/80">patients</p>
              </div>
              <button className="btn-secondary" onClick={() => setEditDoctor(true)}><Pencil size={15} /> Edit</button>
            </div>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="flex flex-col gap-3 border-b border-ink-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Patients</h2>
            {d && <p className="text-xs text-ink-500">On the roster since {formatDate(d.createdAt)}</p>}
          </div>
          <button className="btn-primary" onClick={() => setAddPatient(true)}><Plus size={16} /> Add patient</button>
        </div>

        {patientsQ.isLoading ? (
          <TableSkeleton rows={4} cols={4} />
        ) : patientsQ.isError ? (
          <ErrorState message={errorMessage(patientsQ.error)} onRetry={patientsQ.refetch} />
        ) : patients.length === 0 ? (
          <EmptyState
            title="No patients assigned"
            text="Patients you add here will be listed under this doctor."
            action={<button className="btn-primary" onClick={() => setAddPatient(true)}><Plus size={16} /> Add patient</button>}
          />
        ) : (
          <>
            <PatientsTable patients={patients} showDoctor={false} onDelete={setToRemove} deleteLabel="Remove patient" />
            <Pagination meta={patientsQ.data.meta} onPage={setPage} label="patients" />
          </>
        )}
      </section>

      <DoctorModal open={editDoctor} doctor={d} onClose={() => setEditDoctor(false)} />
      <PatientModal open={addPatient} doctorId={id} onClose={() => setAddPatient(false)} />
      <ConfirmDialog
        open={Boolean(toRemove)}
        title="Remove patient?"
        message={toRemove ? `${toRemove.name} will be deleted from ${d?.name}’s list. This can’t be undone.` : ''}
        confirmLabel="Remove"
        loading={remove.isPending}
        onConfirm={() => remove.mutate(toRemove._id)}
        onClose={() => setToRemove(null)}
      />
    </>
  );
}
