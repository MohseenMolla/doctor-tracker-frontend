'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getJson, errorMessage } from '@/lib/api';
import { formatDate } from '@/lib/format';
import Avatar from '@/components/ui/Avatar';
import PageHeader from '@/components/ui/PageHeader';
import { ErrorState } from '@/components/ui/States';
import ChartPanel from '@/components/dashboard/Panel';
import { TimelineChart, DoctorLoadChart, Donut, SimpleBars } from '@/components/dashboard/Charts';

const ranges = [7, 30, 90];

function Stat({ label, value, note }) {
  return (
    <div className="px-5 py-4 sm:py-5">
      <p className="text-sm text-ink-500">{label}</p>
      <p className="mt-1 font-display text-4xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-brand-700">{note}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="h-32 animate-pulse rounded-2xl bg-ink-100" />
      <div className="h-80 animate-pulse rounded-2xl bg-ink-100" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-2xl bg-ink-100" />
        <div className="h-72 animate-pulse rounded-2xl bg-ink-100" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [days, setDays] = useState(30);
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['dashboard', days],
    queryFn: () => getJson('/dashboard', { days }),
    placeholderData: keepPreviousData,
  });

  return (
    <>
      <PageHeader title="Dashboard" subtitle="How your doctors and patients are trending.">
        <div className="inline-flex rounded-lg border border-ink-200 bg-white p-1" role="group" aria-label="Date range">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setDays(r)}
              aria-pressed={days === r}
              className={`h-8 rounded-md px-3 text-sm font-medium transition-colors ${days === r ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100'}`}
            >
              {r} days
            </button>
          ))}
        </div>
      </PageHeader>

      {isLoading ? (
        <Skeleton />
      ) : isError ? (
        <div className="panel"><ErrorState message={errorMessage(error)} onRetry={refetch} /></div>
      ) : (
        <div className={`space-y-6 transition-opacity ${isFetching ? 'opacity-70' : ''}`}>
          <section className="panel grid divide-y divide-ink-100 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            <Stat label="Total doctors" value={data.totals.doctors} note={`+${data.totals.newDoctors} in the last ${data.days} days`} />
            <Stat label="Total patients" value={data.totals.patients} note={`+${data.totals.newPatients} in the last ${data.days} days`} />
            <Stat label="Patients per doctor" value={data.totals.avgPatientsPerDoctor} note="Average across all doctors" />
            <Stat label="Busiest doctor" value={data.patientsPerDoctor[0]?.patients ?? 0} note={data.patientsPerDoctor[0]?.name || 'No patients yet'} />
          </section>

          <ChartPanel title="Growth over time" subtitle={`New patients and doctors added per day, last ${data.days} days`}>
            <TimelineChart data={data.timeline} />
          </ChartPanel>

          <div className="grid gap-6 lg:grid-cols-5">
            <ChartPanel title="Patients per doctor" subtitle="Top 8 by patient count" className="lg:col-span-3">
              {data.patientsPerDoctor.length ? <DoctorLoadChart data={data.patientsPerDoctor} /> : <p className="py-10 text-center text-sm text-ink-500">No data yet.</p>}
            </ChartPanel>
            <ChartPanel title="Common conditions" subtitle="Most frequent diagnoses" className="lg:col-span-2">
              {data.conditions.length ? <Donut data={data.conditions} /> : <p className="py-10 text-center text-sm text-ink-500">No data yet.</p>}
            </ChartPanel>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <ChartPanel title="Patients by age group">
              <SimpleBars data={data.ageGroups} />
            </ChartPanel>
            <ChartPanel title="Doctors by specialization">
              <SimpleBars data={data.specializations} color="#E9A23B" />
            </ChartPanel>
            <ChartPanel title="Gender split">
              <Donut data={data.gender} />
            </ChartPanel>
          </div>

          <section className="panel">
            <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
              <h2 className="text-base font-semibold">Recently added patients</h2>
              <Link href="/patients" className="text-sm font-medium text-brand-700 hover:underline">View all</Link>
            </div>
            {data.recentPatients.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-ink-500">Patients you add will show up here.</p>
            ) : (
              <ul className="divide-y divide-ink-100">
                {data.recentPatients.map((p) => (
                  <li key={p._id} className="flex items-center gap-3 px-5 py-3.5">
                    <Avatar name={p.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="truncate text-xs text-ink-500">{p.condition} · {p.doctor?.name || 'Unassigned'}</p>
                    </div>
                    <span className="shrink-0 text-xs text-ink-500">{formatDate(p.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </>
  );
}
