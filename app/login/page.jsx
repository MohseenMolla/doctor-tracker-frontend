'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Eye, EyeOff, ShieldCheck, MousePointerClick } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { setToken, errorMessage, fieldErrors } from '@/lib/api';
import { Logo } from '@/components/layout/Sidebar';
import { TextInput } from '@/components/ui/Field';

// Demo shortcut for reviewers. Turn it off with NEXT_PUBLIC_DEMO_LOGIN=false.
const SHOW_DEMO = process.env.NEXT_PUBLIC_DEMO_LOGIN !== 'false';
const DEMO = {
  email: process.env.NEXT_PUBLIC_DEMO_EMAIL || 'admin@doctortracker.com',
  password: process.env.NEXT_PUBLIC_DEMO_PASSWORD || 'Admin@123',
};

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    setFormError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      setToken(data.token);
      toast.success(`Welcome back, ${data.user.name}`);
      const next = params.get('next');
      router.replace(next && next.startsWith('/') ? next : '/dashboard');
    } catch (err) {
      setErrors(fieldErrors(err));
      setFormError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <TextInput label="Email" type="email" autoComplete="email" placeholder="you@hospital.com" value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <div>
        <label className="label">Password</label>
        <div className="relative">
          <input className={`input pr-10 ${errors.password ? 'input-error' : ''}`} type={show ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-ink-400 hover:text-ink-700" aria-label={show ? 'Hide password' : 'Show password'}>
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-xs font-medium text-rose-600">{errors.password}</p>}
      </div>
      {formError && !errors.email && !errors.password && (
        <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-600">{formError}</p>
      )}
      <button className="btn-primary h-11 w-full" disabled={loading}>
        {loading && <Loader2 size={16} className="animate-spin" />} Sign in
      </button>
      {SHOW_DEMO && (
        <button
          type="button"
          onClick={() => { setForm(DEMO); setErrors({}); setFormError(''); }}
          className="flex w-full items-center gap-3 rounded-xl border border-dashed border-brand-200 bg-brand-50 px-4 py-3 text-left transition-colors hover:bg-brand-100"
        >
          <MousePointerClick size={18} className="shrink-0 text-brand-700" />
          <span className="min-w-0 text-sm">
            <span className="block font-semibold text-brand-700">Use demo account</span>
            <span className="block truncate text-xs text-ink-600">{DEMO.email}</span>
          </span>
        </button>
      )}
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <section className="relative hidden overflow-hidden bg-ink-900 p-12 text-white lg:flex lg:flex-col">
        <Logo light />
        <div className="mt-auto max-w-md pb-6">
          <h2 className="text-4xl font-semibold leading-tight">Every doctor. Every patient. One steady pulse.</h2>
          <p className="mt-4 text-ink-300">Keep rosters current, see who is seeing whom, and spot workload trends before they become a problem.</p>
        </div>
        <svg className="absolute inset-x-0 top-1/3 w-full opacity-90" viewBox="0 0 800 160" preserveAspectRatio="none" aria-hidden>
          <path
            className="ecg-line animate-draw"
            style={{ strokeDasharray: 1600, strokeDashoffset: 1600 }}
            d="M0 90 H190 L215 90 L240 40 L275 135 L305 20 L335 100 L360 90 H520 L545 90 L570 55 L600 120 L625 90 H800"
            fill="none" stroke="#35A89D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </section>

      <section className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden"><Logo /></div>
          <h1 className="text-3xl font-semibold">Sign in</h1>
          <p className="mb-8 mt-2 text-sm text-ink-500">Use your administrator account to continue.</p>
          <Suspense fallback={null}><LoginForm /></Suspense>
          <p className="mt-8 flex items-center gap-2 text-xs text-ink-500">
            <ShieldCheck size={14} className="text-brand-600" /> Access is limited to authorised administrators.
          </p>
        </div>
      </section>
    </div>
  );
}
