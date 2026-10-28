import { useQuery } from '@tanstack/react-query';
import { getJson } from '@/lib/api';

export default function useDoctorOptions() {
  return useQuery({ queryKey: ['doctor-options'], queryFn: () => getJson('/doctors/options'), staleTime: 60_000, select: (r) => r.data });
}
