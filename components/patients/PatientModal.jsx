'use client';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errorMessage, fieldErrors } from '@/lib/api';
import Modal from '@/components/ui/Modal';
import { TextInput, Select } from '@/components/ui/Field';
import useDoctorOptions from '@/hooks/useDoctorOptions';

const empty = { name: '', age: '', gender: '', phone: '', email: '', condition: '', doctor: '' };
const genders = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }];

/**
 * Create / edit a patient.
 *  - `patient`  -> edit mode
 *  - `doctorId` -> create under a specific doctor (doctor picker hidden)
 */
export default function PatientModal({ open, onClose, patient, doctorId }) {
  const qc = useQueryClient();
  const editing = Boolean(patient);
  const { data: doctors = [] } = useDoctorOptions();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      patient
        ? { name: patient.name, age: patient.age, gender: patient.gender, phone: patient.phone, email: patient.email || '', condition: patient.condition, doctor: patient.doctor?._id || patient.doctor }
        : { ...empty, doctor: doctorId || '' }
    );
  }, [open, patient, doctorId]);

  const mutation = useMutation({
    mutationFn: (values) => {
      if (editing) return api.put(`/patients/${patient._id}`, values);
      if (doctorId) return api.post(`/doctors/${doctorId}/patients`, values);
      return api.post('/patients', values);
    },
    onSuccess: () => {
      toast.success(editing ? 'Patient updated' : 'Patient added');
      qc.invalidateQueries();
      onClose();
    },
    onError: (e) => {
      setErrors(fieldErrors(e));
      toast.error(errorMessage(e));
    },
  });

  const bind = (key) => ({ value: form[key], error: errors[key], onChange: (e) => setForm({ ...form, [key]: e.target.value }) });

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit patient' : 'Add patient'}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setErrors({});
          mutation.mutate(form);
        }}
        className="space-y-4"
        noValidate
      >
        <TextInput label="Full name" placeholder="Rahim Uddin" {...bind('name')} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Age" type="number" min="0" max="130" placeholder="34" {...bind('age')} />
          <Select label="Gender" placeholder="Select gender" options={genders} value={form.gender} error={errors.gender} onChange={(v) => setForm({ ...form, gender: v })} />
          <TextInput label="Phone" type="tel" placeholder="+8801812345678" {...bind('phone')} />
          <TextInput label="Email (optional)" type="email" placeholder="patient@mail.com" {...bind('email')} />
        </div>
        <TextInput label="Condition" placeholder="Hypertension" {...bind('condition')} />
        {!doctorId && (
          <Select
            label="Assigned doctor"
            placeholder="Select a doctor"
            options={doctors.map((d) => ({ value: d._id, label: `${d.name} · ${d.specialization}` }))}
            value={form.doctor}
            error={errors.doctor}
            onChange={(v) => setForm({ ...form, doctor: v })}
          />
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 size={16} className="animate-spin" />} {editing ? 'Save changes' : 'Add patient'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
