'use client';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getJson, errorMessage } from '@/lib/api';
import useDebounce from '@/hooks/useDebounce';
import { formatDate } from '@/lib/format';
import PageHeader from '@/components/ui/PageHeader';
import Avatar from '@/components/ui/Avatar';
import Pagination from '@/components/ui/Pagination';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Select } from '@/components/ui/Field';
import { SearchBox, DateRange, ClearFilters } from '@/components/ui/FilterBar';
import { TableSkeleton, EmptyState, ErrorState } from '@/components/ui/States';
import DoctorModal from '@/components/doctors/DoctorModal';

const initial = { search: '', specialization: '', hospital: '', from: '', to: '', sort: 'newest' };
const sorts = [{ value: 'newest', label: 'Newest first' }, { value: 'oldest', label: 'Oldest first' }, { value: 'name', label: 'Name A–Z' }];

export default function DoctorsPage() {
  const qc = useQueryClient();
  const [filters, setFilters] = useState(initial);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState({ open: false, doctor: null });
  const [toDelete, setToDelete] = useState(null);

  const search = useDebounce(filters.search);
  const params = { ...filters, search, page, limit: 10 };

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['doctors', params],
    queryFn: () => getJson('/doctors', params),
    placeholderData: keepPreviousData,
  });
  const { data: facets } = useQuery({ queryKey: ['doctor-facets'], queryFn: () => getJson('/doctors/facets'), staleTime: 60_000 });

  const del = useMutation({
    mutationFn: (id) => api.delete(`/doctors/${id}`),
    onSuccess: (res) => {
      toast.success(res.data.removedPatients ? `Doctor deleted along with ${res.data.removedPatients} patients` : 'Doctor deleted');
      setToDelete(null);
      qc.invalidateQueries();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const set = useCallback((key) => (value) => { setFilters((f) => ({ ...f, [key]: value })); setPage(1); }, []);
  const dirty = JSON.stringify(filters) !== JSON.stringify(initial);
  const doctors = data?.data || [];

  return (
    <>
      <PageHeader title="Doctors" subtitle="Everyone on the roster, with their current patient load.">
        <button className="btn-primary" onClick={() => setModal({ open: true, doctor: null })}><Plus size={16} /> Add doctor</button>
      </PageHeader>

      <div className="panel">
        <div className="flex flex-col gap-3 border-b border-ink-100 p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchBox value={filters.search} onChange={set('search')} placeholder="Search name, hospital, email or phone" />
            <Select value={filters.sort} onChange={set('sort')} options={sorts} aria-label="Sort" className="sm:w-44" />
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <Select value={filters.specialization} onChange={set('specialization')} placeholder="All specializations" options={facets?.specializations || []} className="lg:w-52" aria-label="Specialization" />
            <Select value={filters.hospital} onChange={set('hospital')} placeholder="All hospitals" options={facets?.hospitals || []} className="lg:w-52" aria-label="Hospital" />
            <DateRange from={filters.from} to={filters.to} onFrom={set('from')} onTo={set('to')} />
            <ClearFilters show={dirty} onClick={() => { setFilters(initial); setPage(1); }} />
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <ErrorState message={errorMessage(error)} onRetry={refetch} />
        ) : doctors.length === 0 ? (
          <EmptyState
            title={dirty ? 'No doctors match these filters' : 'No doctors yet'}
            text={dirty ? 'Try a different search term or widen the date range.' : 'Add your first doctor to start assigning patients.'}
            action={!dirty && <button className="btn-primary" onClick={() => setModal({ open: true, doctor: null })}><Plus size={16} /> Add doctor</button>}
          />
        ) : (
          <div className={isFetching ? 'opacity-70 transition-opacity' : 'transition-opacity'}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="border-b border-ink-100 bg-ink-50/70">
                  <tr>
                    <th className="th">Doctor</th>
                    <th className="th hidden md:table-cell">Hospital</th>
                    <th className="th hidden lg:table-cell">Contact</th>
                    <th className="th">Patients</th>
                    <th className="th hidden sm:table-cell">Joined</th>
                    <th className="th w-28 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {doctors.map((d) => (
                    <tr key={d._id} className="hover:bg-ink-50/60">
                      <td className="td">
                        <Link href={`/doctors/${d._id}`} className="group flex items-center gap-3">
                          <Avatar name={d.name} />
                          <div>
                            <p className="font-medium text-ink-900 group-hover:text-brand-700">{d.name}</p>
                            <p className="text-xs text-ink-500">{d.specialization}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="td hidden md:table-cell">{d.hospital}</td>
                      <td className="td hidden lg:table-cell">
                        <p>{d.phone}</p>
                        <p className="text-xs text-ink-500">{d.email}</p>
                      </td>
                      <td className="td"><span className="badge bg-ink-100 font-semibold text-ink-800">{d.patientCount}</span></td>
                      <td className="td hidden whitespace-nowrap sm:table-cell">{formatDate(d.createdAt)}</td>
                      <td className="td">
                        <div className="flex justify-end gap-1">
                          <Link href={`/doctors/${d._id}`} className="btn-ghost" aria-label={`Open ${d.name}`}><ArrowUpRight size={16} /></Link>
                          <button className="btn-ghost" onClick={() => setModal({ open: true, doctor: d })} aria-label={`Edit ${d.name}`}><Pencil size={16} /></button>
                          <button className="btn-ghost hover:!bg-rose-50 hover:!text-rose-600" onClick={() => setToDelete(d)} aria-label={`Delete ${d.name}`}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination meta={data.meta} onPage={setPage} label="doctors" />
          </div>
        )}
      </div>

      <DoctorModal open={modal.open} doctor={modal.doctor} onClose={() => setModal({ open: false, doctor: null })} />
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete doctor?"
        message={toDelete ? `${toDelete.name} and their ${toDelete.patientCount} assigned patient${toDelete.patientCount === 1 ? '' : 's'} will be permanently removed. This can’t be undone.` : ''}
        loading={del.isPending}
        onConfirm={() => del.mutate(toDelete._id)}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
