'use client';
import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getJson, errorMessage } from '@/lib/api';
import useDebounce from '@/hooks/useDebounce';
import useDoctorOptions from '@/hooks/useDoctorOptions';
import PageHeader from '@/components/ui/PageHeader';
import Pagination from '@/components/ui/Pagination';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Select } from '@/components/ui/Field';
import { SearchBox, DateRange, ClearFilters } from '@/components/ui/FilterBar';
import { TableSkeleton, EmptyState, ErrorState } from '@/components/ui/States';
import PatientModal from '@/components/patients/PatientModal';
import PatientsTable from '@/components/patients/PatientsTable';

const initial = { search: '', condition: '', gender: '', doctor: '', from: '', to: '', sort: 'newest' };
const sorts = [{ value: 'newest', label: 'Newest first' }, { value: 'oldest', label: 'Oldest first' }, { value: 'name', label: 'Name A–Z' }];
const genders = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }];

export default function PatientsPage() {
  const qc = useQueryClient();
  const [filters, setFilters] = useState(initial);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState({ open: false, patient: null });
  const [toDelete, setToDelete] = useState(null);

  const search = useDebounce(filters.search);
  const params = { ...filters, search, page, limit: 10 };

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['patients', params],
    queryFn: () => getJson('/patients', params),
    placeholderData: keepPreviousData,
  });
  const { data: facets } = useQuery({ queryKey: ['patient-facets'], queryFn: () => getJson('/patients/facets'), staleTime: 60_000 });
  const { data: doctors = [] } = useDoctorOptions();

  const del = useMutation({
    mutationFn: (id) => api.delete(`/patients/${id}`),
    onSuccess: () => {
      toast.success('Patient deleted');
      setToDelete(null);
      if (data?.data.length === 1 && page > 1) setPage(page - 1);
      qc.invalidateQueries();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const set = useCallback((key) => (value) => { setFilters((f) => ({ ...f, [key]: value })); setPage(1); }, []);
  const onEdit = useCallback((patient) => setModal({ open: true, patient }), []);
  const dirty = JSON.stringify(filters) !== JSON.stringify(initial);
  const patients = data?.data || [];

  return (
    <>
      <PageHeader title="Patients" subtitle="Search, filter and update every patient record.">
        <button className="btn-primary" onClick={() => setModal({ open: true, patient: null })}><Plus size={16} /> Add patient</button>
      </PageHeader>

      <div className="panel">
        <div className="flex flex-col gap-3 border-b border-ink-100 p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchBox value={filters.search} onChange={set('search')} placeholder="Search name, condition, phone or email" />
            <Select value={filters.sort} onChange={set('sort')} options={sorts} aria-label="Sort" className="sm:w-44" />
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
            <Select value={filters.condition} onChange={set('condition')} placeholder="All conditions" options={facets?.conditions || []} className="lg:w-44" aria-label="Condition" />
            <Select value={filters.gender} onChange={set('gender')} placeholder="Any gender" options={genders} className="lg:w-36" aria-label="Gender" />
            <Select value={filters.doctor} onChange={set('doctor')} placeholder="All doctors" options={doctors.map((d) => ({ value: d._id, label: d.name }))} className="lg:w-52" aria-label="Doctor" />
            <DateRange from={filters.from} to={filters.to} onFrom={set('from')} onTo={set('to')} />
            <ClearFilters show={dirty} onClick={() => { setFilters(initial); setPage(1); }} />
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <ErrorState message={errorMessage(error)} onRetry={refetch} />
        ) : patients.length === 0 ? (
          <EmptyState
            title={dirty ? 'No patients match these filters' : 'No patients yet'}
            text={dirty ? 'Try a different search term, condition or date range.' : 'Add a patient and assign them to a doctor.'}
            action={!dirty && <button className="btn-primary" onClick={() => setModal({ open: true, patient: null })}><Plus size={16} /> Add patient</button>}
          />
        ) : (
          <div className={isFetching ? 'opacity-70 transition-opacity' : 'transition-opacity'}>
            <PatientsTable patients={patients} onEdit={onEdit} onDelete={setToDelete} />
            <Pagination meta={data.meta} onPage={setPage} label="patients" />
          </div>
        )}
      </div>

      <PatientModal open={modal.open} patient={modal.patient} onClose={() => setModal({ open: false, patient: null })} />
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete patient?"
        message={toDelete ? `${toDelete.name}’s record will be permanently removed. This can’t be undone.` : ''}
        loading={del.isPending}
        onConfirm={() => del.mutate(toDelete._id)}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
