'use client';
import { memo } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { shortDay } from '@/lib/format';

export const COLORS = ['#0E8F86', '#E9A23B', '#3E6FB0', '#D0577A', '#7FA650', '#8AA0A3'];
const axis = { fontSize: 12, fill: '#5E7A7F' };
const tip = { contentStyle: { borderRadius: 10, border: '1px solid #D9E3E2', fontSize: 13, boxShadow: '0 8px 24px -12px rgba(14,42,47,.2)' } };

export const TimelineChart = memo(function TimelineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0E8F86" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#0E8F86" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#E9F0EF" vertical={false} />
        <XAxis dataKey="date" tickFormatter={shortDay} tick={axis} tickLine={false} axisLine={false} minTickGap={28} />
        <YAxis allowDecimals={false} tick={axis} tickLine={false} axisLine={false} />
        <Tooltip {...tip} labelFormatter={shortDay} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
        <Area type="monotone" dataKey="patients" name="New patients" stroke="#0E8F86" strokeWidth={2.5} fill="url(#gp)" />
        <Area type="monotone" dataKey="doctors" name="New doctors" stroke="#E9A23B" strokeWidth={2.5} fill="none" />
      </AreaChart>
    </ResponsiveContainer>
  );
});

export const DoctorLoadChart = memo(function DoctorLoadChart({ data }) {
  const rows = data.map((d) => ({ ...d, label: d.name.replace(/^Dr\.?\s+/i, '') }));
  return (
    <ResponsiveContainer width="100%" height={Math.max(rows.length * 40 + 20, 160)}>
      <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#E9F0EF" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={axis} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="label" width={118} tick={axis} tickLine={false} axisLine={false} />
        <Tooltip {...tip} cursor={{ fill: '#F3F7F6' }} formatter={(v) => [v, 'Patients']} />
        <Bar dataKey="patients" fill="#0E8F86" radius={[0, 6, 6, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
});

export const Donut = memo(function Donut({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} paddingAngle={2} stroke="none">
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip {...tip} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="font-display text-2xl font-semibold">{total}</p>
            <p className="text-xs text-ink-500">patients</p>
          </div>
        </div>
      </div>
      <ul className="w-full space-y-2 text-sm">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-ink-700">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} /> <span className="capitalize">{d.name}</span>
            </span>
            <span className="font-medium text-ink-900">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});

export const SimpleBars = memo(function SimpleBars({ data, color = '#3E6FB0' }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid stroke="#E9F0EF" vertical={false} />
        <XAxis dataKey="name" tick={axis} tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tick={axis} tickLine={false} axisLine={false} />
        <Tooltip {...tip} cursor={{ fill: '#F3F7F6' }} />
        <Bar dataKey="value" name="Patients" fill={color} radius={[6, 6, 0, 0]} maxBarSize={44} />
      </BarChart>
    </ResponsiveContainer>
  );
});
