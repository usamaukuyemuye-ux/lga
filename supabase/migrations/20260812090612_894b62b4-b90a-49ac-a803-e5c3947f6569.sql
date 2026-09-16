
CREATE TABLE public.staff_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  staff_name text,
  status text NOT NULL DEFAULT 'present',
  attendance_date date NOT NULL DEFAULT ((now() AT TIME ZONE 'utc')::date),
  arrival_time timestamptz,
  departure_time timestamptz,
  recorded_by uuid REFERENCES public.profiles(id),
  recorded_by_name text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff_attendance TO authenticated;
GRANT ALL ON public.staff_attendance TO service_role;

ALTER TABLE public.staff_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff attendance read" ON public.staff_attendance FOR SELECT TO authenticated
USING (
  staff_id = auth.uid()
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'secretary'::app_role)
  OR has_role(auth.uid(), 'owner'::app_role)
);

CREATE POLICY "staff attendance manage" ON public.staff_attendance FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'secretary'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'secretary'::app_role));

CREATE TRIGGER staff_attendance_updated_at BEFORE UPDATE ON public.staff_attendance
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Owner read-only visibility
DROP POLICY IF EXISTS "students read" ON public.students;
CREATE POLICY "students read" ON public.students FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'secretary'::app_role)
  OR has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'owner'::app_role)
  OR parent_id = auth.uid()
);

DROP POLICY IF EXISTS "attendance read" ON public.attendance;
CREATE POLICY "attendance read" ON public.attendance FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'secretary'::app_role)
  OR has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'owner'::app_role)
  OR EXISTS (SELECT 1 FROM public.students s WHERE s.id = attendance.student_id AND s.parent_id = auth.uid())
);

DROP POLICY IF EXISTS "payments read" ON public.payments;
CREATE POLICY "payments read" ON public.payments FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'finance'::app_role)
  OR has_role(auth.uid(), 'secretary'::app_role) OR has_role(auth.uid(), 'owner'::app_role)
  OR EXISTS (SELECT 1 FROM public.students s WHERE s.id = payments.student_id AND s.parent_id = auth.uid())
);

DROP POLICY IF EXISTS "own profile read" ON public.profiles;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated
USING (
  id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'secretary'::app_role)
  OR has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'owner'::app_role)
);

DROP POLICY IF EXISTS "notifications read" ON public.notifications;
CREATE POLICY "notifications read" ON public.notifications FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'secretary'::app_role)
  OR has_role(auth.uid(), 'owner'::app_role) OR parent_id = auth.uid()
);

DROP POLICY IF EXISTS "audit read" ON public.audit_logs;
CREATE POLICY "audit read" ON public.audit_logs FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role));
