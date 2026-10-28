'use client';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errorMessage, fieldErrors } from '@/lib/api';
import Modal from '@/components/ui/Modal';
import { TextInput } from '@/components/ui/Field';

const empty = { name: '', specialization: '', hospital: '', phone: '', email: '' };

export default function DoctorModal({ open, onClose, doctor }) {
  const qc = useQueryClient();
  const editing = Boolean(doctor);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setErrors({});
      setForm(doctor ? { name: doctor.name, specialization: doctor.specialization, hospital: doctor.hospital, phone: doctor.phone, email: doctor.email } : empty);
    }
  }, [open, doctor]);

  const mutation = useMutation({
    mutationFn: (values) => (editing ? api.put(`/doctors/${doctor._id}`, values) : api.post('/doctors', values)),
    onSuccess: () => {
      toast.success(editing ? 'Doctor updated' : 'Doctor added');
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
    <Modal open={open} onClose={onClose} title={editing ? 'Edit doctor' : 'Add doctor'}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setErrors({});
          mutation.mutate(form);
        }}
        className="space-y-4"
        noValidate
      >
        <TextInput label="Full name" placeholder="Dr. Shirin Akter" {...bind('name')} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Specialization" placeholder="Cardiology" {...bind('specialization')} />
          <TextInput label="Hospital" placeholder="Square Hospital" {...bind('hospital')} />
          <TextInput label="Phone" type="tel" placeholder="+8801712345678" {...bind('phone')} />
          <TextInput label="Email" type="email" placeholder="doctor@hospital.com" {...bind('email')} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 size={16} className="animate-spin" />} {editing ? 'Save changes' : 'Add doctor'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
